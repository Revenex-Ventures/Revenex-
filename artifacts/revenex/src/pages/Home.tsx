import { useRef, useState, useEffect } from 'react'
import { Link } from 'wouter'
import { useQueryClient } from '@tanstack/react-query'
import { motion, useScroll, useSpring, useInView, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Users, BookOpen, CreditCard, Bell, Calendar,
  BarChart3, Shield, Cpu, CheckCircle2, Zap, Cloud, Sparkles,
  GraduationCap, TrendingUp, Lock, Activity, Server,
  MessageSquare, Award, Star, Send, Globe2, Linkedin,
  Mail, Phone, MapPin, Building2, FileBarChart, Smartphone,
  LayoutDashboard, Settings2,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import Testimonials from '@/components/Testimonials'
import { useLanguage } from '@/lib/language-context'
import { useListReviews, getListReviewsQueryKey, useSubmitReview, useSubmitContact } from '@workspace/api-client-react'
import googleCloudLogo from '@assets/image_1783259012481.png'
import geminiLogo from '@assets/image_1783259044391.png'
import razorpayLogo from '@assets/image_1783259072151.png'
import firebaseLogo from '@assets/image_1783259104105.png'
import twilioLogo from '@assets/image_1783259146914.png'
const prasannaImg = '/Prasanna.jpg'
const rounakNewImg = '/Rounak.jpg'
const rohanNewImg = '/Rohan.jpg'

/* ─── Section badge ─── */
function SectionBadge({ label }: { label: string }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC]">
        <span className="text-[11px] font-black text-[#3D3128] uppercase tracking-widest">{label}</span>
      </div>
    </div>
  )
}

/* ─── Animated section divider ─── */
function SectionDivider() {
  return (
    <div className="relative w-full h-10 overflow-hidden">
      <div
        className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D4B896 20%, #8B4513 50%, #D4B896 80%, transparent 100%)' }}
      />
      <motion.div
        className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2"
        style={{ background: '#8B4513', opacity: 0.6 }}
        animate={{ x: ['-10vw', '110vw'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
        <motion.div
          className="w-2 h-2 rotate-45"
          style={{ background: '#8B4513' }}
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="w-2 h-2 rotate-45"
          style={{ background: '#8B4513' }}
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
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
  { icon: Users, title: 'Student Management', desc: 'Manage student records from admission to graduation.', color: 'text-[#8B4513]', bg: 'bg-[#F0E8DC]', slug: 'student-management' },
  { icon: Calendar, title: 'Attendance Tracking', desc: 'Automate attendance and send SMS alerts to parents.', color: 'text-green-700', bg: 'bg-green-700/10', slug: 'attendance' },
  { icon: CreditCard, title: 'Fee Management', desc: 'Collect fees online, issue receipts, and integrate with Razorpay.', color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]', slug: 'fees' },
  { icon: Bell, title: 'Parent Communication', desc: 'Send SMS, WhatsApp, and app notifications to parents.', color: 'text-[#8B4513]', bg: 'bg-[#F0E8DC]', slug: 'parent-communication' },
  { icon: BookOpen, title: 'Exam & Results', desc: 'Run exams, grade work, and share report cards.', color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]', slug: 'exam-results' },
  { icon: BarChart3, title: 'AI Analytics', desc: 'Simple dashboards and insights for principals.', color: 'text-[#8B4513]', bg: 'bg-[#F0E8DC]', slug: 'ai-analytics' },
  { icon: Users, title: 'Staff Management', desc: 'Manage payroll, leaves, and staff performance.', color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]', slug: 'staff-management' },
  { icon: Shield, title: 'Security & Access', desc: 'Role-based access and strong data protection.', color: 'text-green-700', bg: 'bg-green-700/10', slug: 'security' },
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
    color: '#8B4513',
    glow: 'rgba(139, 69, 19,0.22)',
    bg: 'rgba(139, 69, 19,0.09)',
    iconBg: 'linear-gradient(135deg, #F0E8DC, #E8DDD0)',
    iconColor: '#8B4513',
    dark: false,
    iconAnim: { y: [0, -4, 0] },
    iconAnimTransition: { repeat: Infinity, duration: 2 },
  },
  {
    step: '02',
    icon: Settings2,
    titleEn: 'Custom ERP Setup',
    descEn: 'We set up the platform to match your processes and rules.',
    detailEn: 'We migrate data and apply your branding.',
    tags: ['Zero Data Loss', 'Custom Branding', '48hr Turnaround'],
    color: '#7C3D0F',
    glow: 'rgba(124, 61, 15,0.22)',
    bg: 'rgba(124, 61, 15,0.09)',
    iconBg: 'linear-gradient(135deg, #1A1410, #3D2810)',
    iconColor: '#FFFFFF',
    dark: true,
    iconAnim: { rotate: [0, 360] },
    iconAnimTransition: { repeat: Infinity, duration: 6, ease: 'linear' as const },
  },
  {
    step: '03',
    icon: GraduationCap,
    titleEn: 'Staff Onboarding & Training',
    descEn: 'We train your staff and provide clear guides.',
    detailEn: 'Live sessions and support until your team is ready.',
    tags: ['Role-Based Access', 'Live Training', 'Video Guides'],
    color: '#166534',
    glow: 'rgba(22, 101, 52,0.22)',
    bg: 'rgba(22, 101, 52,0.09)',
    iconBg: 'linear-gradient(135deg, #F0E8DC, #E8DDD0)',
    iconColor: '#8B4513',
    dark: false,
    iconAnim: { y: [0, -4, 0] },
    iconAnimTransition: { repeat: Infinity, duration: 2.5 },
  },
  {
    step: '04',
    icon: Activity,
    titleEn: 'Go Live & Ongoing Support',
    descEn: 'We launch the system and provide ongoing support.',
    detailEn: 'Ongoing help, regular updates, and monthly reports.',
    tags: ['2hr Support SLA', '99.9% Uptime', 'Free Updates'],
    color: '#166534',
    glow: 'rgba(22, 101, 52,0.22)',
    bg: 'rgba(22, 101, 52,0.09)',
    iconBg: 'linear-gradient(135deg, #1A1410, #3D2810)',
    iconColor: '#FFFFFF',
    dark: true,
    iconAnim: { scaleX: [1, 1.2, 1] },
    iconAnimTransition: { repeat: Infinity, duration: 1.5 },
  },
]

/* ─── Partner logos (white pill style) ─── */
const partners = [
  { name: 'Google Cloud', logo: googleCloudLogo, heightClass: 'h-11' },
  { name: 'Gemini', logo: geminiLogo, heightClass: 'h-11' },
  { name: 'Razorpay', logo: razorpayLogo, heightClass: 'h-12' },
  { name: 'Firebase', logo: firebaseLogo, heightClass: 'h-7' },
  { name: 'Twilio', logo: twilioLogo, heightClass: 'h-7' },
]

function PartnersMarquee() {
  const doubled = [...partners, ...partners, ...partners]
  return (
    <div className="relative overflow-hidden py-3">
      <div className="flex marquee-track gap-4 items-center">
        {doubled.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex items-center justify-center gap-3 shrink-0 min-w-[160px] h-14 px-6 rounded-2xl bg-white border border-[#E8E0D4] hover:shadow-lg transition-all"
            style={{ boxShadow: '0 2px 8px rgba(139,69,19,0.06)' }}
          >
            <img src={p.logo} alt={p.name} className={`block ${p.heightClass} w-auto object-contain`} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── How It Works step item (left vertical timeline, icon box + tag pills) ─── */
function HowStep({ step, index, isLast }: { step: typeof howItWorks[0]; index: number; isLast: boolean }) {
  const ref = useRef(null)
  const Icon = step.icon
  const iconOnLeft = index % 2 === 0

  const iconEntrance = iconOnLeft
    ? { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.55 } }
    : { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.55, delay: 0.1 } }
  const contentEntrance = iconOnLeft
    ? { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.55, delay: 0.1 } }
    : { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.55 } }

  const iconBlock = (
    <motion.div
      ref={ref}
      initial={iconEntrance.initial}
      whileInView={iconEntrance.animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={iconEntrance.transition}
      className="relative flex flex-col items-center shrink-0"
    >
      <motion.div
        className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: step.iconBg, boxShadow: '0 8px 32px rgba(139,69,19,0.15)' }}
      >
        <motion.div animate={step.iconAnim} transition={step.iconAnimTransition}>
          <Icon className="h-8 w-8" style={{ color: step.iconColor }} />
        </motion.div>
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white leading-none z-10"
          style={{ background: '#8B4513' }}
        >
          {step.step}
        </motion.span>
      </motion.div>
      {!isLast && (
        <motion.span
          className="w-5 h-5 rounded-full mt-3 shrink-0"
          initial={{ scale: 0 }}
          whileInView={{ scale: [0, 1.5, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{ background: '#8B4513', border: '3px solid #F5F0E8', boxShadow: '0 0 0 3px rgba(139,69,19,0.2)' }}
        />
      )}
    </motion.div>
  )

  const contentBlock = (
    <motion.div
      initial={contentEntrance.initial}
      whileInView={contentEntrance.animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={contentEntrance.transition}
      className="rounded-3xl p-8 max-w-md"
      style={{
        background: 'linear-gradient(135deg, #FDF8F3, #F5EDE0)',
        border: '1px solid #E0D4C0',
        boxShadow: '0 4px 20px rgba(139,69,19,0.07)',
      }}
    >
      <span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-4"
        style={{ background: '#1A1410', color: '#FFFFFF' }}
      >
        STEP {step.step}
      </span>

      <h3 className="text-2xl font-bold text-[#1A1410] mb-3">{step.titleEn}</h3>
      <p className="text-[#3D3128] font-medium text-base">{step.descEn}</p>
      <p className="text-[#6B5D52] text-sm mt-1 mb-5">{step.detailEn}</p>

      <div className="flex flex-wrap gap-2 mt-5">
        {step.tags.map((tag) => (
          <motion.span
            key={tag}
            whileHover={{ y: -2, borderColor: '#8B4513', color: '#8B4513' }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 rounded-full text-xs font-medium"
            style={{
              background: '#FFFFFF',
              border: '1px solid #D4C4B0',
              color: '#3D3128',
              boxShadow: '0 2px 8px rgba(139,69,19,0.06)',
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className={`relative flex items-center gap-8 lg:gap-12 ${isLast ? 'pb-0' : 'pb-14 lg:pb-20'} ${iconOnLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {iconBlock}
      {contentBlock}
    </div>
  )
}

/* ─── How It Works — alternating left/right timeline with scroll-driven progress line ─── */
function HowItWorksSection({ language }: { language: string }) {
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.75', 'end 0.6'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden border-t border-[#E8E0D4]" id="how-it-works">
      <div className="absolute inset-0 bg-[#F0E8DC]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7C3D0F]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <SectionBadge label="How It Works" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl lg:text-[3.2rem] leading-[1.05] mb-4">
            {language === 'en'
              ? <>From signup to live —<br /><span className="gradient-text">in 4 simple steps.</span></>
              : <>4 आसान चरणों में<br /><span className="gradient-text">शुरू करें।</span></>}
          </h2>
          <p className="text-[#6B5D52] text-[15px] leading-relaxed max-w-xl mx-auto">
            {language === 'en'
              ? 'No long contracts. No complicated setup. No IT team needed. Just contact us and we handle everything — from configuration to training to go-live.'
              : 'कोई लंबे अनुबंध नहीं। कोई जटिल सेटअप नहीं। बस हमसे संपर्क करें।'}
          </p>
        </motion.div>

        {/* Center vertical timeline with scroll-driven progress line, alternating steps */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-[2px]"
            style={{ background: 'linear-gradient(180deg, #1A1410 0%, #8B4513 25%, #C4722A 50%, #8B4513 75%, #E8E0D4 100%)' }}
          />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-10 w-[2px] origin-top"
            style={{ height: 'calc(100% - 5rem)', background: 'linear-gradient(180deg, #8B4513, #C4722A)', scaleY: lineScale }}
          />
          <div className="relative flex flex-col">
            {howItWorks.map((step, i) => (
              <HowStep key={step.step} step={step} index={i} isLast={i === howItWorks.length - 1} />
            ))}
          </div>
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
    <section className="py-20 lg:py-28 border-t border-[#E8E0D4]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionBadge label="Reviews" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-3">What people are saying</h2>
          <p className="text-[#6B5D52]">Real feedback from schools and educators trying REVENEX.</p>
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
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5F0E8] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5F0E8] to-transparent z-10 pointer-events-none" />
            <div className="reviews-marquee-track">
              {[...allReviews, ...allReviews, ...allReviews].map((review, i) => (
                <div
                  key={`${review.id}-${i}`}
                  className="glass-card rounded-2xl p-5 border border-[#E8E0D4] shrink-0 mx-3"
                  style={{ width: '320px' }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s <= review.rating ? 'text-[#8B4513] fill-[#8B4513]' : 'text-[#6B5D52]'}`}
                      />
                    ))}
                    <span className="ml-auto text-xs text-[#6B5D52]">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[#3D3128] text-sm leading-relaxed mb-4 italic line-clamp-3">"{review.content}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-black shrink-0">
                      {review.name ? review.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="text-sm font-semibold text-[#1A1410]">{review.name || 'Anonymous'}</span>
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
            <Star className="h-10 w-10 text-[#8B4513]/30 mx-auto mb-3" />
            <p className="text-[#6B5D52] font-medium">No reviews yet — be the first to share your experience!</p>
          </motion.div>
        )}

        {/* Leave a review form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto form-card glass-card animated-border rounded-3xl p-8"
        >
          <h3 className="text-xl font-black text-[#1A1410] mb-1">Leave a review</h3>
          <p className="text-[#6B5D52] text-sm mb-6">Share your experience with REVENEX.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B5D52] uppercase tracking-wider mb-2">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Rajesh Sharma"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B5D52] uppercase tracking-wider mb-2">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g., Principal, Teacher, Admin"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B5D52] uppercase tracking-wider mb-2">School / Institution</label>
              <input
                type="text"
                placeholder="e.g., Pune Public School"
                value={form.school}
                onChange={(e) => setForm((p) => ({ ...p, school: e.target.value }))}
                className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B5D52] uppercase tracking-wider mb-2">Rating *</label>
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
                      className={`h-7 w-7 transition-colors ${s <= (hoverRating || form.rating) ? 'text-[#8B4513] fill-[#8B4513]' : 'text-[#6B5D52]'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B5D52] uppercase tracking-wider mb-2">Your Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience..."
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={!mutation.isPending ? { scale: 1.02 } : {}}
              whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
              className="w-full gradient-bg text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
    <section className="py-20 lg:py-28 border-t border-[#E8E0D4]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionBadge label="Get in Touch" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl">Let's talk.</h2>
          <p className="text-[#6B5D52] mt-3 max-w-lg mx-auto">
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
                  <p className="text-xs font-semibold text-[#6B5D52] uppercase tracking-wider mb-0.5">{label}</p>
                  <a href={href} className="text-[#3D3128] hover:text-aqua transition-colors text-sm">{value}</a>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-[#E8E0D4]">
              <p className="text-xs text-[#6B5D52] leading-relaxed">
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
            <h3 className="text-lg font-black text-[#1A1410] mb-1">Send Message</h3>
            <p className="text-[#6B5D52] text-sm mb-6">We'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B5D52] mb-1.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-3 py-2.5 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B5D52] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="rahul@school.in"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-3 py-2.5 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B5D52] mb-1.5">Institution / School Name</label>
                <input
                  type="text"
                  placeholder="St. Mary's High School"
                  value={form.institution}
                  onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
                  className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-3 py-2.5 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B5D52] mb-1.5">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your school and what you need..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full bg-[#F0E8DC] border border-[#E8E0D4] rounded-xl px-3 py-2.5 text-[#1A1410] text-sm placeholder:text-[#6B5D52] focus:outline-none focus:border-aqua/40 transition-colors resize-none"
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
                className="w-full gradient-bg text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
    color: '#8B4513', bg: 'rgba(139, 69, 19,0.10)', border: 'rgba(139, 69, 19,0.22)',
    slug: 'security',
  },
  {
    icon: Server,
    title: 'Scalable',
    desc: 'Handles 100 to 10,000+ students with zero performance degradation. Grows with your institution seamlessly.',
    color: '#7C3D0F', bg: 'rgba(124, 61, 15,0.10)', border: 'rgba(124, 61, 15,0.22)',
    slug: 'student-management',
  },
  {
    icon: Cloud,
    title: 'Cloud Based',
    desc: 'Hosted on Google Cloud with 99.9% uptime target. Access your ERP from any device, anywhere, anytime.',
    color: '#166534', bg: 'rgba(22, 101, 52,0.10)', border: 'rgba(22, 101, 52,0.22)',
    slug: 'cloud-based',
  },
  {
    icon: Sparkles,
    title: 'AI Powered',
    desc: 'Gemini AI generates performance reports, predicts dropout risks, and automates routine administrative tasks.',
    color: '#8B4513', bg: 'rgba(139, 69, 19,0.10)', border: 'rgba(139, 69, 19,0.22)',
    slug: 'ai-analytics',
  },
  {
    icon: TrendingUp,
    title: 'Affordable',
    desc: 'Transparent pricing designed for Indian schools. No hidden costs, no per-module charges — one plan, all features.',
    color: '#166534', bg: 'rgba(22, 101, 52,0.10)', border: 'rgba(22, 101, 52,0.22)',
    slug: 'fees',
  },
  {
    icon: GraduationCap,
    title: 'Built For Indian Schools',
    desc: 'Hindi + English bilingual, Razorpay UPI payments, CBSE/ICSE formats — built ground-up for India\'s classrooms.',
    color: '#7C3D0F', bg: 'rgba(124, 61, 15,0.10)', border: 'rgba(124, 61, 15,0.22)',
    slug: 'one-platform',
  },
]

function WhyRevenexSection({ language }: { language: string }) {
  return (
    <section className="py-20 lg:py-28 relative border-t border-[#E8E0D4]">
      <div className="absolute inset-0 section-glow-right pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SectionBadge label="Why REVENEX" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">
            {language === 'en' ? (
              <>Why Schools Choose <span className="gradient-text">REVENEX</span></>
            ) : (
              <>स्कूल <span className="gradient-text">REVENEX</span> क्यों चुनते हैं</>
            )}
          </h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">
            {language === 'en'
              ? "We didn't just build a school app. We built a complete operations platform."
              : 'हमने सिर्फ एक ऐप नहीं बनाया। हमने एक पूरा ऑपरेशन प्लेटफॉर्म बनाया।'}
          </p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[whyReasons[0], whyReasons[1], whyReasons[2]].map((reason, i) => (
            <BentoCard
              key={reason.slug}
              icon={reason.icon}
              title={reason.title}
              desc={reason.desc}
              wide={reason.slug === 'security'}
              index={i}
            />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-3 mt-5">
          {[whyReasons[3], whyReasons[4], whyReasons[5]].map((reason, i) => (
            <BentoCard
              key={reason.slug}
              icon={reason.icon}
              title={reason.title}
              desc={reason.desc}
              wide={reason.slug === 'one-platform'}
              index={i + 3}
              onLearnMore={reason.slug === 'one-platform' ? () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) : undefined}
            />
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
      color: '#8B4513',
      cardBg: 'linear-gradient(160deg, #FDF8F3, #F0E8DC)',
      band: 'linear-gradient(90deg, #8B4513, #C4722A)',
      badgeBg: '#8B4513',
      number: '01',
      entrance: { initial: { opacity: 0, x: -80, rotate: -3 }, animate: { opacity: 1, x: 0, rotate: 0 }, transition: { duration: 0.6 } },
    },
    {
      name: 'Rohan Rajendra Raundal',
      role: 'Co-Founder',
      img: rohanNewImg,
      desc: 'Leads technology, product development, and innovation to build reliable and scalable digital products.',
      linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
      color: '#1A1410',
      cardBg: 'linear-gradient(160deg, #F7F2EA, #EDE4D6)',
      band: 'linear-gradient(90deg, #1A1410, #3D2810)',
      badgeBg: '#1A1410',
      number: '02',
      entrance: { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.15 } },
    },
    {
      name: 'Prasanna Mate',
      role: 'CTO',
      img: prasannaImg,
      desc: 'Built REVENEX from scratch. Leads platform engineering to ensure reliability, performance, and smooth deployments.',
      linkedin: 'https://www.linkedin.com/in/prasanna-mate-a247b5328/',
      color: '#8B4513',
      cardBg: 'linear-gradient(160deg, #FDF8F3, #F0E8DC)',
      band: 'linear-gradient(90deg, #8B4513, #C4722A)',
      badgeBg: '#8B4513',
      number: '03',
      entrance: { initial: { opacity: 0, x: 80, rotate: 3 }, animate: { opacity: 1, x: 0, rotate: 0 }, transition: { duration: 0.6, delay: 0.1 } },
    },
  ]

  return (
    <section className="py-20 lg:py-28 relative border-t border-[#E8E0D4]">
      <div className="absolute inset-0 section-glow-left pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionBadge label="Leadership" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-3">Meet the Team</h2>
          <p className="text-[#6B5D52]">The team building India's school ERP of tomorrow.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {homeFounders.map((f) => (
            <motion.div
              key={f.name}
              initial={f.entrance.initial}
              whileInView={f.entrance.animate}
              viewport={{ once: true }}
              transition={f.entrance.transition}
              whileHover={{ scale: 1.03, y: -8, borderColor: '#C4A882', boxShadow: '0 24px 60px rgba(139,69,19,0.16)' }}
              className="relative rounded-3xl overflow-hidden group text-center p-8 flex flex-col items-center"
              style={{
                background: f.cardBg,
                border: '1px solid #E0D4C0',
                boxShadow: '0 4px 24px rgba(139,69,19,0.08)',
                minHeight: '480px',
                transition: 'box-shadow 0.2s, border-color 0.2s',
              }}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: f.band }}
                whileHover={{ filter: 'brightness(1.15)' }}
              />

              <div className="relative inline-block mb-5 mt-2">
                <div className="rounded-2xl p-1" style={{ border: '2px solid #D4C4B0' }}>
                  <div className="rounded-2xl p-1" style={{ border: '2px solid #E0D4C0' }}>
                    <motion.img
                      src={f.img}
                      alt={f.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-28 h-28 rounded-xl object-cover object-top mx-auto"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#1A1410] mt-1 mb-1">{f.name}</h3>
              <span
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-white mb-4"
                style={{ background: f.badgeBg }}
              >
                {f.role}
              </span>
              <p className="text-[#3D3128] text-sm leading-relaxed mt-4 mb-6">{f.desc}</p>

              <motion.a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, backgroundColor: '#1A1410', color: '#FFFFFF' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold text-sm mt-auto"
                style={{ background: 'transparent', border: '1.5px solid #1A1410', color: '#1A1410' }}
              >
                <Linkedin className="h-4 w-4" /> LinkedIn Profile
              </motion.a>

              <span className="absolute bottom-6 right-6 text-6xl font-black opacity-40 pointer-events-none select-none" style={{ color: '#E0D4C0' }}>
                {f.number}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Bento feature card (shared by Features + Why Revenex) ─── */
function BentoCard({
  icon: Icon, title, desc, wide, index, pills, onLearnMore, learnMoreLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  wide?: boolean
  index: number
  pills?: string[]
  onLearnMore?: () => void
  learnMoreLabel?: string
}) {
  const fromLeft = index % 2 === 0
  const cardBg = wide
    ? 'linear-gradient(135deg, #FDF8F3, #F0E8DC)'
    : index % 2 === 0
      ? '#FDF8F3'
      : '#F7F2EA'
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -80 : 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -6, borderColor: '#C4A882' }}
      className={`group relative rounded-3xl border border-[#EDE8E3] p-8 overflow-hidden ${wide ? 'sm:col-span-2 min-h-[180px] flex flex-col sm:flex-row items-center gap-8' : 'min-h-[220px]'
        }`}
      style={{ transition: 'box-shadow 0.2s', background: cardBg }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, #8B4513, #C4722A, #8B4513)' }}
      />
      <div className={wide ? 'flex-1' : ''}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300"
          style={{ background: 'linear-gradient(135deg, #F0E8DC, #E8DDD0)' }}
        >
          <Icon className="h-6 w-6 text-[#8B4513]" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1410] mb-2">{title}</h3>
        <p className="text-[#3D3128] text-sm leading-relaxed">{desc}</p>
      </div>

      {wide && pills && (
        <div className="flex flex-wrap gap-2 sm:justify-end sm:shrink-0">
          {pills.map((pill) => (
            <span key={pill} className="bg-[#F0E8DC] text-[#8B4513] rounded-full px-4 py-2 text-sm font-medium">
              {pill}
            </span>
          ))}
        </div>
      )}

      {wide && onLearnMore && (
        <motion.button
          onClick={onLearnMore}
          whileHover={{ x: 4, backgroundColor: '#8B4513' }}
          className="bg-[#1A1410] text-white rounded-full px-6 py-3 font-semibold text-sm shrink-0 whitespace-nowrap"
        >
          {learnMoreLabel || 'Learn More →'}
        </motion.button>
      )}

      <Icon className="absolute bottom-3 right-3 h-20 w-20 text-[#F0E8DC] opacity-20 pointer-events-none" />
    </motion.div>
  )
}

/* ─── Features section ─── */
function FeaturesSection({ t }: { t: (key: string) => string }) {
  const wideSlugs = ['student-management', 'security']
  const studentPills = ['2,847+ Students', 'Admission to Alumni', 'Bulk Import Ready']
  const securityPills = ['256-bit Encryption', 'Role-Based Access', 'GDPR Compliant']

  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 section-glow-left pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <SectionBadge label="Features" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">{t('features.title')}</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[features[0], features[1], features[2], features[3], features[4], features[7]].map((feature, i) => {
            const isWide = wideSlugs.includes(feature.slug)
            return (
              <BentoCard
                key={feature.slug}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                wide={isWide}
                index={i}
                pills={feature.slug === 'student-management' ? studentPills : feature.slug === 'security' ? securityPills : undefined}
              />
            )
          })}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 mt-5">
          {[features[5], features[6]].map((feature, i) => (
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
                    style={{ background: `linear-gradient(135deg, rgba(139, 69, 19,0.06) 0%, transparent 100%)` }}
                  />
                  <div className="relative z-10">
                    <div className={`inline-flex rounded-2xl p-3 mb-4 ${feature.bg}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-base font-bold text-[#1A1410] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#6B5D52] leading-relaxed mb-4">{feature.desc}</p>
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

/* ─── Problem section (dramatic Before / With Revenex redesign) ─── */
const problemBefore = [
  { icon: FileBarChart, text: 'Attendance tracked on paper, fees collected in cash registers' },
  { icon: Smartphone, text: "Parents left in the dark about their child's progress" },
  { icon: CreditCard, text: 'Staff payroll and reports done manually every month' },
  { icon: Cloud, text: 'Data scattered across spreadsheets and WhatsApp groups' },
]
const problemAfter = [
  { icon: Zap, text: 'Attendance and fees automated, tracked in real time' },
  { icon: Smartphone, text: 'Parents get live updates through their own dashboard' },
  { icon: TrendingUp, text: 'Payroll and reports generated automatically, every time' },
  { icon: Lock, text: 'All your data in one secure, searchable place' },
]

function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 relative border-t border-[#E8E0D4] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[9rem] sm:text-[13rem] lg:text-[17rem] font-black text-[#1A1410]/[0.03] leading-none whitespace-nowrap tracking-tighter">
          PROBLEM
        </span>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge label="The Problem" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Running an institution shouldn't feel this hard</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Most schools juggle spreadsheets, paper registers, and disconnected apps. REVENEX brings it all together.</p>
        </motion.div>

        <div className="relative grid md:grid-cols-2 gap-8 md:gap-0 items-center max-w-5xl mx-auto">
          {/* Before card — dark, dramatic */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: -1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-0 rounded-3xl p-8 md:p-10 md:-mr-6 md:scale-[0.94]"
            style={{ background: 'linear-gradient(155deg, #2A1210 0%, #1A0D0C 100%)', boxShadow: '0 25px 50px -12px rgba(80,10,10,0.35)' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-widest mb-7 border border-red-500/25">
              Before REVENEX
            </div>
            <ul className="space-y-5">
              {problemBefore.map((item, i) => (
                <li key={item.text} className="flex items-start gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-[11px] font-black">
                    {i + 1}
                  </span>
                  <div className="flex items-start gap-2.5 flex-1">
                    <item.icon className="h-4 w-4 text-red-400/60 mt-0.5 shrink-0" />
                    <p className="text-white/65 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Center animated arrow divider */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-xl border-4 border-[#F5F0E8]"
            >
              <ArrowRight className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="flex md:hidden justify-center -my-2 relative z-20">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-xl border-4 border-[#F5F0E8] rotate-90"
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </motion.div>
          </div>

          {/* After card — elevated brown/beige, "With Revenex" */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: 1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10 rounded-3xl p-8 md:p-11 md:-ml-6"
            style={{ background: 'linear-gradient(150deg, #F3EADA 0%, #E7D9BE 100%)', boxShadow: '0 35px 70px -15px rgba(124,61,15,0.28), 0 0 0 1px rgba(124,61,15,0.1)' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3D0F] text-white text-xs font-bold uppercase tracking-widest mb-7 shadow-md">
              With REVENEX
            </div>
            <ul className="space-y-5">
              {problemAfter.map((item, i) => (
                <li key={item.text} className="flex items-start gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#7C3D0F] flex items-center justify-center text-white text-[11px] font-black">
                    {i + 1}
                  </span>
                  <div className="flex items-start gap-2.5 flex-1">
                    <item.icon className="h-4 w-4 text-[#7C3D0F] mt-0.5 shrink-0" />
                    <p className="text-[#1A1410] text-sm font-medium leading-relaxed">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Products section (School ERP) ─── */
function ProductsSection() {
  const schoolProduct = {
    label: 'School ERP',
    blurb: 'Everything a K-12 or higher-ed institution needs to run smoothly — from admissions to alumni.',
    cards: [
      {
        title: 'Principal Dashboard', desc: 'School-wide analytics, staff oversight, and approvals in one view.', icon: LayoutDashboard, color: '#7C3D0F',
        features: ['Real-time school analytics', 'Staff performance tracking', 'Fee collection overview', 'Multi-branch management', 'Approval workflows', 'Custom report exports'],
        slug: 'ai-analytics',
      },
      {
        title: 'Teacher Dashboard', desc: 'Attendance, grading, and lesson planning without the paperwork.', icon: BookOpen, color: '#8B4513',
        features: ['One-tap attendance', 'Digital gradebook', 'Lesson plan library', 'Parent messaging', 'Homework tracking', 'Exam scheduling'],
        slug: 'exam-results',
      },
      {
        title: 'Parent Dashboard', desc: 'Live updates on attendance, fees, and academic progress.', icon: Users, color: '#166534',
        features: ['Live attendance alerts', 'Online fee payments', 'Report card access', 'Direct teacher chat', 'Event calendar', 'Bus tracking'],
        slug: 'parent-communication',
      },
    ],
  } as const

  return (
    <section id="products" className="py-20 lg:py-28 relative border-t border-[#E8E0D4] scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <SectionBadge label="Products" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Empower Your Institution</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Purpose-built software to digitize and automate all aspects of school operations.</p>
        </motion.div>

        <p className="text-center text-[#6B5D52] max-w-xl mx-auto mb-12">
          {schoolProduct.blurb}
        </p>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-6 sm:grid-cols-3">
          {schoolProduct.cards.map((card, i) => {
            const entrance = i === 0
              ? { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.65 } }
              : i === 1
                ? { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.15 } }
                : { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.65, delay: 0.1 } }
            return (
              <motion.div
                key={card.title}
                initial={entrance.initial}
                whileInView={entrance.animate}
                viewport={{ once: true }}
                transition={entrance.transition}
                whileHover={{ y: -8 }}
                className="group relative rounded-3xl overflow-hidden min-h-[520px]"
                style={{
                  boxShadow: '0 4px 20px rgba(139,69,19,0.06)',
                  background: i === 0
                    ? 'linear-gradient(160deg, #FDF8F3, #F5EDE0)'
                    : i === 1
                      ? 'linear-gradient(160deg, #F7F2EA, #EDE4D6)'
                      : 'linear-gradient(160deg, #FDF8F3, #F5EDE0)',
                }}
              >
                <motion.div
                  className="h-2 w-full"
                  style={{ background: 'linear-gradient(90deg, #8B4513, #C4722A, #8B4513)', backgroundSize: '200% 100%' }}
                  animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative p-8">
                  <span className="absolute top-6 right-6 text-5xl font-black text-[#F0E8DC] opacity-50 pointer-events-none select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                    className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1A1410, #3D2810)', boxShadow: '0 8px 32px rgba(26,20,16,0.25)' }}
                  >
                    <card.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#1A1410] mb-2">{card.title}</h3>
                  <p className="text-[#6B5D52] text-sm leading-relaxed mb-6">{card.desc}</p>
                  <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, #E8E0D4, transparent)' }} />
                  <ul className="mb-6">
                    {card.features.map((f) => (
                      <li key={f} className="group/item flex items-start gap-3 py-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513] mt-2 shrink-0 transition-all duration-200 group-hover/item:w-3 group-hover/item:h-3" />
                        <span className="text-[#3D3128] text-sm font-medium transition-all duration-200 group-hover/item:translate-x-1.5 group-hover/item:text-[#8B4513]">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#F0E8DC] text-[#8B4513] rounded-full px-4 py-2 text-xs font-bold uppercase">
                      School ERP
                    </span>
                    <Link href={`/features/${card.slug}`}>
                      <span className="text-[#8B4513] font-bold text-sm hover:translate-x-1.5 inline-block transition-transform">
                        Explore →
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Pricing section (luxury upgrade) ─── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [trigger, target, duration])
  return count
}

function PricingSection() {
  const starter = {
    name: 'Starter',
    price: '₹0',
    period: '/forever',
    desc: 'For schools just getting started with digital management.',
    features: [
      'Up to 500 students/records',
      'Principal, Teacher & Parent dashboards',
      'Digital attendance management',
      'Fee tracking & payment reminders',
      'Student result upload & report cards',
      'Basic analytics & reporting dashboard',
      'WhatsApp & SMS notifications',
      'Free onboarding & setup support',
    ],
    cta: 'Get Started Free',
  }
  const growth = {
    name: 'Growth',
    period: '/year',
    desc: 'For institutions ready to scale with automation and priority support.',
    features: [
      'Everything in Starter',
      'Unlimited students & records',
      'Advanced analytics & custom reports',
      'AI-powered fee reminder engine',
      'Multi-teacher & multi-class management',
      'Staff payroll management system',
      'Parent mobile app full access',
      'Priority support & dedicated manager',
      'Data export & migration support',
      'Custom branding & white-label option',
    ],
    cta: 'Schedule a Demo',
  }

  const growthRef = useRef(null)
  const growthInView = useInView(growthRef, { once: true, margin: '-100px' })
  const growthPrice = useCountUp(20000, 1500, growthInView)

  return (
    <section id="pricing" className="py-20 lg:py-28 relative border-t border-[#E8E0D4] scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <SectionBadge label="Pricing" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Simple, transparent pricing</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Start free. Upgrade when you're ready to grow.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {/* Starter — flat, minimal white luxury card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-10 bg-white min-h-[680px] flex flex-col"
            style={{ border: '1.5px solid #E8E0D4', boxShadow: '0 8px 40px rgba(139,69,19,0.08)' }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#6B5D52] font-medium">Starter</span>
            <p className="text-[#6B5D52] text-sm mt-1 mb-6">{starter.desc}</p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-[#1A1410] self-start mt-2">₹</span>
              <span className="text-8xl font-black text-[#1A1410] leading-none">0</span>
              <span className="text-[#6B5D52] text-lg self-end mb-3">/forever</span>
            </div>
            <span className="inline-block bg-[#F0E8DC] text-[#8B4513] rounded-full text-xs px-4 py-2 font-medium mt-3 w-fit">
              Free for schools under 500 students
            </span>
            <div className="h-px my-8" style={{ background: 'linear-gradient(90deg, transparent, #E8E0D4, transparent)' }} />
            <ul className="space-y-1 mb-8 flex-1">
              {starter.features.map((f, idx) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex items-center gap-3 py-1.5 transition-transform duration-200 hover:translate-x-1"
                >
                  <span className="w-5 h-5 rounded-full bg-[#F0E8DC] flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-[#8B4513]">
                    <CheckCircle2 className="h-3 w-3 text-[#8B4513] group-hover:text-white transition-colors duration-200" />
                  </span>
                  <span className="text-[#3D3128] text-sm">{f}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold cursor-pointer border-2 border-[#1A1410] text-[#1A1410] hover:bg-[#1A1410] hover:text-white hover:shadow-lg transition-all"
              >
                {starter.cta} <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>

          {/* Growth — elevated dark gradient, breathing glow, most popular */}
          <motion.div
            ref={growthRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: -20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 40px rgba(139,69,19,0.2), 0 32px 80px rgba(26,20,16,0.4)',
                  '0 0 80px rgba(139,69,19,0.4), 0 32px 80px rgba(26,20,16,0.4)',
                  '0 0 40px rgba(139,69,19,0.2), 0 32px 80px rgba(26,20,16,0.4)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-3xl p-10 min-h-[720px] flex flex-col overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #1A1410 0%, #2D1F14 60%, #1A1410 100%)' }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute -top-16 -right-16 w-64 h-64 rounded-full"
                  style={{ background: 'rgba(139,69,19,0.08)' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full"
                  style={{ background: 'rgba(196,114,42,0.06)' }}
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
              </div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-[0.15em] whitespace-nowrap"
                style={{ background: 'linear-gradient(90deg, #8B4513, #C4722A)', boxShadow: '0 4px 20px rgba(139,69,19,0.5)' }}
              >
                Most Popular
              </motion.div>

              <span className="relative text-xs uppercase tracking-[0.25em] text-white/45 font-medium">Growth</span>
              <p className="relative text-white/60 text-sm mt-1 mb-6">{growth.desc}</p>
              <div className="relative flex items-end gap-1">
                <span className="text-3xl font-black text-white self-start mt-2">₹</span>
                <span className="text-7xl font-black text-white leading-none">{growthPrice.toLocaleString('en-IN')}</span>
                <span className="text-white/60 text-lg self-end mb-3">{growth.period}</span>
              </div>
              <p className="relative text-sm text-white/40 mt-1">₹1,667/month billed annually</p>

              <div className="relative h-px my-8" style={{ background: 'rgba(255,255,255,0.1)' }} />

              <ul className="relative space-y-1 mb-8 flex-1">
                {growth.features.map((f) => (
                  <li key={f} className="group flex items-center gap-3 py-1.5 transition-transform duration-200 hover:translate-x-1">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-[#8B4513]" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <CheckCircle2 className="h-3 w-3 text-[#C4722A] group-hover:text-white transition-colors duration-200" />
                    </span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/book-demo">
                <motion.span
                  whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold cursor-pointer text-white"
                  style={{ background: 'linear-gradient(90deg, #8B4513, #C4722A)', boxShadow: '0 8px 32px rgba(139,69,19,0.45)' }}
                >
                  {growth.cta} <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
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
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3D0F]/6 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#8B4513]/6 rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(139, 69, 19,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#8B4513]/20 bg-[#8B4513]/5 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B4513] animate-pulse" />
                  <span className="text-xs font-semibold text-[#7C3D0F] tracking-widest uppercase">{t('hero.badge')}</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.2rem] mb-6 leading-[1.05]"
              >
                <span className="text-[#1A1410]">{t('hero.title')}</span>
                <br />
                <span className="gradient-text">{t('hero.titleHighlight')}</span>
                <br />
                <span className="text-[#1A1410]">{t('hero.titleEnd')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="max-w-xl text-lg text-[#3D3128] leading-relaxed mb-8"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Link href="/book-demo">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 gradient-bg text-white font-bold px-8 py-4 rounded-2xl text-base transition-all cursor-pointer shadow-lg"
                  >
                    {t('hero.cta.demo')} <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 border border-[#1A1410]/20 text-[#1A1410] font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:bg-[#F0E8DC] cursor-pointer"
                  >
                    {language === 'en' ? 'Sign In' : 'साइन इन करें'} <ArrowRight className="h-5 w-5 opacity-60" />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-3 flex-wrap"
              >
                {['Enterprise Security', '99.9% Uptime Target', 'Indian EdTech'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-[#6B5D52] px-3 py-1.5 rounded-full border border-[#E8E0D4] bg-white">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#7C3D0F]" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: 30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="glass-card rounded-3xl overflow-hidden border border-[#E8E0D4]" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6), 0 0 100px rgba(139, 69, 19,0.04)' }}>
                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E8E0D4] bg-[#F0E8DC]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="ml-4 flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-[#F0E8DC] rounded-lg px-4 py-1.5 max-w-xs w-full">
                      <Lock className="h-3 w-3 text-[#8B4513]" />
                      <span className="text-xs text-[#6B5D52]">app.revenex.in/dashboard</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B4513] animate-pulse" />
                    <span className="text-xs text-[#8B4513] font-medium">Preview</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Total Students', value: '2,847', icon: Users, color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]' },
                      { label: 'Attendance Today', value: '94.2%', icon: CheckCircle2, color: 'text-green-700', bg: 'bg-green-700/10' },
                      { label: 'Fees Collected', value: '₹12.4L', icon: CreditCard, color: 'text-amber-700', bg: 'bg-amber-700/10' },
                      { label: 'Staff Active', value: '142', icon: Award, color: 'text-[#8B4513]', bg: 'bg-[#F0E8DC]' },
                    ].map((kpi, i) => (
                      <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.08 }} className={`${kpi.bg} rounded-xl p-3 border border-[#E8E0D4]`}>
                        <kpi.icon className={`h-4 w-4 ${kpi.color} mb-2`} />
                        <div className={`text-xl font-black ${kpi.color} mb-0.5`}>{kpi.value}</div>
                        <div className="text-xs text-[#6B5D52]">{kpi.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-[#F0E8DC] rounded-xl p-4 border border-[#E8E0D4] mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-semibold text-[#3D3128]">Attendance Trend</div>
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-[#7C3D0F]" />
                        <span className="text-xs text-[#7C3D0F] font-semibold">94.2%</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                      {barHeights.map((h, i) => (
                        <motion.div key={`bar-${i}`} className="flex-1 rounded-t-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 1.0 + i * 0.04, ease: 'easeOut' }} style={{ background: i >= 9 ? 'linear-gradient(to top, #7C3D0F, #8B4513)' : 'rgba(139,69,19,0.12)' }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#F0E8DC] rounded-xl p-3 border border-[#E8E0D4]">
                    <div className="text-xs font-semibold text-[#3D3128] mb-3 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#7C3D0F]" /> AI Activity
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { text: 'Fee reminder sent', color: 'bg-amber-600' },
                        { text: 'Report generated', color: 'bg-[#7C3D0F]' },
                        { text: 'Payroll processed', color: 'bg-green-700' },
                      ].map((item) => (
                        <div key={item.text} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                          <p className="text-[10px] text-[#6B5D52]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TECH PARTNERS (white pill badges) ── */}
      <section className="py-10 border-y border-[#E8E0D4] overflow-hidden bg-[#EDE8DC]">
        <div className="mx-auto max-w-7xl px-4 mb-5">
          <p className="text-center text-[11px] font-black text-[#6B5D52] uppercase tracking-widest">
            Trusted Partners Powering the REVENEX Platform
          </p>
        </div>
        <PartnersMarquee />
      </section>

      {/* ── PROBLEM (Before/After) ── */}
      <ProblemSection />

      <SectionDivider />

      {/* ── FEATURES ── */}
      <FeaturesSection t={t} />

      <SectionDivider />

      {/* ── WHY REVENEX ── */}
      <WhyRevenexSection language={language} />

      <SectionDivider />

      {/* ── PRODUCTS ── */}
      <ProductsSection />

      <SectionDivider />

      {/* ── HOW IT WORKS (vertical animated timeline) ── */}
      <HowItWorksSection language={language} />

      <SectionDivider />

      {/* ── REVIEWS / TESTIMONIALS ── */}
      <ReviewsSection />

      <SectionDivider />

      {/* ── LET'S TALK / CONTACT ── */}
      <LetsTalkSection language={language} />

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden border-t border-[#E8E0D4]">
        <div className="absolute inset-0 hero-glow opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-6">{t('cta.title')}</h2>
            <p className="text-[#3D3128] mb-8 text-lg">{t('cta.subtitle')}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/book-demo">
                <motion.span whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 gradient-bg text-white font-bold px-8 py-4 rounded-2xl cursor-pointer">
                  {t('cta.demo')} <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 border border-[#E8E0D4] text-[#1A1410] font-semibold px-8 py-4 rounded-2xl hover:bg-[#F0E8DC] cursor-pointer">
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
