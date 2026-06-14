import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'
import { useSubmitContact } from '@workspace/api-client-react'

export default function Contact() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', institution: '', subject: '', message: '' })

  const mutation = useSubmitContact()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    mutation.mutate(
      { data: form },
      {
        onSuccess: () => {
          setSubmitted(true)
          setForm({ name: '', email: '', institution: '', subject: '', message: '' })
        },
        onError: () => {
          setError('Something went wrong. Please try again.')
        },
      }
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Contact</span>
            </div>
            <h1 className="text-5xl font-black text-white sm:text-6xl lg:text-7xl mb-6">{t('contact.title')}</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/40">{t('contact.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-white">
                Let's talk
              </h2>
              <p className="text-white/40 leading-relaxed">
                Have questions about REVENEX? We're here to help. Reach out and our team will respond within 2 hours on business days.
              </p>

              {[
                { icon: Mail, label: t('contact.info.email'), value: 'team@revenex.in', href: 'mailto:team@revenex.in' },
                { icon: Phone, label: t('contact.info.phone'), value: '+91 90217 44355', href: 'tel:+919021744355' },
                { icon: MapPin, label: t('contact.info.address'), value: 'Pune, Maharashtra, India', href: '#' },
              ].map((info, i) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 glass-card rounded-2xl p-5 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-aqua/10 border border-aqua/20 flex items-center justify-center group-hover:bg-aqua/20 transition-colors">
                    <info.icon className="h-5 w-5 text-aqua" />
                  </div>
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">{info.label}</div>
                    <div className="font-semibold text-white group-hover:text-aqua transition-colors">{info.value}</div>
                  </div>
                </motion.a>
              ))}

              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <h3 className="font-bold text-white mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm text-white/40">
                  <p>Monday – Friday: 9:00 AM – 7:00 PM IST</p>
                  <p>Saturday: 10:00 AM – 4:00 PM IST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card animated-border rounded-3xl p-12 text-center"
                >
                  <div className="mx-auto mb-6 w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Message Sent!</h3>
                  <p className="text-white/40">Thank you for reaching out. Our team will get back to you within 2 business hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-aqua hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="form-card glass-card animated-border rounded-3xl p-8 space-y-5">
                  {[
                    { key: 'name', label: t('contact.form.name'), type: 'text', placeholder: 'Your full name', required: true },
                    { key: 'email', label: t('contact.form.email'), type: 'email', placeholder: 'your@email.com', required: true },
                    { key: 'institution', label: 'Institution / School Name (optional)', type: 'text', placeholder: 'Your institution name', required: false },
                    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Pricing enquiry, Feature question…', required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-white/60 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-aqua/40 focus:bg-white/8 transition-all text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">{t('contact.form.message')}</label>
                    <textarea
                      placeholder="Tell us how we can help..."
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-aqua/40 transition-all text-sm resize-none"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-400 text-center">{error}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={mutation.isPending}
                    whileHover={!mutation.isPending ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,212,198,0.3)' } : {}}
                    whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
                    className="w-full gradient-bg text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {mutation.isPending ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t('contact.form.submit')}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
