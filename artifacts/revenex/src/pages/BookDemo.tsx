import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, Clock, Users, ArrowRight, Building2, Mail, Phone, User } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'
import { useSubmitDemoRequest } from '@workspace/api-client-react'

type FormData = {
  name: string
  schoolName: string
  type: string
  email: string
  phone: string
  city: string
  students: string
  preferredDate: string
  preferredTime: string
  message: string
}

export default function BookDemo() {
  const { language, t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '', schoolName: '', type: '', email: '', phone: '',
    city: '', students: '', preferredDate: '', preferredTime: '', message: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const mutation = useSubmitDemoRequest()

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.schoolName.trim()) e.schoolName = 'School name is required'
    if (!form.type) e.type = 'Please select institution type'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit Indian mobile required'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    mutation.mutate(
      {
        data: {
          name: form.name,
          schoolName: form.schoolName,
          type: form.type || 'school',
          email: form.email,
          phone: form.phone,
          city: form.city,
          students: form.students,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime,
          message: form.message || 'No additional message',
        },
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => setApiError('Something went wrong. Please try again.'),
      }
    )
  }

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(err => ({ ...err, [key]: undefined }))
  }

  const inputClass = (err?: string) =>
    `w-full rounded-xl border ${err ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} px-4 py-3 text-white placeholder-white/20 outline-none focus:border-aqua/40 focus:bg-white/8 transition-all text-sm`

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

  if (submitted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass-card animated-border rounded-3xl p-12 text-center max-w-lg w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
              className="mx-auto mb-6 w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center"
            >
              <CheckCircle2 className="h-10 w-10 text-black" />
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-3">
              {language === 'en' ? 'Demo Requested!' : 'डेमो अनुरोध भेजा!'}
            </h2>
            <p className="text-white/50 mb-2">
              {language === 'en'
                ? `Thank you, ${form.name}! We've received your request for ${form.schoolName}.`
                : `धन्यवाद, ${form.name}! हमें ${form.schoolName} के लिए आपका अनुरोध मिल गया है।`}
            </p>
            <p className="text-white/40 text-sm mb-8">
              {language === 'en'
                ? 'Our team will reach out within 24 hours to confirm your demo slot.'
                : 'हमारी टीम 24 घंटों के भीतर आपके डेमो स्लॉट की पुष्टि के लिए संपर्क करेगी।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+919021744355" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/5 transition-all text-sm">
                <Phone className="h-4 w-4 text-aqua" />
                +91 90217 44355
              </a>
              <a href="mailto:team@revenex.in" className="inline-flex items-center justify-center gap-2 gradient-bg text-black font-bold px-6 py-3 rounded-2xl text-sm">
                <Mail className="h-4 w-4" />
                team@revenex.in
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Calendar className="h-3.5 w-3.5 text-aqua" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Book a Demo</span>
            </div>
            <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl mb-4">{t('demo.subtitle')}</h1>
            <p className="mx-auto max-w-xl text-white/40 text-lg">
              {language === 'en'
                ? 'Schedule a personalized walkthrough of REVENEX for your institution. Free, no obligation.'
                : 'अपने संस्थान के लिए REVENEX का व्यक्तिगत वॉकथ्रू शेड्यूल करें। मुफ्त, कोई बाध्यता नहीं।'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">

            {/* Info panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-black text-white mb-2">
                  {language === 'en' ? 'What to expect' : 'क्या अपेक्षा करें'}
                </h2>
                <p className="text-sm text-white/40 mb-6">
                  {language === 'en' ? 'A 45-minute live session covering your specific needs.' : '45-मिनट का लाइव सत्र जो आपकी विशिष्ट जरूरतों को कवर करता है।'}
                </p>
                {[
                  { icon: Users, textEn: 'Live product walkthrough tailored to your institution', textHi: 'आपके संस्थान के अनुसार लाइव प्रोडक्ट वॉकथ्रू' },
                  { icon: Clock, textEn: 'Q&A with our product team', textHi: 'हमारी प्रोडक्ट टीम के साथ Q&A' },
                  { icon: Building2, textEn: 'Custom pricing and onboarding plan', textHi: 'कस्टम मूल्य निर्धारण और ऑनबोर्डिंग योजना' },
                  { icon: Calendar, textEn: 'Schedule at a time that works for you', textHi: 'अपनी सुविधा अनुसार समय निर्धारित करें' },
                ].map((item) => (
                  <div key={item.textEn} className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-aqua/10 border border-aqua/20 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-aqua" />
                    </div>
                    <p className="text-sm text-white/60 mt-1">{language === 'en' ? item.textEn : item.textHi}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-6 border border-aqua/10">
                <p className="text-xs text-white/30 mb-1 uppercase tracking-wide">
                  {language === 'en' ? 'Or contact directly' : 'या सीधे संपर्क करें'}
                </p>
                <div className="space-y-2 mt-3">
                  <a href="tel:+919021744355" className="flex items-center gap-2 text-sm text-white/60 hover:text-aqua transition-colors">
                    <Phone className="h-4 w-4 text-aqua" />
                    +91 90217 44355
                  </a>
                  <a href="mailto:team@revenex.in" className="flex items-center gap-2 text-sm text-white/60 hover:text-aqua transition-colors">
                    <Mail className="h-4 w-4 text-aqua" />
                    team@revenex.in
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="form-card glass-card animated-border rounded-3xl p-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {t('demo.form.name')} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input type="text" placeholder="Full name" required value={form.name} onChange={set('name')}
                        className={`${inputClass(errors.name)} pl-10`} />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {t('demo.form.school')} *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input type="text" placeholder="School / Institute name" required value={form.schoolName} onChange={set('schoolName')}
                        className={`${inputClass(errors.schoolName)} pl-10`} />
                    </div>
                    {errors.schoolName && <p className="text-xs text-red-400 mt-1">{errors.schoolName}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {t('demo.form.type')} *
                    </label>
                    <select required value={form.type} onChange={set('type')}
                      className={`${inputClass(errors.type)} appearance-none`}>
                      <option value="">Select type</option>
                      <option value="school">{t('demo.types.school')}</option>
                      <option value="college">{t('demo.types.college')}</option>
                      <option value="coaching">{t('demo.types.coaching')}</option>
                      <option value="other">{t('demo.types.other')}</option>
                    </select>
                    {errors.type && <p className="text-xs text-red-400 mt-1">{errors.type}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {language === 'en' ? 'No. of Students' : 'छात्रों की संख्या'}
                    </label>
                    <select value={form.students} onChange={set('students')}
                      className={`${inputClass()} appearance-none`}>
                      <option value="">Select range</option>
                      <option value="<100">Less than 100</option>
                      <option value="100-500">100 – 500</option>
                      <option value="500-1000">500 – 1,000</option>
                      <option value="1000-5000">1,000 – 5,000</option>
                      <option value="5000+">5,000+</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {t('demo.form.email')} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input type="email" placeholder="your@email.com" required value={form.email} onChange={set('email')}
                        className={`${inputClass(errors.email)} pl-10`} />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {t('demo.form.phone')} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <input type="tel" placeholder="10-digit mobile" required value={form.phone} onChange={set('phone')}
                        className={`${inputClass(errors.phone)} pl-10`} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {language === 'en' ? 'Preferred Date' : 'पसंदीदा तारीख'}
                    </label>
                    <input type="date" value={form.preferredDate} onChange={set('preferredDate')}
                      min={new Date().toISOString().split('T')[0]}
                      className={`${inputClass()} [color-scheme:dark]`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      {language === 'en' ? 'Preferred Time (IST)' : 'पसंदीदा समय (IST)'}
                    </label>
                    <select value={form.preferredTime} onChange={set('preferredTime')}
                      className={`${inputClass()} appearance-none`}>
                      <option value="">Any time</option>
                      {timeSlots.map(slot => <option key={slot} value={slot}>{slot} IST</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    {t('demo.form.message')}
                  </label>
                  <textarea
                    placeholder={language === 'en' ? "Tell us about your institution and what you'd like to see in the demo..." : 'अपने संस्थान के बारे में बताएं...'}
                    rows={3}
                    value={form.message}
                    onChange={set('message')}
                    className={`${inputClass()} resize-none`}
                  />
                </div>

                {apiError && (
                  <p className="text-sm text-red-400 text-center">{apiError}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={mutation.isPending}
                  whileHover={!mutation.isPending ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,212,198,0.3)' } : {}}
                  whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
                  className="w-full gradient-bg text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      />
                      {language === 'en' ? 'Submitting...' : 'भेजा जा रहा है...'}
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      {t('demo.form.submit')}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-white/25 text-center">
                  {language === 'en'
                    ? 'By submitting, you agree to our Privacy Policy and Terms of Service.'
                    : 'सबमिट करके, आप हमारी गोपनीयता नीति और सेवा की शर्तों से सहमत होते हैं।'}
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
