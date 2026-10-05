import type { ContactData } from '@twojabudka/shared';

export interface DiscordOptions {
  webhookUrl: string;
  mentionUserIds: string[];
  username: string;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

const GOLD = 0xd4af37;
const MAX_RETRY_WAIT_MS = 5000;

// Neutralizuje markdown i wzmianki Discorda w treści od klienta.
export function escapeMarkdown(text: string): string {
  return text
    .replace(/([\\*_~`|>#[\]()-])/g, '\\$1')
    .replace(/@/g, '@​')
    .replace(/<(?=[@#:])/g, '<​');
}

export function buildPayload(data: ContactData, opts: Pick<DiscordOptions, 'mentionUserIds' | 'username'>) {
  const fields = [
    { name: 'Imię', value: escapeMarkdown(data.name), inline: true },
    { name: 'Telefon', value: escapeMarkdown(data.phone), inline: true },
    { name: 'Email', value: escapeMarkdown(data.email), inline: true },
  ];
  if (data.eventType) fields.push({ name: 'Okazja', value: escapeMarkdown(data.eventType), inline: true });
  if (data.eventDate) fields.push({ name: 'Data wydarzenia', value: data.eventDate, inline: true });

  const mentions = opts.mentionUserIds.map((id) => `<@${id}>`).join(' ');

  return {
    username: opts.username,
    content: `Nowe zapytanie ze strony${mentions ? ` ${mentions}` : ''}`,
    // Pingujemy tylko skonfigurowanych użytkowników; @everyone/@here i role są zablokowane.
    allowed_mentions: { parse: [] as string[], users: opts.mentionUserIds },
    embeds: [
      {
        title: 'Nowe zapytanie ze strony',
        description: escapeMarkdown(data.message).slice(0, 4096),
        color: GOLD,
        timestamp: new Date().toISOString(),
        fields,
      },
    ],
  };
}

async function retryDelay(res: Response): Promise<number> {
  try {
    const body = (await res.json()) as { retry_after?: number };
    if (typeof body.retry_after === 'number') return body.retry_after * 1000;
  } catch {
    // brak JSON — spróbuj nagłówka
  }
  const header = Number(res.headers.get('retry-after'));
  return Number.isFinite(header) && header > 0 ? header * 1000 : 1000;
}

/** Wysyła zgłoszenie na webhook; jedna ponowna próba przy 429, 5xx lub błędzie sieci. */
export async function sendToDiscord(data: ContactData, opts: DiscordOptions): Promise<void> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const sleep = opts.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));
  const body = JSON.stringify(buildPayload(data, opts));

  const attempt = () =>
    fetchImpl(opts.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(10_000),
    });

  let res: Response;
  try {
    res = await attempt();
  } catch (err) {
    console.warn('discord: błąd sieci, ponawiam', (err as Error).name);
    await sleep(1000);
    res = await attempt();
  }

  if (res.status === 429 || res.status >= 500) {
    const wait = res.status === 429 ? await retryDelay(res) : 1000;
    if (wait > MAX_RETRY_WAIT_MS) throw new Error(`discord: ${res.status}, retry_after ${wait} ms`);
    console.warn(`discord: ${res.status}, ponawiam za ${wait} ms`);
    await sleep(wait);
    res = await attempt();
  }

  if (!res.ok) throw new Error(`discord: odpowiedź ${res.status}`);
}
