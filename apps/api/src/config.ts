export interface Config {
  port: number;
  discordWebhookUrl: string | undefined;
  discordMentionUserIds: string[];
  discordUsername: string;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  trustProxyHops: number;
}

function int(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined || value.trim() === '') return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${name} musi być nieujemną liczbą całkowitą`);
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const webhook = env.DISCORD_WEBHOOK_URL?.trim() || undefined;
  if (webhook && !/^https:\/\/(?:\w+\.)?discord(?:app)?\.com\/api\/webhooks\//.test(webhook)) {
    throw new Error('DISCORD_WEBHOOK_URL nie wygląda na adres webhooka Discord');
  }

  const mentionIds = (env.DISCORD_MENTION_USER_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  for (const id of mentionIds) {
    if (!/^\d{15,22}$/.test(id)) throw new Error(`DISCORD_MENTION_USER_IDS: niepoprawne ID „${id}”`);
  }

  return {
    port: int(env.PORT, 3000, 'PORT'),
    discordWebhookUrl: webhook,
    discordMentionUserIds: mentionIds,
    discordUsername: env.DISCORD_USERNAME?.trim() || 'Twoja Budka',
    rateLimitMax: int(env.RATE_LIMIT_MAX, 5, 'RATE_LIMIT_MAX'),
    rateLimitWindowMs: int(env.RATE_LIMIT_WINDOW_MS, 10 * 60 * 1000, 'RATE_LIMIT_WINDOW_MS'),
    trustProxyHops: int(env.TRUST_PROXY_HOPS, 0, 'TRUST_PROXY_HOPS'),
  };
}
