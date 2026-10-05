import React, { useState, useRef, useEffect } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { contactSchema, CONTACT_LIMITS, type ContactField, type ContactFieldErrors } from '@twojabudka/shared';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { business } from '../content/business';
import { sendContact } from '../lib/api';
import { track } from '../lib/analytics';

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  message: string;
  website: string; // honeypot
}

const EMPTY_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  message: '',
  website: '',
};

const EVENT_TYPES = ['Wesele', 'Urodziny / osiemnastka', 'Komunia', 'Studniówka', 'Impreza firmowa', 'Inna okazja'];

const VALIDATED_FIELDS: ContactField[] = ['name', 'email', 'phone', 'message', 'eventType', 'eventDate'];

const validateField = (name: ContactField, value: string): string | undefined => {
  const result = contactSchema.shape[name].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 border ${
    hasError ? 'border-red-600' : 'border-gray-300'
  } rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300`;

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());

  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 8000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);

    if ((VALIDATED_FIELDS as string[]).includes(name)) {
      const error = validateField(name as ContactField, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactSchema.safeParse({ ...formData, startedAt: startedAt.current });
    if (!parsed.success) {
      const newErrors: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as ContactField;
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { status, body } = await sendContact({
        ...formData,
        eventType: formData.eventType || undefined,
        eventDate: formData.eventDate || undefined,
        startedAt: startedAt.current,
      });

      if (body.ok) {
        track('contact-submit', { eventType: formData.eventType || 'brak' });
        setSubmitted(true);
        setFormData(EMPTY_FORM);
        startedAt.current = Date.now();
      } else if (body.error === 'validation') {
        setErrors(body.fields);
      } else if (status === 429) {
        setSubmitError(
          `Wysłano zbyt wiele wiadomości. Spróbuj ponownie za kilka minut lub zadzwoń: ${business.phone}.`,
        );
      } else {
        throw new Error(body.error);
      }
    } catch {
      setSubmitError(
        `Nie udało się wysłać wiadomości. Zadzwoń: ${business.phone} lub napisz na ${business.email}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-white"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-card-hover overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Info Section */}
            <div className="bg-gradient-navy text-white p-6 sm:p-8 md:p-12 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
                Poproś o <span className="text-gold-500">wycenę</span>
              </h2>
              <p className="mb-10 text-white/85">
                Chętnie odpowiemy na wszystkie pytania i pomożemy zaplanować oprawę fotograficzną
                Twojego wydarzenia.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <Phone className="mt-1 text-gold-500 flex-shrink-0" size={22} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-medium text-white/70">Telefon</h3>
                    <a href={business.phoneHref} data-umami-event="tel-click" data-umami-event-place="contact" className="focus-ring rounded text-xl md:text-2xl font-semibold hover:text-gold-500 transition-colors duration-300">
                      {business.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <Mail className="mt-1 text-gold-500 flex-shrink-0" size={22} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-medium text-white/70">E-mail</h3>
                    <a href={`mailto:${business.email}`} data-umami-event="mail-click" data-umami-event-place="contact" className="focus-ring rounded text-base sm:text-lg break-words hover:text-gold-500 transition-colors duration-300">
                      {business.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 text-gold-500 flex-shrink-0" size={22} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-medium text-white/70">Dojazd</h3>
                    <p className="text-lg">Dojeżdżamy {business.area}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-12 md:mt-auto md:pt-12">
                <h3 className="text-sm font-medium text-white/70 mb-3">Obsługujemy</h3>
                <ul className="flex flex-wrap gap-2">
                  {EVENT_TYPES.filter(type => type !== 'Inna okazja').map(type => (
                    <li key={type} className="px-3 py-1 border border-white/15 bg-white/5 rounded-full text-sm">
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form Section */}
            <div className={`p-6 sm:p-8 md:p-12 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <h3 className="text-2xl font-bold font-playfair text-navy-900 mb-6">
                Wyślij wiadomość
              </h3>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg" role="status">
                  <h4 className="font-semibold text-lg mb-2">Dziękujemy za wiadomość.</h4>
                  <p>Odpowiemy najszybciej, jak to możliwe. W pilnej sprawie zadzwoń: {business.phone}.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-5">
                    {/* Honeypot: ukryte przed ludźmi i czytnikami ekranu */}
                    <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="website">Strona WWW</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="name"
                        maxLength={CONTACT_LIMITS.name}
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`${inputClass(!!errors.name)} h-12`}
                        placeholder="Jan Kowalski"
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-red-600 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        maxLength={CONTACT_LIMITS.email}
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`${inputClass(!!errors.email)} h-12`}
                        placeholder="jan@example.com"
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-red-600 text-sm">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        autoComplete="tel"
                        maxLength={CONTACT_LIMITS.phone}
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className={`${inputClass(!!errors.phone)} h-12`}
                        placeholder="+48 123 456 789"
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-1 text-red-600 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                          Okazja
                        </label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          className={`${inputClass(!!errors.eventType)} h-12 bg-white`}
                        >
                          <option value="">Wybierz</option>
                          {EVENT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Data wydarzenia
                        </label>
                        <input
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          aria-invalid={!!errors.eventDate}
                          aria-describedby={errors.eventDate ? 'eventDate-error' : undefined}
                          className={`${inputClass(!!errors.eventDate)} h-12`}
                        />
                        {errors.eventDate && (
                          <p id="eventDate-error" className="mt-1 text-red-600 text-sm">{errors.eventDate}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Wiadomość *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        maxLength={CONTACT_LIMITS.message}
                        value={formData.message}
                        onChange={handleChange}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className={inputClass(!!errors.message)}
                        placeholder="W czym możemy pomóc? Napisz, gdzie odbędzie się impreza."
                      ></textarea>
                      {errors.message && (
                        <p id="message-error" className="mt-1 text-red-600 text-sm">{errors.message}</p>
                      )}
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg" role="alert">
                        {submitError}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center py-3 px-6 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold rounded-lg shadow-card hover:shadow-card-hover active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 transition-all duration-300 ease-brand ${
                          isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Wysyłanie…
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Wyślij wiadomość
                            <Send className="ml-2" size={18} aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
