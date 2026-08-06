import { motion } from 'framer-motion'
import { Link } from 'wouter'
import {
  BookOpen, PenLine, Send, CheckCircle2, FileText, Bell, Timer,
  ClipboardList, GraduationCap, ArrowRight, Sparkles, CloudUpload, CalendarCheck2
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const features = [
  {
    icon: PenLine,
    title: 'Digital Assignments',
    desc: 'Create, schedule, and share homework with full descriptions, attachments, and due dates — no more paper slips lost in school bags.',
    color: '#8B4513',
    points: ['Rich-text editor', 'File & image attachments', 'Reusable templates'],
  },
  {
    icon: Send,
    title: 'One-Tap Submission',
    desc: 'Students submit answers as text, photos, or documents from any device. Submissions are timestamped and stored forever.',
    color: '#166534',
    points: ['Photo & PDF uploads', 'Auto timestamping', 'Late submission flagging'],
  },
  {
    icon: CheckCircle2,
    title: 'Smart Grading',
    desc: 'Mark assignments with rubrics, comments, and voice notes. Grades flow automatically into report cards and parent updates.',
    color: '#7C3AED',
    points: ['Rubric-based scoring', 'Comment banks', 'Auto report-card sync'],
  },
  {
    icon: Bell,
    title: 'Parent Notifications',
    desc: 'Parents get instant updates the moment homework is assigned, submitted, or graded — always in the loop, zero effort.',
    color: '#B45309',
    points: ['SMS & WhatsApp alerts', 'Real-time status', 'Daily digest option'],
  },
  {
    icon: ClipboardList,
    title: 'Homework Diary',
    desc: 'A unified daily diary per class and student showing every pending, submitted, and graded task — perfect for parent-teacher meetings.',
    color: '#1D4ED8',
    points: ['Per-student view', 'Class-wise calendar', 'Print-ready reports'],
  },
  {
    icon: Timer,
    title: 'Deadline Management',
    desc: 'Auto-reminders for teachers and students. Never miss a deadline, and never chase students for pending work again.',
    color: '#B91C1C',
    points: ['Auto reminders', 'Overdue tracking', 'Holiday-aware scheduling'],
  },
]

const steps = [
  { icon: PenLine, title: 'Teacher Creates', desc: 'Set the task, attach materials, pick a class, and set the deadline in under a minute.' },
  { icon: CloudUpload, title: 'Student Submits', desc: 'Students upload from phone or laptop — photos of notebook work are perfectly fine.' },
  { icon: CheckCircle2, title: 'Teacher Grades', desc: 'Review, grade with rubrics, and add feedback. Grades sync to report cards.' },
  { icon: Bell, title: 'Parents Stay Updated', desc: 'Instant alerts at every step keep families informed without any extra work.' },
]

export default function Homework() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute top-24 right-10 w-[420px] h-[420px] bg-[#8B4513]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[360px] h-[360px] bg-[#D49A58]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#8B4513]" />
              <span className="text-xs font-semibold text-[#3D3128] uppercase tracking-widest">
                {language === 'en' ? 'Digital Homework' : 'डिजिटल गृहकार्य'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1410] leading-[1.1] font-display tracking-tight mb-6 max-w-3xl">
              Homework that <span className="gradient-text">writes itself off</span> your to-do list
            </h1>
            <p className="max-w-2xl text-lg text-[#3D3128] leading-relaxed mb-8">
              {language === 'en'
                ? 'Assign, collect, and grade homework digitally. Teachers save hours every week, students never lose a worksheet, and parents always know what\'s due.'
                : 'होमवर्क को डिजिटल रूप से असाइन, एकत्र और ग्रेड करें। शिक्षक हर हफ्ते घंटों बचाते हैं, छात्र कभी भी वर्कशीट नहीं खोते हैं, और माता-पिता हमेशा जानते हैं कि क्या देय है।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo">
                <span className="inline-flex items-center gap-2 btn-primary cursor-pointer">
                  {language === 'en' ? 'Book a Demo' : 'डेमो बुक करें'} <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
              <a href="/contact" className="inline-flex items-center justify-center gap-2 border border-[#1A1410]/20 text-[#1A1410] font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:bg-[#1A1410]/5 cursor-pointer">
                {language === 'en' ? 'Talk to a Specialist' : 'विशेषज्ञ से बात करें'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#8B4513] uppercase tracking-widest mb-3">Everything Included</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              A complete homework workflow
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, points }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="glass-card rounded-3xl p-7 card-lift shine-card"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-[#1A1410] mb-2">{title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs font-medium text-[#3D3128]">
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color }} /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-14">
            <span className="text-[11px] font-black text-[#8B4513] uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1410] font-display tracking-tight">
              From assignment to alert in four steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative glass-card rounded-3xl p-6"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-[#1A1410] text-[#F5F0E8] flex items-center justify-center text-xs font-black">
                  {i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#F0E8DC] border border-[#E8E0D4] mb-4">
                  <Icon className="h-5 w-5 text-[#8B4513]" />
                </div>
                <h3 className="text-base font-bold text-[#1A1410] mb-1.5">{title}</h3>
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
              <CalendarCheck2 className="h-10 w-10 text-[#D49A58] mx-auto mb-5" />
              <h2 className="text-2xl sm:text-4xl font-black text-[#F9F6F0] font-display tracking-tight mb-3">
                Give your teachers their evenings back
              </h2>
              <p className="max-w-xl mx-auto text-white/50 text-base leading-relaxed mb-8">
                See how REVENEX Homework eliminates the paper chase at your school with a free, no-obligation demo.
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
