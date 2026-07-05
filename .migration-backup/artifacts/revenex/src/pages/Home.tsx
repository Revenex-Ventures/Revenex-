import { useRef, useState } from 'react'
import { Link } from 'wouter'
import { useQueryClient } from '@tanstack/react-query'
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Users, BookOpen, CreditCard, Bell, Calendar,
  BarChart3, Shield, Cpu, CheckCircle2, Zap, Cloud, Sparkles,
  GraduationCap, TrendingUp, Lock, Activity, Server,
  MessageSquare, Award, Star, Send, Globe2, Linkedin,
  Mail, Phone, MapPin
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import Testimonials from '@/components/Testimonials'
import { useLanguage } from '@/lib/language-context'
import { useListReviews, getListReviewsQueryKey, useSubmitReview, useSubmitContact } from '@workspace/api-client-react'
const prasannaImg = '/Prasanna.jpg'
const rounakNewImg = '/Rounak.jpg'
const rohanNewImg = '/Rohan.jpg'

/* ─── Section badge ─── */
function SectionBadge({ label }: { label: string }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
        <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  )
}

/* ─── 3D tilt card wrapper ─── */
function TiltCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transition = 'transform 0.08s linear'
    el.style.transform = `perspective(900px) rotateY(${x * 13}deg) rotateX(${-y * 13}deg) translateZ(10px)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d', ...style }}
    >
      {children}
    </div>
  )
}

/* ─── Features ─── */
const features = [
  { icon: Users, title: 'Student Management', desc: 'Manage student records from admission to graduation.', color: 'text-blue-400', bg: 'bg-blue-400/10', slug: 'student-management' },
  { icon: Calendar, title: 'Attendance Tracking', desc: 'Automate attendance and send SMS alerts to parents.', color: 'text-green-400', bg: 'bg-green-400/10', slug: 'attendance' },
  { icon: CreditCard, title: 'Fee Management', desc: 'Collect fees online, issue receipts, and integrate with Razorpay.', color: 'text-yellow-400', bg: 'bg-yellow-400/10', slug: 'fees' },
  { icon: Bell, title: 'Parent Communication', desc: 'Send SMS, WhatsApp, and app notifications to parents.', color: 'text-orange-400', bg: 'bg-orange-400/10', slug: 'parent-communication' },
  { icon: BookOpen, title: 'Exam & Results', desc: 'Run exams, grade work, and share report cards.', color: 'text-purple-400', bg: 'bg-purple-400/10', slug: 'exam-results' },
  { icon: BarChart3, title: 'AI Analytics', desc: 'Simple dashboards and insights for principals.', color: 'text-pink-400', bg: 'bg-pink-400/10', slug: 'ai-analytics' },
  { icon: Users, title: 'Staff Management', desc: 'Manage payroll, leaves, and staff performance.', color: 'text-cyan-400', bg: 'bg-cyan-400/10', slug: 'staff-management' },
  { icon: Shield, title: 'Security & Access', desc: 'Role-based access and strong data protection.', color: 'text-red-400', bg: 'bg-red-400/10', slug: 'security' },
]

/* ─── How It Works steps ─── */
const howItWorks = [
  {
    step: '01',
    icon: MessageSquare,
    titleEn: 'Contact & Discovery',
    descEn: 'Tell us about your institution and needs.',
    detailEn: 'We schedule a short call to understand your requirements.',
    tags: ['Free Consultation', 'No Commitment', 'Same-day Response'],
    color: '#00E5C3',
    glow: 'rgba(0,229,195,0.22)',
    bg: 'rgba(0,229,195,0.09)',
  },
  {
    step: '02',
    icon: Cpu,
    titleEn: 'Custom ERP Setup',
    descEn: 'We set up the platform to match your processes and rules.',
    detailEn: 'We migrate data and apply your branding.',
    tags: ['Zero Data Loss', 'Custom Branding', '48hr Turnaround'],
    color: '#7C4DFF',
    glow: 'rgba(124,77,255,0.22)',
    bg: 'rgba(124,77,255,0.09)',
  },
  {
    step: '03',
    icon: GraduationCap,
    titleEn: 'Staff Onboarding & Training',
    descEn: 'We train your staff and provide clear guides.',
    detailEn: 'Live sessions and support until your team is ready.',
    tags: ['Role-Based Access', 'Live Training', 'Video Guides'],
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.22)',
    bg: 'rgba(59,130,246,0.09)',
  },
  {
    step: '04',
    icon: Activity,
    titleEn: 'Go Live & Ongoing Support',
    descEn: 'We launch the system and provide ongoing support.',
    detailEn: 'Ongoing help, regular updates, and monthly reports.',
    tags: ['2hr Support SLA', '99.9% Uptime', 'Free Updates'],
    color: '#10B981',
    glow: 'rgba(16,185,129,0.22)',
    bg: 'rgba(16,185,129,0.09)',
  },
]

/* ─── Partner logos (white pill style) ─── */
function FirebaseSVG() {
  return (
    <svg viewBox="0 0 58 83" className="h-5 w-auto shrink-0" aria-label="Firebase">
      <path d="M1.87 59.8l.6-1.1 19.4-36.1.22-.41L10.57 5.11C8.87.83 3.11-.43.8 3.32L1.87 59.8z" fill="#FFC24A"/>
      <path d="M1.87 59.8l.37-.25 5.76-2.94 13.64-7.45L9.31 22.2l-7.44 37.6z" fill="#FFA712"/>
      <path d="M29.36 27.8l-5.89-6.63-13.51 26.99 19.4 11.64V27.8z" fill="#F4BD62"/>
      <path d="M9.96 22.17L29.36 27.8v31.8L1.87 59.8z" fill="#FFA50E"/>
      <path d="M57.2 59.8l-.37-.25L43.1 52.1l-5.89-12.65 5.89 2.06 5.89-31.5 8.21 49.79z" fill="#F6820C"/>
      <path d="M29.36 27.8v31.8l27.84.2L29.36 27.8z" fill="#FDE068"/>
      <path d="M29.36 59.6l27.84.2-.74.49L37.21 72l-7.85-12.4z" fill="#FCCA3F"/>
      <path d="M29.36 59.6L1.87 59.8l27.49 12.2V59.6z" fill="#FFCD40"/>
    </svg>
  )
}
function GoogleCloudSVG() {
  return (
    <svg viewBox="0 0 256 212" className="h-5 w-auto shrink-0" aria-label="Google Cloud">
      <path d="M158.752 50.392L128.03 21.015l-30.72 29.377L128.03 79.77l30.722-29.378z" fill="#EA4335"/>
      <path d="M206.038 105.31c-7.245-36.695-39.498-64.317-78.008-64.317-38.51 0-70.763 27.622-78.008 64.317H206.038z" fill="#4285F4"/>
      <path d="M50.022 105.31H18.476C7.693 124.51 1.5 146.41 1.5 169.735c0 23.325 6.193 45.225 16.976 64.425H50.02A109.863 109.863 0 0140.042 189.735c0-15.874 3.355-30.963 9.358-44.542l.622-1.438V105.31z" fill="#34A853"/>
      <path d="M205.978 105.31h31.546c10.783 19.2 16.976 41.1 16.976 64.425 0 23.325-6.193 45.225-16.976 64.425h-31.544a109.862 109.862 0 009.978-44.425 109.862 109.862 0 00-9.98-44.425v-40z" fill="#FBBC05"/>
      <path d="M128.03 234.16c38.51 0 70.763-27.622 78.008-64.317H50.022c7.245 36.695 39.498 64.317 78.008 64.317z" fill="#EA4335"/>
    </svg>
  )
}
function GeminiSVG() {
  return (
    <svg viewBox="0 0 28 28" className="h-5 w-auto shrink-0" aria-label="Gemini AI">
      <defs>
        <linearGradient id="gG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1C69FF"/>
          <stop offset="100%" stopColor="#9966FF"/>
        </linearGradient>
      </defs>
      <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm-1.5 19.97v-4.94a6.5 6.5 0 010-6.06V6.03a10.001 10.001 0 010 15.94zm3 0V18.97a6.5 6.5 0 000-9.94V6.03a10.001 10.001 0 010 15.94z" fill="url(#gG)"/>
    </svg>
  )
}
function RazorpaySVG() {
  return (
    <svg viewBox="0 0 80 24" className="h-4 w-auto shrink-0" aria-label="Razorpay">
      <path d="M7.08 0L0 24h6.24l7.08-24H7.08z" fill="#3395FF"/>
      <path d="M14.16 0L7.08 24h6.24L20.4 0h-6.24z" fill="#072654"/>
      <text x="26" y="19" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="16" fill="#072654">razorpay</text>
    </svg>
  )
}
function TwilioSVG() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-auto shrink-0" aria-label="Twilio">
      <circle cx="32" cy="32" r="30" fill="none" stroke="#F22F46" strokeWidth="4"/>
      <circle cx="21" cy="21" r="6" fill="#F22F46"/>
      <circle cx="43" cy="21" r="6" fill="#F22F46"/>
      <circle cx="21" cy="43" r="6" fill="#F22F46"/>
      <circle cx="43" cy="43" r="6" fill="#F22F46"/>
    </svg>
  )
}

const partners = [
  { name: 'Firebase', Svg: FirebaseSVG },
  { name: 'Google Cloud', Svg: GoogleCloudSVG },
  { name: 'Gemini AI', Svg: GeminiSVG },
  { name: 'Razorpay', Svg: RazorpaySVG },
  { name: 'Twilio', Svg: TwilioSVG },
]

function PartnersMarquee() {
  const doubled = [...partners, ...partners, ...partners]
  return (
    <div className="relative overflow-hidden py-3">
      <div className="flex marquee-track gap-4 items-center">
        {doubled.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex items-center gap-2.5 shrink-0 px-5 py-3 rounded-2xl bg-white border border-white/90 hover:shadow-lg transition-all"
          >
            <p.Svg />
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── How It Works step item (MessPass-style premium timeline) ─── */
function HowStep({ step, isLast }: { step: typeof howItWorks[0]; isLast: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 12 }}
      transition={{ duration: 0.55 }}
      className="grid grid-cols-[64px_1fr] gap-6 lg:gap-8"
    >
      {/* Left column — icon badge + connector line */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={isInView
            ? { boxShadow: `0 0 22px ${step.glow}, 0 0 44px ${step.glow}` }
            : { boxShadow: '0 0 0px transparent' }}
          transition={{ duration: 0.55 }}
          className="relative w-14 h-14 lg:w-[60px] lg:h-[60px] rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: step.bg, border: `1.5px solid ${step.color}28` }}
        >
          <Icon className="h-6 w-6" style={{ color: step.color }} />
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-black leading-none"
            style={{ background: step.color }}
          >
            {step.step}
          </span>
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 mt-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', minHeight: '40px' }}>
            <motion.div
              className="w-full origin-top"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              style={{ height: '100%', background: `linear-gradient(to bottom, ${step.color}80, transparent)` }}
            />
          </div>
        )}
      </div>

      {/* Right column — content */}
      <div className={`${isLast ? 'pb-0' : 'pb-10 lg:pb-14'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase"
            style={{
              color: step.color,
              background: `${step.color}14`,
              border: `1px solid ${step.color}28`,
            }}
          >
            STEP {step.step}
          </span>
        </div>

        <h3 className="text-xl lg:text-2xl font-black text-white mb-3 leading-snug">{step.titleEn}</h3>
        <p className="text-white/60 leading-relaxed text-[15px] mb-2">{step.descEn}</p>
        <p className="text-white/35 text-sm leading-relaxed mb-5">{step.detailEn}</p>

        <div className="flex flex-wrap gap-2">
          {step.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                color: step.color,
                background: `${step.color}10`,
                border: `1px solid ${step.color}22`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── How It Works vertical timeline (MessPass-style) ─── */
function HowItWorksSection({ language }: { language: string }) {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden border-t border-white/5" id="how-it-works">
      <div className="absolute inset-0 bg-white/[0.012]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7C4DFF]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <SectionBadge label="How It Works" />
          <h2 className="text-4xl font-black text-white sm:text-5xl lg:text-[3.2rem] leading-[1.05] mb-4">
            {language === 'en'
              ? <>From signup to live —<br /><span className="gradient-text">in 4 simple steps.</span></>
              : <>4 आसान चरणों में<br /><span className="gradient-text">शुरू करें।</span></>}
          </h2>
          <p className="text-white/45 text-[15px] leading-relaxed max-w-xl mx-auto">
            {language === 'en'
              ? 'No long contracts. No complicated setup. No IT team needed. Just contact us and we handle everything — from configuration to training to go-live.'
              : 'कोई लंबे अनुबंध नहीं। कोई जटिल सेटअप नहीं। बस हमसे संपर्क करें।'}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl">
          {howItWorks.map((step) => (
            <HowStep key={step.step} step={step} isLast={step.step === howItWorks[howItWorks.length - 1].step} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Security section (inline) ─── */
function SecuritySection({ language }: { language: string }) {
  const features = [
    { icon: Lock, title: '256-bit AES Encryption', desc: 'All data encrypted at rest and in transit.', color: 'text-aqua' },
    { icon: Server, title: 'Google Cloud Hosting', desc: 'Redundant infrastructure, 99.9% uptime target.', color: 'text-blue-400' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Principals, teachers, parents — each gets exactly what they need.', color: 'text-purple-400' },
    { icon: Activity, title: '24/7 Monitoring', desc: 'Automated alerts and continuous security scanning.', color: 'text-green-400' },
    { icon: CheckCircle2, title: 'GDPR Compliant', desc: 'Student data handled with full regulatory compliance.', color: 'text-yellow-400' },
    { icon: Zap, title: '2-Hour Support SLA', desc: 'Critical issues resolved fast. Real humans, no bots.', color: 'text-orange-400' },
  ]

  return (
    <section id="security" className="py-20 lg:py-28 relative border-t border-white/5 scroll-mt-20">
      <div className="absolute inset-0 section-glow-left pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionBadge label="Security" />
          <h2 className="text-4xl font-black text-white sm:text-5xl mb-4">
            {language === 'en' ? 'Built for Trust' : 'विश्वास के लिए निर्मित'}
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            {language === 'en'
              ? 'Your students\' data is your responsibility. We treat it like ours.'
              : 'आपके छात्रों का डेटा आपकी जिम्मेदारी है। हम इसे अपना मानते हैं।'}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass-card animated-border rounded-2xl p-6 flex items-start gap-4 group hover:border-white/10 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/[0.08] transition-colors">
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-[15px]">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Tech logo icons (chip size and tile size) ─── */
function TechChipIcon({ name, big = false }: { name: string; big?: boolean }) {
  const s = big ? 'w-5 h-5 shrink-0' : 'w-3.5 h-3.5 shrink-0'
  const bs = big ? 'w-5 h-5 rounded-[4px] text-[8px]' : 'w-3.5 h-3.5 rounded-[3px] text-[7px]'
  if (name === 'React') return (
    <svg viewBox="0 0 24 24" className={s} fill="none" stroke="#61DAFB" strokeWidth="1.6">
      <circle cx="12" cy="12" r="2.2" fill="#61DAFB" stroke="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)"/>
    </svg>
  )
  if (name === 'TypeScript') return (
    <span className={`inline-flex items-center justify-center font-black text-white shrink-0 ${bs}`} style={{ background: '#3178C6' }}>TS</span>
  )
  if (name === 'Tailwind CSS') return (
    <svg viewBox="0 0 24 24" className={s} fill="#06B6D4">
      <path d="M12 6c-2 0-3.33 1-4 3 .67-1 1.33-1.33 2.33-1.17.51.09.87.43 1.27.83C12.23 9.37 13.11 10.25 15 10.25c2 0 3.33-1 4-3-.67 1-1.33 1.33-2.33 1.17-.51-.09-.87-.43-1.27-.83C14.77 6.88 13.89 6 12 6zm-4 5c-2 0-3.33 1-4 3 .67-1 1.33-1.33 2.33-1.17.51.09.87.43 1.27.83C8.23 14.37 9.11 15.25 11 15.25c2 0 3.33-1 4-3-.67 1-1.33 1.33-2.33 1.17-.51-.09-.87-.43-1.27-.83C10.77 11.88 9.89 11 8 11z"/>
    </svg>
  )
  if (name === 'Framer Motion') return (
    <svg viewBox="0 0 24 24" className={s} fill="#BB4DFF">
      <path d="M4 3h16v6H4zM4 9h8l8 6H4zM4 15l8 6H4z"/>
    </svg>
  )
  if (name === 'Node.js') return (
    <svg viewBox="0 0 24 24" className={s} fill="#68A063">
      <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.3L19.5 8v8L12 19.7 4.5 16V8L12 4.3z"/>
    </svg>
  )
  if (name === 'Express') return (
    <span className={`inline-flex items-center justify-center font-black text-black shrink-0 ${bs}`} style={{ background: '#aaaaaa' }}>Ex</span>
  )
  if (name === 'PostgreSQL') return (
    <svg viewBox="0 0 24 24" className={s}>
      <ellipse cx="12" cy="7" rx="8" ry="4" fill="#336791"/>
      <path d="M4 7v10c0 2.2 3.58 4 8 4s8-1.8 8-4V7" fill="none" stroke="#336791" strokeWidth="2.2"/>
    </svg>
  )
  if (name === 'Drizzle ORM') return (
    <svg viewBox="0 0 24 24" className={s} fill="#C5F74F">
      <circle cx="7" cy="12" r="2.8"/>
      <circle cx="17" cy="8" r="2.8"/>
      <circle cx="17" cy="17" r="2.8"/>
    </svg>
  )
  if (name === 'Google Cloud') return (
    <svg viewBox="0 0 24 24" className={s}>
      <path d="M12 4.5C8.4 4.5 5.4 6.9 4.4 10.1c-2.1.5-3.6 2.3-3.6 4.5 0 2.5 2 4.5 4.5 4.5H18c2.2 0 4-1.8 4-4 0-2.1-1.6-3.9-3.7-4.1C17.4 7 15 4.5 12 4.5z" fill="#4285F4"/>
    </svg>
  )
  if (name === 'Firebase') return (
    <svg viewBox="0 0 24 24" className={s}>
      <path d="M5.5 19L10 7l2.5 5L15 9l3 10H5.5z" fill="#FFC107"/>
      <path d="M10 7L5.5 19l6-7L10 7z" fill="#FF9800" opacity=".8"/>
    </svg>
  )
  if (name === 'Razorpay') return (
    <svg viewBox="0 0 20 20" className={s}>
      <path d="M3 3l6 14 3-8 5-6H3z" fill="#3395FF"/>
    </svg>
  )
  if (name === 'Twilio') return (
    <svg viewBox="0 0 24 24" className={s} fill="none" stroke="#F22F46" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9.5"/>
      <circle cx="8.5" cy="8.5" r="1.8" fill="#F22F46" stroke="none"/>
      <circle cx="15.5" cy="8.5" r="1.8" fill="#F22F46" stroke="none"/>
      <circle cx="8.5" cy="15.5" r="1.8" fill="#F22F46" stroke="none"/>
      <circle cx="15.5" cy="15.5" r="1.8" fill="#F22F46" stroke="none"/>
    </svg>
  )
  if (name === 'Prisma') return (
    <svg viewBox="0 0 24 24" className={s} fill="none">
      <path d="M3 17.5L12 3l9 14.5H3z" fill="#0C344B" stroke="#0C344B" strokeWidth="1.2"/>
      <path d="M3 17.5l6-7 3 7H3z" fill="#16A394" stroke="none"/>
      <path d="M12 3v14.5" stroke="#16A394" strokeWidth="1.4"/>
    </svg>
  )
  if (name === 'Resend') return (
    <svg viewBox="0 0 24 24" className={s} fill="none">
      <rect width="24" height="24" rx="6" fill="#000"/>
      <path d="M6 8h7a3 3 0 010 6H9l6 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
  return <div className={`rounded-full bg-white/30 shrink-0 ${big ? 'w-5 h-5' : 'w-2 h-2'}`} />
}

/* ─── Tech ecosystem items for the floating tile grid ─── */
const techItems = [
  { name: 'React',        cat: 'Frontend',  catColor: '#00E5C3' },
  { name: 'TypeScript',   cat: 'Frontend',  catColor: '#00E5C3' },
  { name: 'Tailwind CSS', cat: 'Frontend',  catColor: '#00E5C3' },
  { name: 'Framer Motion',cat: 'Frontend',  catColor: '#00E5C3' },
  { name: 'Node.js',      cat: 'Backend',   catColor: '#7C4DFF' },
  { name: 'Express',      cat: 'Backend',   catColor: '#7C4DFF' },
  { name: 'PostgreSQL',   cat: 'Backend',   catColor: '#7C4DFF' },
  { name: 'Prisma',       cat: 'Backend',   catColor: '#7C4DFF' },
  { name: 'Google Cloud', cat: 'Cloud',     catColor: '#3B82F6' },
  { name: 'Firebase',     cat: 'Cloud',     catColor: '#3B82F6' },
  { name: 'Razorpay',     cat: 'Payments',  catColor: '#F59E0B' },
  { name: 'Twilio',       cat: 'Comms',     catColor: '#EF4444' },
  { name: 'Resend',       cat: 'Email',     catColor: '#00E5C3' },
]

function DeveloperSection({ language }: { language: string }) {
  return (
    <section className="py-20 lg:py-28 relative border-t border-white/5">
      <div className="absolute inset-0 section-glow-right pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionBadge label="About the Builder" />
          <h2 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Built by{' '}
            <span className="gradient-text">Prasanna Mate</span>
            {' '}— for India's schools.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left — profile card with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <TiltCard className="glass-card animated-border rounded-3xl p-8 h-full">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={prasannaImg}
                  alt="Prasanna Mate"
                  className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-white/10 shrink-0"
                />
                <div>
                  <h3 className="text-xl font-black text-white">Prasanna Mate</h3>
                  <p className="text-sm font-semibold text-aqua">CTO & Software Developer</p>
                </div>
              </div>

              <p className="text-white/50 leading-relaxed text-[15px] mb-5">
                Built REVENEX from scratch. Leads platform engineering to ensure reliability, performance, and smooth deployments.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { num: '2+', label: 'Years Building' },
                  { num: '10+', label: 'Schools Served' },
                  { num: '99.9%', label: 'Uptime SLA' },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-xl p-3 text-center border border-white/5">
                    <div className="text-lg font-black gradient-text">{s.num}</div>
                    <div className="text-[10px] text-white/40 font-medium mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href="https://www.linkedin.com/in/prasanna-mate-a247b5328/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all text-sm font-medium"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="mailto:prasannamate1754@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all text-sm font-medium"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
                <a
                  href="https://www.revenex.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all text-sm font-medium"
                >
                  <Globe2 className="h-4 w-4" /> Website
                </a>
              </div>
            </TiltCard>
          </motion.div>

          {/* Right — tech stack categorized glass cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {[
              { label: 'FRONTEND', color: '#00E5C3', techs: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
              { label: 'BACKEND', color: '#7C4DFF', techs: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM'] },
              { label: 'CLOUD & INFRA', color: '#3B82F6', techs: ['Google Cloud', 'Firebase', 'Razorpay', 'Resend'] },
            ].map((cat, ci) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1 }}
                className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: cat.color }}>
                    {cat.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.techs.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-default"
                    >
                      <TechChipIcon name={tech} />
                      <span className="text-xs font-medium text-white/70">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Reviews section ─── */
function ReviewsSection() {
  const queryClient = useQueryClient()
  const { data: reviews = [], isLoading } = useListReviews()
  const mutation = useSubmitReview()

  const [form, setForm] = useState({ name: '', role: '', school: '', rating: 0, content: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [localReviews, setLocalReviews] = useState<Array<{
    id: number; name: string; role: string; school: string;
    content: string; rating: number; approved: boolean; createdAt: Date
  }>>([])
  const allReviews = [...localReviews, ...reviews]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.rating || !form.content) return
    const submittedData = { name: form.name, role: form.role || 'Educator', school: form.school || 'School', rating: form.rating, content: form.content }
    mutation.mutate(
      { data: submittedData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() })
          setLocalReviews(prev => [{ id: Date.now(), ...submittedData, approved: false, createdAt: new Date() }, ...prev])
          setForm({ name: '', role: '', school: '', rating: 0, content: '' })
          setSubmitted(true)
          setTimeout(() => setSubmitted(false), 3000)
        },
      }
    )
  }

  return (
    <section className="py-20 lg:py-28 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionBadge label="Reviews" />
          <h2 className="text-4xl font-black text-white sm:text-5xl mb-3">What people are saying</h2>
          <p className="text-white/40">Real feedback from schools and educators trying REVENEX.</p>
        </motion.div>

        {/* Review cards — floating marquee right to left */}
        {isLoading && localReviews.length === 0 ? (
          <div className="text-center py-12 mb-12">
            <motion.div
              className="inline-block w-8 h-8 border-2 border-aqua/30 border-t-aqua rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />
          </div>
        ) : allReviews.length > 0 ? (
          <div className="relative overflow-hidden mb-12 py-2">
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#040712] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#040712] to-transparent z-10 pointer-events-none" />
            <div className="reviews-marquee-track">
              {[...allReviews, ...allReviews, ...allReviews].map((review, i) => (
                <div
                  key={`${review.id}-${i}`}
                  className="glass-card rounded-2xl p-5 border border-white/5 shrink-0 mx-3"
                  style={{ width: '320px' }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                      />
                    ))}
                    <span className="ml-auto text-xs text-white/25">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 italic line-clamp-3">"{review.content}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-black text-xs font-black shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-white">{review.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12 mb-12"
          >
            <Star className="h-10 w-10 text-yellow-400/30 mx-auto mb-3" />
            <p className="text-white/30 font-medium">No reviews yet — be the first to share your experience!</p>
          </motion.div>
        )}

        {/* Leave a review form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto form-card glass-card animated-border rounded-3xl p-8"
        >
          <h3 className="text-xl font-black text-white mb-1">Leave a review</h3>
          <p className="text-white/40 text-sm mb-6">Share your experience with REVENEX.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Rajesh Sharma"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g., Principal, Teacher, Admin"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">School / Institution</label>
              <input
                type="text"
                placeholder="e.g., Pune Public School"
                value={form.school}
                onChange={(e) => setForm((p) => ({ ...p, school: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setForm((p) => ({ ...p, rating: s }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        s <= (hoverRating || form.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Your Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience..."
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={!mutation.isPending ? { scale: 1.02 } : {}}
              whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
              className="w-full gradient-bg text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <motion.div
                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
              ) : submitted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Review submitted!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit Review
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Let's Talk section ─── */
function LetsTalkSection({ language }: { language: string }) {
  const [form, setForm] = useState({ name: '', institution: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { mutate: submitContact, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setSent(true)
        setForm({ name: '', institution: '', email: '', message: '' })
        setTimeout(() => setSent(false), 4000)
      },
      onError: () => {
        setError('Something went wrong. Please try again.')
        setTimeout(() => setError(''), 4000)
      },
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email and message.')
      return
    }
    submitContact({ data: { name: form.name, email: form.email, institution: form.institution || undefined, message: form.message } })
  }

  return (
    <section className="py-20 lg:py-28 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionBadge label="Get in Touch" />
          <h2 className="text-4xl font-black text-white sm:text-5xl">Let's talk.</h2>
          <p className="text-white/40 mt-3 max-w-lg mx-auto">
            Have a question or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 space-y-6"
          >
            {[
              { icon: Mail, label: 'Email', value: 'team@revenex.in', href: 'mailto:team@revenex.in' },
              { icon: Phone, label: 'Phone', value: '+91 90217 44355', href: 'tel:+919021744355' },
              { icon: MapPin, label: 'Location', value: 'Pune, Maharashtra, India', href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-aqua/10 border border-aqua/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-aqua h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                  <a href={href} className="text-white/70 hover:text-aqua transition-colors text-sm">{value}</a>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-white/30 leading-relaxed">
                We reply to all messages within 24 hours — no auto-replies, real humans.
              </p>
            </div>
          </motion.div>

          {/* Message form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="form-card glass-card animated-border rounded-3xl p-8"
          >
            <h3 className="text-lg font-black text-white mb-1">Send Message</h3>
            <p className="text-white/35 text-sm mb-6">We'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/35 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/35 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul@school.in"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/35 mb-1.5">Institution / School Name</label>
                <input
                  type="text"
                  placeholder="St. Mary's High School"
                  value={form.institution}
                  onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/35 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your school and what you need..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-aqua/40 transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs font-medium">{error}</p>
              )}

              <motion.button
                type="submit"
                disabled={isPending || sent}
                whileHover={isPending || sent ? {} : { scale: 1.02 }}
                whileTap={isPending || sent ? {} : { scale: 0.98 }}
                className="w-full gradient-bg text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sent ? (
                  <><CheckCircle2 className="h-4 w-4" /> Message sent!</>
                ) : isPending ? (
                  <><Zap className="h-4 w-4 animate-pulse" /> Sending…</>
                ) : (
                  <><Send className="h-4 w-4" /> Send Message</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Why REVENEX section ─── */
const whyReasons = [
  {
    icon: Lock,
    title: 'Secure',
    desc: '256-bit AES encryption, role-based access control, and GDPR-compliant data handling keep your school data safe.',
    color: '#00E5C3', bg: 'rgba(0,229,195,0.10)', border: 'rgba(0,229,195,0.22)',
    slug: 'security',
  },
  {
    icon: Server,
    title: 'Scalable',
    desc: 'Handles 100 to 10,000+ students with zero performance degradation. Grows with your institution seamlessly.',
    color: '#7C4DFF', bg: 'rgba(124,77,255,0.10)', border: 'rgba(124,77,255,0.22)',
    slug: 'student-management',
  },
  {
    icon: Cloud,
    title: 'Cloud Based',
    desc: 'Hosted on Google Cloud with 99.9% uptime target. Access your ERP from any device, anywhere, anytime.',
    color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.22)',
    slug: 'cloud-based',
  },
  {
    icon: Sparkles,
    title: 'AI Powered',
    desc: 'Gemini AI generates performance reports, predicts dropout risks, and automates routine administrative tasks.',
    color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.22)',
    slug: 'ai-analytics',
  },
  {
    icon: TrendingUp,
    title: 'Affordable',
    desc: 'Transparent pricing designed for Indian schools. No hidden costs, no per-module charges — one plan, all features.',
    color: '#10B981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)',
    slug: 'fees',
  },
  {
    icon: GraduationCap,
    title: 'Built For Indian Schools',
    desc: 'Hindi + English bilingual, Razorpay UPI payments, CBSE/ICSE formats — built ground-up for India\'s classrooms.',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)',
    slug: 'one-platform',
  },
]

function WhyRevenexSection({ language }: { language: string }) {
  return (
    <section className="py-20 lg:py-28 relative border-t border-white/5">
      <div className="absolute inset-0 section-glow-right pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SectionBadge label="Why REVENEX" />
          <h2 className="text-4xl font-black text-white sm:text-5xl mb-4">
            {language === 'en' ? (
              <>Why Schools Choose <span className="gradient-text">REVENEX</span></>
            ) : (
              <>स्कूल <span className="gradient-text">REVENEX</span> क्यों चुनते हैं</>
            )}
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            {language === 'en'
              ? "We didn't just build a school app. We built a complete operations platform."
              : 'हमने सिर्फ एक ऐप नहीं बनाया। हमने एक पूरा ऑपरेशन प्लेटफॉर्म बनाया।'}
          </p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyReasons.map((reason, i) => (
            <motion.div
              key={reason.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/features/${reason.slug}`}>
                <TiltCard
                  className="glass-card rounded-2xl p-6 h-full cursor-pointer group relative overflow-hidden"
                  style={{ border: `1px solid ${reason.border}` } as React.CSSProperties}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${reason.color}09 0%, transparent 100%)` }}
                  />
                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                      style={{ background: reason.bg }}
                    >
                      <reason.icon className="h-6 w-6" style={{ color: reason.color }} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-3">{reason.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed mb-5">{reason.desc}</p>
                    <div
                      className="flex items-center gap-1.5 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                      style={{ color: reason.color }}
                    >
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Meet the Founders section (home) ─── */
function MeetFoundersSection() {
  const homeFounders = [
    {
      name: 'Rounak Vijay Sute',
      role: 'Founder & CEO',
      img: rounakNewImg,
      desc: 'Leads business growth, client relationships, and strategic decision-making to deliver impactful digital solutions.',
      linkedin: 'https://www.linkedin.com/in/rounaksute/',
      color: '#00E5C3',
    },
    {
      name: 'Rohan Rajendra Raundal',
      role: 'Co-Founder',
      img: rohanNewImg,
      desc: 'Leads technology, product development, and innovation to build reliable and scalable digital products.',
      linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
      color: '#7C4DFF',
    },
  ]

  return (
    <section className="py-20 lg:py-28 relative border-t border-white/5">
      <div className="absolute inset-0 section-glow-left pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionBadge label="Leadership" />
          <h2 className="text-4xl font-black text-white sm:text-5xl mb-3">Meet the Founders</h2>
          <p className="text-white/40">The team building India's school ERP of tomorrow.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {homeFounders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <TiltCard className="glass-card animated-border rounded-3xl p-8 text-center group h-full">
                <div className="relative inline-block mb-5">
                  <img
                    src={f.img}
                    alt={f.name}
                    className="w-24 h-24 rounded-2xl object-cover object-top mx-auto"
                    style={{ border: `2px solid ${f.color}30` }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${f.color} 0%, transparent 70%)` }}
                  />
                </div>
                <h3 className="text-xl font-black text-white mb-1">{f.name}</h3>
                <p className="text-sm font-semibold mb-4" style={{ color: f.color }}>{f.role}</p>
                <p className="text-white/45 text-sm leading-relaxed mb-6">{f.desc}</p>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all hover:scale-105"
                  style={{ color: f.color, borderColor: `${f.color}30`, background: `${f.color}08` }}
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn Profile
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Main Home component ─── */
const barHeights = [40, 55, 48, 72, 88, 82, 94, 91, 96, 93, 95, 94]

export default function Home() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C4DFF]/6 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#00E5C3]/6 rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,229,195,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5C3]/20 bg-[#00E5C3]/5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5C3] animate-pulse" />
                <span className="text-xs font-semibold text-[#00E5C3] tracking-widest uppercase">{t('hero.badge')}</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem] mb-6 leading-none"
            >
              <span className="text-white">{t('hero.title')}</span>
              <br />
              <span className="gradient-text">{t('hero.titleHighlight')}</span>
              <br />
              <span className="text-white">{t('hero.titleEnd')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mx-auto max-w-2xl text-lg text-white/50 leading-relaxed mb-10"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
            >
              <Link href="/book-demo">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,229,195,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-8 py-4 rounded-2xl text-base transition-all cursor-pointer shadow-lg"
                >
                  {t('hero.cta.demo')} <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Link>
              <Link href="/login">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 border border-white/15 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:bg-white/5 cursor-pointer"
                >
                  {language === 'en' ? 'Sign In' : 'साइन इन करें'} <ArrowRight className="h-5 w-5 opacity-60" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-center gap-6 mb-16 flex-wrap"
            >
              {['Enterprise Security', '99.9% Uptime Target', 'Indian EdTech'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-white/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#00E5C3]" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="glass-card rounded-3xl overflow-hidden border border-white/10" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6), 0 0 100px rgba(0,229,195,0.04)' }}>
                <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="ml-4 flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-1.5 max-w-xs w-full">
                      <Lock className="h-3 w-3 text-[#00E5C3]" />
                      <span className="text-xs text-white/30">app.revenex.in/dashboard</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5C3] animate-pulse" />
                    <span className="text-xs text-[#00E5C3] font-medium">Preview</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Total Students', value: '2,847', icon: Users, color: 'text-[#00E5C3]', bg: 'bg-[#00E5C3]/10' },
                      { label: 'Attendance Today', value: '94.2%', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
                      { label: 'Fees Collected', value: '₹12.4L', icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                      { label: 'Staff Active', value: '142', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    ].map((kpi, i) => (
                      <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.08 }} className={`${kpi.bg} rounded-xl p-3 border border-white/5`}>
                        <kpi.icon className={`h-4 w-4 ${kpi.color} mb-2`} />
                        <div className={`text-xl font-black ${kpi.color} mb-0.5`}>{kpi.value}</div>
                        <div className="text-xs text-white/35">{kpi.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-semibold text-white/70">Attendance Trend</div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-[#00E5C3]" />
                          <span className="text-xs text-[#00E5C3] font-semibold">94.2%</span>
                        </div>
                      </div>
                      <div className="flex items-end gap-1.5 h-16">
                        {barHeights.map((h, i) => (
                          <motion.div key={`bar-${i}`} className="flex-1 rounded-t-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 1.0 + i * 0.04, ease: 'easeOut' }} style={{ background: i >= 9 ? 'linear-gradient(to top, rgba(0,181,154,0.8), rgba(0,181,154,0.4))' : 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <div className="text-xs font-semibold text-white/60 mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#7C4DFF]" /> AI Activity
                      </div>
                      <div className="space-y-2.5">
                        {[
                          { text: 'Fee reminder sent', color: 'bg-yellow-400' },
                          { text: 'Report generated', color: 'bg-[#00B59A]' },
                          { text: 'Payroll processed', color: 'bg-green-400' },
                        ].map((item) => (
                          <div key={item.text} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                            <p className="text-[10px] text-white/55">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TECH PARTNERS (white pill badges) ── */}
      <section className="py-10 border-y border-white/5 overflow-hidden bg-[#040712]/50">
        <div className="mx-auto max-w-7xl px-4 mb-5">
          <p className="text-center text-[11px] font-black text-white/25 uppercase tracking-widest">
            Trusted Partners Powering the REVENEX Platform
          </p>
        </div>
        <PartnersMarquee />
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 section-glow-left pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <SectionBadge label="Features" />
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-4">{t('features.title')}</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={`/features/${feature.slug}`}>
                  <TiltCard className="glass-card animated-border rounded-2xl p-6 h-full cursor-pointer group relative overflow-hidden">
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, rgba(0,181,154,0.06) 0%, transparent 100%)` }}
                    />
                    <div className="relative z-10">
                      <div className={`inline-flex rounded-2xl p-3 mb-4 ${feature.bg}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed mb-4">{feature.desc}</p>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY REVENEX ── */}
      <WhyRevenexSection language={language} />

      {/* ── HOW IT WORKS (vertical animated timeline) ── */}
      <HowItWorksSection language={language} />

      {/* ── SECURITY (inline section) ── */}
      <SecuritySection language={language} />

      {/* ── ENGINEERING SPECS ── */}
      <section className="py-12 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '99.9%', label: 'Uptime SLA Target', color: 'text-aqua' },
              { value: '2hr', label: 'Support Response', color: 'text-purple-400' },
              { value: '256-bit', label: 'AES Encryption', color: 'text-green-400' },
              { value: '24/7', label: 'Monitoring', color: 'text-yellow-400' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className={`text-3xl font-black lg:text-4xl mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE FOUNDERS ── */}
      <MeetFoundersSection />

      {/* ── DEVELOPER SECTION ── */}
      <DeveloperSection language={language} />

      {/* ── LET'S TALK ── */}
      <LetsTalkSection language={language} />

      {/* ── REVIEWS ── */}
      <ReviewsSection />

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 hero-glow opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-6">{t('cta.title')}</h2>
            <p className="text-white/50 mb-8 text-lg">{t('cta.subtitle')}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/book-demo">
                <motion.span whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-8 py-4 rounded-2xl cursor-pointer">
                  {t('cta.demo')} <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 cursor-pointer">
                  {t('cta.contact')}
                </motion.span>
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
