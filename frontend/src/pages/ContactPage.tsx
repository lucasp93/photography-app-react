import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { sendEmail } from '../services/utils';
import type { EmailProps } from '../interfaces/interfaces';

// Define the TypeScript interface for the form fields
interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  eventType: 'wedding' | 'portrait' | 'event' | 'commercial' | 'other';
  eventDate: string;
  message: string;
}

export const ContactPage: React.FC = () => {
  // Initialize form state
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    eventType: 'portrait',
    eventDate: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle typed input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call (e.g., sending email via backend or service like EmailJS)
    //await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('loading');
    const emailContent = {
      name: formData.fullName,
      subject: formData.eventType,
      email: formData.email,
      message: formData.message,
    }

    const isSuccess = await sendEmail(emailContent);
    if (isSuccess) {
      setStatus('success');
      setIsSubmitted(true);
      setIsSubmitting(false);
    } else {
      setStatus('error');
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Camera className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide uppercase">
            Let's Capture Memories
          </h1>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto text-sm md:text-base tracking-wider">
            Available for bookings worldwide. Fill out the form below or reach out directly to discuss your upcoming project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Details & Info */}
          <div className="lg:col-span-1 space-y-8 bg-neutral-200/50 p-8 rounded-2xl border border-neutral-800">
            <div>
              <h2 className="text-xl font-medium tracking-wide uppercase text-neutral-200 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-neutral-400 mt-1" />
                  <div>
                    {/* <p className="text-xs uppercase tracking-widest text-neutral-500">Email</p> */}
                    <a href="mailto:hello@test.com" className="text-sm text-neutral-300 hover:text-neutral-500 transition">
                      hello@test.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-neutral-400 mt-1" />
                  <div>
                    {/* <p className="text-xs uppercase tracking-widest text-neutral-500">Phone</p> */}
                    <a href="tel:+1234567890" className="text-sm text-neutral-300 hover:text-neutral-300 transition">
                      +1 (555) 234-5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-neutral-400 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-900">Studio Location</p>
                    <p className="text-sm text-neutral-600">
                      123 Creative Studio Way<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-neutral-800" />

            {/* Response Time Notice */}
            <div>
              <span className="text-lg text-neutral-600 uppercase tracking-widest mb-2">
                Response Time
              </span>
              <p className="text-sm text-neutral-400 leading-relaxed">
                I typically respond within 24–48 business hours. For urgent booking inquiries, please call directly.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 bg-neutral-200/50 p-8 rounded-2xl border border-neutral-800">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-light text-neutral-500 mb-2">Message Received!</h3>
                <p className="text-neutral-400 max-w-md">
                  Thank you for reaching out. I've received your request and will get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-sm text-neutral-400 underline hover:text-neutral-500"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label htmlFor="eventType" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                      Shoot Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-neutral-500 transition"
                    >
                      <option value="wedding">Weddings</option>
                      <option value="birthday">Birthday</option>
                      <option value="family">Family</option>
                      <option value="business">Business</option>
                      <option value="maternity">Maternity</option>
                      <option value="newborn">Newborn</option>
                    </select>
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-neutral-500 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                    Project Details & Vision *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about location preferences, expected group size, creative ideas..."
                    className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-medium py-3.5 px-6 rounded-lg hover:bg-neutral-200 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;