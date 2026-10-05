import type { ContactInput, ContactResponse } from '@twojabudka/shared';

// Adres względny: nginx (produkcja) i Vite (dev) przekazują /api do usługi api.
export async function sendContact(data: ContactInput): Promise<{ status: number; body: ContactResponse }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  let body: ContactResponse;
  try {
    body = (await res.json()) as ContactResponse;
  } catch {
    body = { ok: false, error: 'delivery_failed' };
  }
  return { status: res.status, body };
}
