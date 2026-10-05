import { serve } from '@hono/node-server';
import { createApp } from './app.ts';
import { loadConfig } from './config.ts';

const config = loadConfig();
if (!config.discordWebhookUrl) {
  console.warn('UWAGA: brak DISCORD_WEBHOOK_URL — zgłoszenia z formularza będą kończyć się błędem 502.');
}

const server = serve({ fetch: createApp({ config }).fetch, port: config.port }, (info) => {
  console.info(`api: nasłuch na porcie ${info.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
