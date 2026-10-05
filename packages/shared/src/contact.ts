import { z } from 'zod';

// Wspólne reguły formularza kontaktowego: te same w apps/web (walidacja na żywo)
// i apps/api (walidacja na serwerze).

export const CONTACT_LIMITS = {
  name: 64,
  email: 254,
  phone: 32,
  eventType: 64,
  message: 2000,
} as const;

// Minimalny czas od wyświetlenia formularza do wysyłki; szybciej wysyłają boty.
export const MIN_FILL_TIME_MS = 3000;

const required = (label: string, max: number) =>
  z
    .string({ required_error: `${label} jest wymagane`, invalid_type_error: `${label} jest wymagane` })
    .trim()
    .min(1, `${label} jest wymagane`)
    .max(max, `Maksymalnie ${max} znaków`);

export const contactSchema = z.object({
  name: required('Imię', CONTACT_LIMITS.name),
  email: z
    .string({ required_error: 'Email jest wymagany' })
    .trim()
    .min(1, 'Email jest wymagany')
    .max(CONTACT_LIMITS.email, 'Podaj poprawny adres email')
    .email('Podaj poprawny adres email'),
  phone: z
    .string({ required_error: 'Telefon jest wymagany' })
    .trim()
    .min(1, 'Telefon jest wymagany')
    .regex(/^[0-9\s+()-]{9,20}$/, 'Podaj poprawny numer telefonu'),
  message: z
    .string({ required_error: 'Wiadomość jest wymagana' })
    .trim()
    .min(1, 'Wiadomość jest wymagana')
    .max(CONTACT_LIMITS.message, `Maksymalnie ${CONTACT_LIMITS.message} znaków`),
  eventType: z.string().trim().max(CONTACT_LIMITS.eventType).optional(),
  eventDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Podaj poprawną datę')
    .optional()
    .or(z.literal('')),
  // Honeypot: pole ukryte przed ludźmi, wypełniają je boty.
  website: z.string().optional(),
  // Znacznik czasu (ms) wyświetlenia formularza.
  startedAt: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = 'name' | 'email' | 'phone' | 'message' | 'eventType' | 'eventDate';
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: ContactFieldErrors }
  | { ok: false; error: 'rate_limited' | 'delivery_failed' | 'bad_request' };

// Pierwszy komunikat błędu dla każdego pola.
export function fieldErrors(error: z.ZodError): ContactFieldErrors {
  const out: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
