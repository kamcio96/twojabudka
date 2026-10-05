# Twoja Budka — strona i API formularza

Monorepo (npm workspaces):

| Katalog | Co to jest |
|---|---|
| `apps/web` | strona (React + Vite + Tailwind), w produkcji serwowana przez nginx |
| `apps/api` | API formularza kontaktowego (Node 22 + Hono), wysyła zgłoszenia na webhook Discord |
| `packages/shared` | schemat zod formularza, wspólny dla strony i API |

## Praca lokalna
```sh
npm install
cp apps/api/.env.example apps/api/.env   # wpisz DISCORD_WEBHOOK_URL (kanał testowy)
npm run dev:api                          # API na :3000
npm run dev                              # strona na :5173, /api przekierowane do :3000
```

Sprawdzenia: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## API
- `POST /api/contact` — JSON `{ name, email, phone, message, eventType?, eventDate?, website, startedAt }`.
  Odpowiedzi: `200 {ok:true}`, `400` (błędy pól w `fields`), `429` (limit), `502` (Discord nie przyjął).
  Antyspam: honeypot `website`, odrzucenie wysyłki < 3 s od wyświetlenia, limit na IP.
- `GET /api/health` — health check.

Zmienne środowiskowe: `apps/api/.env.example` (opis każdej).

## Wdrożenie (Coolify)
`docker-compose.yml`: usługa `web` (nginx, port 80, przekazuje `/api/*` do `api`) i `api` (port 3000,
niewystawiona publicznie). W Coolify: typ „Docker Compose”, domena przypisana do usługi `web`,
zmienne `DISCORD_WEBHOOK_URL` itd. w zakładce Environment Variables.

Lokalnie cały stack: `cp .env.example .env && docker compose up --build`.
