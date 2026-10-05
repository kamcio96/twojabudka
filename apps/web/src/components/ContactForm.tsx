import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
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
      className="section-padding bg-white relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background Element */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 transform skew-x-12 translate-x-1/4 z-0 hidden lg:block"
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Contact Info Section */}
            <div className="bg-gradient-navy text-white p-8 md:p-12 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold font-playfair mb-6">
                  Skontaktuj się z nami
                </h2>
                <p className="mb-10 opacity-90">
                  Chętnie odpowiemy na wszystkie pytania i pomożemy zaplanować idealną oprawę fotograficzną Twojego wydarzenia.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="mr-4 text-gold-500" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold">Telefon</h3>
                      <a href={business.phoneHref} data-umami-event="tel-click" data-umami-event-place="contact" className="opacity-90 hover:text-gold-500 transition-colors duration-300">
                        {business.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="mr-4 text-gold-500" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold">Email</h3>
                      <a href={`mailto:${business.email}`} data-umami-event="mail-click" data-umami-event-place="contact" className="opacity-90 hover:text-gold-500 transition-colors duration-300">
                        {business.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">Obsługujemy:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Wesela</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Urodziny</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Imprezy firmowe</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Studniówki</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Eventy</span>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className={`p-8 md:p-12 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <h3 className="text-2xl font-bold font-playfair text-navy-900 mb-6">
                Wyślij wiadomość
              </h3>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg" role="status">
                  <h4 className="font-semibold text-lg mb-2">Dziękujemy za wiadomość!</h4>
                  <p>Odpowiemy najszybciej, jak to możliwe.</p>
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
                        className={inputClass(!!errors.name)}
                        placeholder="Jan Kowalski"
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-red-600 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
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
                        className={inputClass(!!errors.email)}
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
                        className={inputClass(!!errors.phone)}
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
                          className={`${inputClass(!!errors.eventType)} bg-white`}
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
                          className={inputClass(!!errors.eventDate)}
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
                        className={`w-full flex items-center justify-center py-3 px-6 bg-gold-500 hover:bg-gold-600 text-navy-900 font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 transition-all duration-300 ${
                          isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Wysyłanie...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Wyślij wiadomość
                            <Send className="ml-2" size={18} />
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
