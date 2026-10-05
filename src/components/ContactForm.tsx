import React, { useState, useRef } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Imię jest wymagane' : undefined;
      case 'email':
        return value.trim() === '' 
          ? 'Email jest wymagany' 
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
            ? 'Podaj poprawny adres email' 
            : undefined;
      case 'phone':
        return value.trim() === '' 
          ? 'Telefon jest wymagany' 
          : !/^[0-9\s+()-]{9,15}$/.test(value) 
            ? 'Podaj poprawny numer telefonu' 
            : undefined;
      case 'message':
        return value.trim() === '' ? 'Wiadomość jest wymagana' : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    let hasErrors = false;
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (!hasErrors) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        const response = await fetch(`https://twojabudka.pl/message.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        
        // Reset submission status after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } catch {
        setSubmitError('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.');
      } finally {
        setIsSubmitting(false);
      }
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
                      <p className="opacity-90">+48 789 772 289</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="mr-4 text-gold-500" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold">Email</h3>
                      <p className="opacity-90">kontakt@twojabudka.pl</p>
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
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Dziękujemy za wiadomość!</h4>
                  <p>Odpowiemy najszybciej jak to możliwe.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Jan Kowalski"
                      />
                      {errors.name && (
                        <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
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
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300`}
                        placeholder="jan@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
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
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300`}
                        placeholder="+48 123 456 789"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Wiadomość *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.message ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300`}
                        placeholder="W czym możemy pomóc?"
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-red-500 text-sm">{errors.message}</p>
                      )}
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                        {submitError}
                      </div>
                    )}
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center py-3 px-6 bg-gold-500 hover:bg-gold-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                          isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
