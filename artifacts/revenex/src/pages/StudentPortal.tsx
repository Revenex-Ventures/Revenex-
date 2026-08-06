import { motion } from 'framer-motion'
import { Link } from 'wouter'
import {
  GraduationCap, FileText, CalendarDays, Wallet, MessageSquare, ShieldCheck,
  BarChart3, BusFront, BookOpen, ArrowRight, Sparkles, Smartphone, BellRing
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const modules = [
  {
    icon: FileText,
    title: 'Report Cards & Grades',
    desc: 'View live report cards, term-wise grades, and teacher feedback the moment they are published.',
    color: '#8B4513',
  },
  {
    icon: CalendarDays,
    title: 'Attendance Timeline',
    desc: 'A day-by-day attendance history with instant absence alerts and monthly summaries.',
    color: '#166534',
  },
  {
    icon: BookOpen,
    title: 'Homework & Assignments',
    desc: 'See every assignment, its deadline, and submission status — submit work right from the portal.',
    color: '#7C3AED',
  },
  {
    icon: Wallet,
    title: 'Fees & Payments',
    desc: 'Pay fees online, download receipts, and track dues in real time — no more standing in lines.',
    color: '#B45309',
  },
  {
    icon: MessageSquare,
    title: 'Messages & Circulars',
    desc: 'Receive school announcements, exam schedules, and event circulars in a clean inbox.',
    color: '#1D4ED8',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    desc: 'Subject-wise progress charts and term comparisons help students and parents spot trends early.',
    color: '#B91C1C',
  },
  {
    icon: BusFront,
    title: 'Transport Tracking',
    desc: 'Check live bus location, route details, and stop timings from a single screen.',
    color: '#0F766E',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Secure',
    desc: 'Every parent and student gets a secure login. Data is visible only to your school and family.',
    color: '#4B5563',
  },
]

const highlights = [
  { icon: Smartphone, title: 'Works on any phone', desc: 'No app install needed — the portal opens right in your browser, even on slow networks.' },
  { icon: BellRing, title: 'Instant alerts', desc: 'Get notified the moment grades, attendance, or circulars change.' },
  { icon: Sparkles, title: 'Bilingual by default', desc: 'Switch between English and Hindi with one tap, for parents of every generation.' },
]

export default function StudentPortal() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-20 right-8 w-[420px] h-[420px] bg-[#8B4513]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-6 left-1/4 w-[360px] h-[360px] bg-[#D49A58]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] mb-6">
              <GraduationCap className="h-3.5 w-3.5 text-[#8B4513]" />
              <span className="text-xs font-semibold text-[#3D3128] uppercase tracking-widest">
                {language === 'en' ? 'Student Portal' : 'छात्र पोर्टल'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1410] leading-[1.1] font-display tracking-tight mb-6 max-w-3xl">
              Your child's entire school life, <span className="gradient-text">in one secure portal</span>
            </h1>
            <p className="max-w-2xl text-lg text-[#3D3128] leading-relaxed mb-8">
              {language === 'en'
                ? 'Grades, attendance, fees, homework, transport, and circulars — everything a parent needs, updated in real time and available on any device.'
                : 'ग्रेड, उपस्थिति, शुल्क, होमवर्क, परिवहन और परिपत्र — एक माता-पिता को जो कुछ भी चाहिए, वह वास्तविक समय में अपडेट होता है और किसी भी डिवाइस पर उपलब्ध होता है।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo">
                <span className="inline-flex items-center gap-2 btn-primary cursor-pointer">
                  {language === 'en' ? 'Book a Demo' : 'डेमो बुक करें'} <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
              <Link href="/login">
                <span className="inline-flex items-center justify-center gap-2 border border-[#1A1410]/20 text-[#1A1410] font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-[#1A1410]/5 cursor-pointer">
                  {language === 'en' ? 'Open the Portal' : 'पोर्टल खोलें'}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Modules grid ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#8B4513] uppercase tracking-widest mb-3">One Portal, Everything</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              Eight modules parents actually use
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="glass-card rounded-3xl p-7 card-lift"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-[#1A1410] mb-2">{title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#8B4513] uppercase tracking-widest mb-3">Why Parents Love It</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              Simple for parents, powerful for schools
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative glass-card rounded-3xl p-7 text-center shine-card"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center bg-[#F0E8DC] border border-[#E8E0D4] mb-4">
                  <Icon className="h-6 w-6 text-[#8B4513]" />
                </div>
                <h3 className="text-base font-bold text-[#1A1410] mb-2">{title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#281E18] to-[#1C140F] px-8 py-14 sm:px-14 text-center"
          >
            <div className="absolute -top-20 left-1/3 w-[380px] h-[380px] bg-[#D49A58]/15 rounded-full blur-[110px] pointer-events-none" />
            <div className="relative">
              <Smartphone className="h-10 w-10 text-[#D49A58] mx-auto mb-5" />
              <h2 className="text-2xl sm:text-4xl font-black text-[#F9F6F0] font-display tracking-tight mb-3">
                Open a portal your parents will actually use
              </h2>
              <p className="max-w-xl mx-auto text-white/50 text-base leading-relaxed mb-8">
                A quick demo shows how REVENEX keeps every family in the loop without adding a single task to your staff.
              </p>
              <Link href="/book-demo">
                <span className="inline-flex items-center gap-2 bg-[#D49A58] text-[#18120E] font-semibold px-8 py-4 rounded-xl text-base transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_24px_rgba(212,154,88,0.35)] cursor-pointer">
                  Schedule a Demo <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
