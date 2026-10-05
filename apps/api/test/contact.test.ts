import { describe, expect, it, vi } from 'vitest';
import type { ContactData } from '@twojabudka/shared';
import { createApp } from '../src/app.ts';
import { loadConfig } from '../src/config.ts';
import { buildPayload, sendToDiscord } from '../src/discord.ts';

type Body = { ok: boolean; error?: string; fields?: Record<string, string> };
const json = async (res: Response) => (await res.json()) as Body;

const NOW = 1_700_000_000_000;
const valid = {
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  phone: '+48 123 456 789',
  message: 'Wesele 12 czerwca, Koszalin',
  website: '',
  startedAt: NOW - 10_000,
};

function setup(overrides: Partial<ReturnType<typeof loadConfig>> = {}) {
  const send = vi.fn(async (_: ContactData) => {});
  const config = { ...loadConfig({}), ...overrides };
  const app = createApp({ config, send, now: () => NOW });
  const post = (body: unknown, headers: Record<string, string> = {}) =>
    app.request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
  return { app, send, post };
}

describe('POST /api/contact', () => {
  it('wysyła poprawne zgłoszenie', async () => {
    const { post, send } = setup();
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await json(res)).toEqual({ ok: true });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0].name).toBe('Jan Kowalski');
  });

  it('zwraca błędy pól', async () => {
    const { post, send } = setup();
    const res = await post({ ...valid, email: 'zly', message: '  ' });
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body.error).toBe('validation');
    expect(Object.keys(body.fields ?? {}).sort()).toEqual(['email', 'message']);
    expect(send).not.toHaveBeenCalled();
  });

  it('odrzuca niepoprawny JSON', async () => {
    const { post } = setup();
    expect((await post('{nie json')).status).toBe(400);
  });

  it('honeypot: udaje sukces i nic nie wysyła', async () => {
    const { post, send } = setup();
    const res = await post({ ...valid, website: 'http://spam' });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('zbyt szybka wysyłka: udaje sukces i nic nie wysyła', async () => {
    const { post, send } = setup();
    const res = await post({ ...valid, startedAt: NOW - 500 });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('limit zapytań na IP', async () => {
    const { post } = setup({ rateLimitMax: 2, trustProxyHops: 1 });
    const a = { 'X-Forwarded-For': '1.1.1.1' };
    expect((await post(valid, a)).status).toBe(200);
    expect((await post(valid, a)).status).toBe(200);
    expect((await post(valid, a)).status).toBe(429);
    expect((await post(valid, { 'X-Forwarded-For': '2.2.2.2' })).status).toBe(200);
  });

  it('błąd wysyłki → 502', async () => {
    const { post, send } = setup();
    send.mockRejectedValueOnce(new Error('discord down'));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await json(res)).error).toBe('delivery_failed');
  });

  it('health', async () => {
    const { app } = setup();
    expect((await app.request('/api/health')).status).toBe(200);
  });
});

describe('Discord', () => {
  const data = { ...valid, message: '@everyone **kup teraz** <@&123456789012345678>' } as ContactData;

  it('blokuje @everyone i role, pinguje tylko skonfigurowanych', () => {
    const p = buildPayload(data, { mentionUserIds: ['201688841571008512'], username: 'Twoja Budka' });
    expect(p.allowed_mentions).toEqual({ parse: [], users: ['201688841571008512'] });
    expect(p.content).toContain('<@201688841571008512>');
    const desc = p.embeds[0].description;
    expect(desc).not.toContain('@everyone');
    expect(desc).not.toContain('<@&');
    expect(desc).toContain('\\*\\*kup teraz\\*\\*');
  });

  const opts = (fetchImpl: typeof fetch) => ({
    webhookUrl: 'https://discord.com/api/webhooks/1/x',
    mentionUserIds: [],
    username: 'Twoja Budka',
    fetchImpl,
    sleep: async () => {},
  });

  it('ponawia raz po 429', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ retry_after: 0.5 }, { status: 429 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    await sendToDiscord(data, opts(fetchImpl));
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('rzuca błąd, gdy ponowna próba też się nie uda', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => new Response(null, { status: 500 }));
    await expect(sendToDiscord(data, opts(fetchImpl))).rejects.toThrow('500');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('rzuca błąd przy 4xx bez ponawiania', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 }));
    await expect(sendToDiscord(data, opts(fetchImpl))).rejects.toThrow('404');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});

describe('config', () => {
  it('odrzuca zły adres webhooka i ID', () => {
    expect(() => loadConfig({ DISCORD_WEBHOOK_URL: 'https://evil.example/x' })).toThrow();
    expect(() => loadConfig({ DISCORD_MENTION_USER_IDS: 'abc' })).toThrow();
    expect(loadConfig({ DISCORD_MENTION_USER_IDS: '444596625571053568, 201688841571008512' }).discordMentionUserIds).toHaveLength(2);
  });
});
