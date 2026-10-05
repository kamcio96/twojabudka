import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { getConnInfo } from '@hono/node-server/conninfo';
import { contactSchema, fieldErrors, MIN_FILL_TIME_MS, type ContactData, type ContactResponse } from '@twojabudka/shared';
import type { Config } from './config.ts';
import { createRateLimiter } from './rateLimit.ts';
import { sendToDiscord } from './discord.ts';

export interface AppDeps {
  config: Config;
  send?: (data: ContactData) => Promise<void>;
  now?: () => number;
}

export function createApp({ config, send, now = Date.now }: AppDeps) {
  const api = new Hono();
  const limiter = createRateLimiter(config.rateLimitMax, config.rateLimitWindowMs, now);

  const deliver =
    send ??
    (async (data: ContactData) => {
      if (!config.discordWebhookUrl) throw new Error('brak DISCORD_WEBHOOK_URL');
      await sendToDiscord(data, {
        webhookUrl: config.discordWebhookUrl,
        mentionUserIds: config.discordMentionUserIds,
        username: config.discordUsername,
      });
    });

  const clientIp = (c: Parameters<typeof getConnInfo>[0]): string => {
    if (config.trustProxyHops > 0) {
      const xff = c.req.header('x-forwarded-for');
      if (xff) {
        const ips = xff.split(',').map((s) => s.trim()).filter(Boolean);
        const ip = ips[Math.max(0, ips.length - config.trustProxyHops)];
        if (ip) return ip;
      }
    }
    try {
      return getConnInfo(c).remote.address ?? 'unknown';
    } catch {
      return 'unknown';
    }
  };

  api.get('/health', (c) => c.json({ ok: true }));

  api.post(
    '/contact',
    bodyLimit({
      maxSize: 16 * 1024,
      onError: (c) => c.json<ContactResponse>({ ok: false, error: 'bad_request' }, 413),
    }),
    async (c) => {
      if (!limiter.hit(clientIp(c))) {
        return c.json<ContactResponse>({ ok: false, error: 'rate_limited' }, 429);
      }

      let raw: unknown;
      try {
        raw = await c.req.json();
      } catch {
        return c.json<ContactResponse>({ ok: false, error: 'bad_request' }, 400);
      }

      const parsed = contactSchema.safeParse(raw);
      if (!parsed.success) {
        return c.json<ContactResponse>({ ok: false, error: 'validation', fields: fieldErrors(parsed.error) }, 400);
      }
      const data = parsed.data;

      // Boty: wypełniony honeypot albo wysyłka szybsza niż człowiek. Udajemy sukces.
      const tooFast = data.startedAt !== undefined && now() - data.startedAt < MIN_FILL_TIME_MS;
      if (data.website || tooFast) {
        console.info(`contact: odrzucony spam (${data.website ? 'honeypot' : 'za szybko'})`);
        return c.json<ContactResponse>({ ok: true });
      }

      try {
        await deliver(data);
      } catch (err) {
        console.error('contact: nie udało się wysłać zgłoszenia:', (err as Error).message);
        return c.json<ContactResponse>({ ok: false, error: 'delivery_failed' }, 502);
      }

      console.info('contact: zgłoszenie wysłane');
      return c.json<ContactResponse>({ ok: true });
    },
  );

  // Pod /api (proxy nginx w usłudze web) i bez prefiksu (domena w Coolify przypisana
  // bezpośrednio do usługi api z obcinaniem prefiksu /api).
  const app = new Hono();
  app.route('/api', api);
  app.route('/', api);

  app.notFound((c) => c.json({ ok: false, error: 'not_found' }, 404));
  app.onError((err, c) => {
    console.error('api: nieobsłużony błąd:', err.message);
    return c.json({ ok: false, error: 'internal' }, 500);
  });

  return app;
}
