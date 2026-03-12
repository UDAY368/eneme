'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { leadsApi } from '@/lib/api';

const PROJECT_TYPES = [
  'AD FILMS',
  'BUSINESS VIDEOS',
  'FILMS & DOCUMENTARIES',
  'CORPORATE EVENTS',
  'COMMERCIAL VIDEOS',
  'SEO SERVICES',
  'DIGITAL MARKETING',
  'MEDIA WORKS',
];

const WHY_CHOOSE = [
  'Award-winning creative team',
  'State-of-the-art equipment',
  'Timeless cinematic approach',
  'Full-service production',
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await leadsApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        projectType: form.projectType || undefined,
        message: form.message || undefined,
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', company: '', projectType: '', message: '' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-cinema-section" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Left */}
          <div>
            <h2 className="font-display font-bold text-4xl mb-6">Let&apos;s Create Cinema Magic</h2>
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-display font-bold text-lg text-cinema-gold mb-2">Free Consultation</h3>
                <p className="text-cinema-secondary">
                  Schedule a complimentary consultation to discuss your vision and explore creative possibilities.
                </p>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-cinema-gold mb-2">Global Reach</h3>
                <p className="text-cinema-secondary">
                  We work with clients worldwide, bringing cinematic excellence to projects across the globe.
                </p>
              </div>
            </div>
            <div className="bg-cinema-card border border-cinema rounded-lg p-6 transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]">
              <h3 className="font-display font-bold text-lg mb-4">Why Choose Enemme Studios?</h3>
              <ul className="space-y-3">
                {WHY_CHOOSE.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-cinema-secondary">
                    <Check className="h-5 w-5 text-cinema-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-cinema-card border border-cinema rounded-lg p-8 transition-all duration-300 hover:border-cinema-gold/40 hover:shadow-[0_0_30px_rgba(200,169,106,0.2),0_0_0_1px_rgba(200,169,106,0.4)]"
          >
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-cinema-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-cinema-gold" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">Thank you!</h3>
                <p className="text-cinema-secondary mb-6">We&apos;ll be in touch soon to discuss your project.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 bg-cinema-gold text-cinema-black font-bold rounded hover:bg-cinema-gold-hover transition-all hover:shadow-[0_0_30px_rgba(200,169,106,0.5)]"
                >
                  Contact Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-cinema-dark border border-cinema rounded text-cinema-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-gold"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-cinema-dark border border-cinema rounded text-cinema-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-gold"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-cinema-dark border border-cinema rounded text-cinema-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-gold"
                />
                <input
                  type="text"
                  placeholder="Company/Organization"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 bg-cinema-dark border border-cinema rounded text-cinema-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-gold"
                />
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full px-4 py-3 bg-cinema-dark border border-cinema rounded text-cinema-white focus:outline-none focus:border-cinema-gold"
                >
                  <option value="">Select Project Type</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Tell us about your vision (max 500 words)"
                  rows={5}
                  maxLength={2500}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-cinema-dark border border-cinema rounded text-cinema-white placeholder:text-cinema-muted focus:outline-none focus:border-cinema-gold resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-cinema-gold text-cinema-black font-bold rounded hover:bg-cinema-gold-hover transition-all hover:shadow-[0_0_30px_rgba(200,169,106,0.5)] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  Start Our Journey
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
