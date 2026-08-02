import { useRef, useState, useEffect, useCallback, useLayoutEffect, Suspense, type CSSProperties } from 'react'
import { Link } from 'wouter'
import { useQueryClient } from '@tanstack/react-query'
import { motion, useScroll, useSpring, useInView, useTransform, AnimatePresence, type MotionValue } from 'framer-motion'
import {
  ArrowRight, Users, BookOpen, CreditCard, Bell, Calendar,
  BarChart3, Shield, Cpu, CheckCircle2, Zap, Cloud, Sparkles,
  GraduationCap, TrendingUp, Lock, Activity, Server,
  MessageSquare, Star, Send, Globe2, Linkedin,
  Mail, Phone, MapPin, Building2, FileBarChart, Smartphone,
  LayoutDashboard, Settings2, UserPlus, CalendarCheck,
  IndianRupee, MessageCircle, BookMarked, Bus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
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
  { icon: Users, title: 'Student Management', desc: 'From admissions and enrollment to attendance records and report cards — manage every student\'s journey in one centralized dashboard.', color: 'text-[#8B4513]', bg: 'bg-[#F0E8DC]', slug: 'student-management', background: '/charachters/StudentManagementBack.png', character: '/charachters/StudentManagementChar.png' },
  { icon: Calendar, title: 'Attendance Tracking', desc: 'Mark attendance in seconds with biometric, QR, or face-recognition support. Parents receive instant SMS and app alerts for daily check-ins.', color: 'text-green-700', bg: 'bg-green-700/10', slug: 'attendance', background: '/charachters/AttendanceTrackBack.png', character: '/charachters/AttendanceTrackChar.png' },
  { icon: CreditCard, title: 'Fee Management', desc: 'Automate fee collection with Razorpay-powered online payments, generate digital receipts, and track pending dues with real-time financial dashboards.', color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]', slug: 'fees', background: '/charachters/feeBack.png', character: '/charachters/feeChar.png' },
  { icon: Bell, title: 'Parent Communication', desc: 'Keep parents engaged with real-time SMS, WhatsApp, and in-app notifications for attendance, exams, events, and school announcements.', color: 'text-[#8B4513]', bg: 'bg-[#F0E8DC]', slug: 'parent-communication', background: '/charachters/ParentBack.png', character: '/charachters/ParentChar.png' },
  { icon: BookOpen, title: 'Exam & Results', desc: 'Create and manage exams, auto-calculate grades, and publish digital report cards that parents and students can access instantly.', color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]', slug: 'exam-results', background: '/charachters/ResultBack.png', character: '/charachters/ResultChar.png' },
  { icon: Users, title: 'Staff Management', desc: 'Handle payroll processing, leave management, performance reviews, and staff scheduling — all from a single administrative panel.', color: 'text-[#7C3D0F]', bg: 'bg-[#F0E8DC]', slug: 'staff-management', background: '/charachters/staffBack.png', character: '/charachters/StaffChar.png' },
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
            className="flex items-center justify-center gap-3 shrink-0 w-48 h-14 px-6 rounded-2xl bg-white border border-[#E8E0D4] hover:shadow-lg transition-all"
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
      animate={iconEntrance.animate}
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
          animate={{ scale: 1 }}
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
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{ background: '#8B4513', border: '3px solid #F5F0E8', boxShadow: '0 0 0 3px rgba(139,69,19,0.2)' }}
        />
      )}
    </motion.div>
  )

  const contentBlock = (
    <motion.div
      initial={contentEntrance.initial}
      animate={contentEntrance.animate}
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
          animate={{ opacity: 1, y: 0 }}
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
  const { data: reviewsData, isLoading } = useListReviews()
  const reviews = Array.isArray(reviewsData) ? reviewsData : []
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
          animate={{ opacity: 1, y: 0 }}
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
            animate={{ opacity: 1 }}
            className="text-center py-12 mb-12"
          >
            <Star className="h-10 w-10 text-[#8B4513]/30 mx-auto mb-3" />
            <p className="text-[#6B5D52] font-medium">No reviews yet — be the first to share your experience!</p>
          </motion.div>
        )}

        {/* Leave a review form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            animate={{ opacity: 1, x: 0 }}
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
            animate={{ opacity: 1, x: 0 }}
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

/* ─── Why Choose Card (3D Flip, 2-column equal layout) ─── */
function WhyChooseCard({
  icon: Icon,
  title,
  desc,
  index,
  slug,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  index: number
  slug: string
}) {
  const fromLeft = index % 2 === 0
  
  // Define custom SVGs for the back side of each card
  const renderSVG = () => {
    switch (slug) {
      case 'security':
        return (
          <svg className="w-full h-full text-[#C4A32A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 15C60 15 80 20 80 35C80 60 50 85 50 85C50 85 20 60 20 35C20 20 40 15 50 15Z" className="opacity-30" />
            <path d="M50 25C56 25 70 28 70 38C70 55 50 73 50 73C50 73 30 55 30 38C30 28 44 25 50 25Z" />
            <rect x="42" y="47" width="16" height="12" rx="2" fill="currentColor" />
            <path d="M46 47V42C46 39.8 47.8 38 50 38C52.2 38 54 39.8 54 42V47" strokeWidth="2" />
          </svg>
        )
      case 'student-management':
        return (
          <svg className="w-full h-full text-[#C4A32A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="25" y1="75" x2="25" y2="55" />
            <line x1="45" y1="75" x2="45" y2="40" />
            <line x1="65" y1="75" x2="65" y2="25" />
            <path d="M25 55L45 40L65 25" strokeWidth="3" />
            <path d="M55 25H65V35" strokeWidth="3" />
            <line x1="15" y1="75" x2="85" y2="75" className="opacity-40" />
            <circle cx="25" cy="55" r="3" fill="currentColor" />
            <circle cx="45" cy="40" r="3" fill="currentColor" />
            <circle cx="65" cy="25" r="3" fill="currentColor" />
          </svg>
        )
      case 'cloud-based':
        return (
          <svg className="w-full h-full text-[#C4A32A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M35 60C30 60 25 55 25 50C25 44.5 29.5 40 35 40C36.5 40 38 40.5 39.5 41C42 35 48 31 55 31C63.8 31 71 38.2 71 47C71 48 70.8 49 70.5 50C74.5 51 77 55 77 59.5C77 64.7 72.7 69 67.5 69H35" className="opacity-30" />
            <rect x="35" y="55" width="30" height="10" rx="2" />
            <line x1="40" y1="60" x2="42" y2="60" />
            <line x1="46" y1="60" x2="52" y2="60" />
            <circle cx="58" cy="60" r="1.5" fill="currentColor" />
            <path d="M50 48V42" />
            <path d="M45 45C45 45 47 43 50 43C53 43 55 45 55 45" />
          </svg>
        )
      case 'ai-analytics':
        return (
          <svg className="w-full h-full text-[#C4A32A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <path d="M50 25V35" />
            <path d="M50 65V75" />
            <path d="M25 50H35" />
            <path d="M65 50H75" />
            <path d="M32.3 32.3L39.4 39.4" />
            <path d="M60.6 60.6L67.7 67.7" />
            <path d="M67.7 32.3L60.6 39.4" />
            <path d="M39.4 60.6L32.3 67.7" />
            <circle cx="50" cy="25" r="2.5" fill="currentColor" />
            <circle cx="50" cy="75" r="2.5" fill="currentColor" />
            <circle cx="25" cy="50" r="2.5" fill="currentColor" />
            <circle cx="75" cy="50" r="2.5" fill="currentColor" />
          </svg>
        )
      case 'fees':
        return (
          <svg className="w-full h-full text-[#C4A32A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="50" r="25" />
            <path d="M42 38H58" strokeWidth="3" />
            <path d="M42 45H58" strokeWidth="3" />
            <path d="M47 38V52C47 52 47 59 55 64" strokeWidth="3" />
            <path d="M47 45C54 45 54 52 47 52" strokeWidth="3" />
            <path d="M22 28L26 32" />
            <path d="M78 28L74 32" />
            <path d="M78 72L74 68" />
            <path d="M22 72L26 68" />
          </svg>
        )
      case 'one-platform':
        return (
          <svg className="w-full h-full text-[#C4A32A]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 75H80" strokeWidth="3" />
            <rect x="26" y="45" width="48" height="30" />
            <polygon points="50,22 22,45 78,45" />
            <line x1="36" y1="52" x2="36" y2="75" />
            <line x1="45" y1="52" x2="45" y2="75" />
            <line x1="55" y1="52" x2="55" y2="75" />
            <line x1="64" y1="52" x2="64" y2="75" />
            <polygon points="50,10 65,15 50,20 35,15" fill="currentColor" />
            <path d="M40 17V23C40 23 45 25 50 25C55 25 60 23 60 23V17" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="relative w-full h-[240px] md:h-[220px] rounded-3xl group cursor-pointer flip-card perspective-1000"
    >
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
        className="w-full h-full duration-500 preserve-3d relative flip-card-inner"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl border border-[#EDE8E3] p-8 flex flex-col items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: index % 2 === 0 ? '#FDF8F3' : '#F7F2EA',
          }}
        >
          {/* Top Line accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, #8B4513, #C4722A, #8B4513)' }}
          />

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #F0E8DC, #E8DDD0)' }}
          >
            <Icon className="h-8 w-8 text-[#8B4513]" />
          </div>
          <h3 className="text-2xl font-black text-[#1A1410] tracking-tight">{title}</h3>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-8 flex items-center backface-hidden rotate-y-180"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #251B14, #150F0B)',
          }}
        >
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 items-center w-full h-full">
            {/* Left Column: text description */}
            <div className="flex flex-col justify-center text-left">
              <h4 className="text-base font-black text-[#E5D2BA] tracking-wide uppercase mb-1">{title}</h4>
              <p className="text-[#DFD6C8] text-xs leading-relaxed font-medium mb-3">{desc}</p>
              {slug === 'one-platform' ? (
                <span
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#C4A32A] hover:text-[#E8C23A] font-bold text-xs inline-flex items-center gap-1 transition-colors"
                >
                  Learn More &rarr;
                </span>
              ) : (
                <span className="text-[#C4A32A]/60 font-bold text-[10px] tracking-widest uppercase">
                  REVENEX Verified
                </span>
              )}
            </div>

            {/* Right Column: 2D Model SVG illustration */}
            <div className="w-full h-[120px] flex items-center justify-center p-2 filter drop-shadow-[0_0_8px_rgba(196,163,42,0.3)]">
              {renderSVG()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function WhyRevenexSection({ language }: { language: string }) {
  return (
    <section className="py-20 lg:py-28 relative border-t border-[#E8E0D4]">
      <div className="absolute inset-0 section-glow-right pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* 2-Column Equal Size Grid Layout */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {whyReasons.map((reason, i) => (
            <WhyChooseCard
              key={reason.slug}
              icon={reason.icon}
              title={reason.title}
              desc={reason.desc}
              slug={reason.slug}
              index={i}
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
      role: 'Software Developer',
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
          animate={{ opacity: 1, y: 0 }}
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
              animate={f.entrance.animate}
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
      animate={{ opacity: 1, x: 0 }}
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

function FeatureCard({ title, description, background, character, reverse, characterShiftX = 0, characterScale = 1, descriptionShiftX = 0, aspectRatio = '2 / 1' }: {
  title: string;
  description: string;
  background: string;
  character: string;
  reverse: boolean;
  characterShiftX?: number;
  characterScale?: number;
  descriptionShiftX?: number;
  aspectRatio?: string;
}) {
  const aspect = aspectRatio || '17 / 9'
  const smoothEase: [number, number, number, number] = [0.33, 0, 0.2, 1]
  const dur = 0.7

  return (
    <div className="flex flex-col">
      <motion.div
        className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
        style={{
          perspective: '2000px',
          aspectRatio: aspect,
        }}
        initial="initial"
        whileHover="hover"
        variants={{
          initial: { y: 0, boxShadow: '0 18px 50px -12px rgba(20, 14, 8, 0.35), 0 6px 18px -8px rgba(20, 14, 8, 0.18)' },
          hover: { y: -14, boxShadow: '0 4px 16px -10px rgba(20, 14, 8, 0.08)' },
        }}
        transition={{ duration: 0.7, ease: [0.33, 0, 0.2, 1] }}
      >
        {/* Layer 1 — Background: full canvas, rotates backward, moves down, darkens. No glow, no shadow, no blur. */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          variants={{
            initial: {
              rotateX: 0,
              y: 0,
            },
            hover: {
              rotateX: 72,
              y: 14,
            },
          }}
          transition={{ duration: dur, ease: smoothEase }}
        >
          {/* Full-size background illustration */}
          <img
            src={background}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Dark overlay — darkens the tilted background on hover */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(20, 14, 8, 0.65)' }}
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: dur, ease: smoothEase }}
          />
        </motion.div>

        {/* Layer 2 — Character: same canvas as background, rendered exactly on top, never rotates or darkens */}
        <motion.img
          src={character}
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(20,14,8,0.25))' }}
          variants={{
            initial: { y: 16, scale: characterScale, x: characterShiftX + 24 },
            hover: { y: 6, scale: characterScale * 1.02, x: characterShiftX + 24 },
          }}
          transition={{ duration: dur, ease: smoothEase }}
        />

        {/* Layer 3 — Description: only the description, fixed in front, fades in on hover, opposite the character */}
        <motion.div
          className={`absolute inset-y-0 flex flex-col justify-center z-20 pointer-events-none w-[45%] ${
            reverse ? 'left-0 pl-5 md:pl-8 pr-3' : 'right-0 pr-5 md:pr-8 pl-3'
          }`}
          variants={{
            initial: { opacity: 0, y: 42, x: descriptionShiftX },
            hover: { opacity: 1, y: 0, x: descriptionShiftX },
          }}
          transition={{ duration: dur, ease: smoothEase }}
        >
          <p
            className="text-[#2B2017] text-[15px] md:text-base leading-relaxed"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 2px 10px rgba(255,255,255,0.9)' }}
          >
            {description}
          </p>
        </motion.div>
      </motion.div>

      {/* Title — outside the card, centered below, does not animate with the card */}
      <h3 className="text-center font-bold text-[20px] md:text-[22px] text-[#1A1410] mt-5 md:mt-6 leading-snug">
        {title}
      </h3>
    </div>
  )
}

/* ─── Connected ecosystem background for the Features section ─── */
type EcoNode = { x: number; y: number }

/* Neighbouring modules = connected. Indices match the features array order. */
const featureEdges: Array<[number, number]> = [
  [0, 1], [2, 3], [4, 5],
  [0, 2], [1, 3], [2, 4], [3, 5],
  [1, 2], [3, 4],
]
const edgeBows = [40, -38, 34, 28, -26, 30, -28, 46, -42]
const edgeGrads = ['gold', 'bronze', 'silver', 'gold', 'bronze', 'silver', 'gold', 'bronze', 'silver']
const edgeOpacity = [0.16, 0.13, 0.18, 0.12, 0.15, 0.11, 0.16, 0.14, 0.12]
const edgeDashDur = [6.5, 8.5, 6, 10, 7.5, 9, 6.5, 8, 10.5]
const edgePulseDur = [8.5, 11.5, 7.5, 13, 10, 9.5, 12, 11, 14]
const edgePulseBegin = [0, 3.1, 1.6, 5.8, 2.4, 7.9, 4.2, 5.1, 6.7]

function buildBezier(a: EcoNode, b: EcoNode, bow: number) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len
  const py = dx / len
  const c1 = { x: a.x + dx * 0.28 + px * bow, y: a.y + dy * 0.28 + py * bow }
  const c2 = { x: b.x - dx * 0.28 + px * bow, y: b.y - dy * 0.28 + py * bow }
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

/* Floating micro UI fragments — subtle, drifting, fading */
const microElements = [
  { Icon: Bell, left: '6%', top: '10%', dur: 9, delay: 0, color: '#8B4513' },
  { Icon: MessageSquare, left: '91%', top: '16%', dur: 11, delay: 2.5, color: '#7C3D0F' },
  { Icon: Calendar, left: '12%', top: '42%', dur: 10, delay: 1, color: '#8B4513' },
  { Icon: BarChart3, left: '88%', top: '48%', dur: 12, delay: 4.2, color: '#7C3D0F' },
  { Icon: Sparkles, left: '48%', top: '7%', dur: 8, delay: 3, color: '#C9A96A' },
  { Icon: Cloud, left: '4%', top: '72%', dur: 10, delay: 5.4, color: '#8B4513' },
  { Icon: FileBarChart, left: '94%', top: '76%', dur: 9, delay: 1.8, color: '#7C3D0F' },
  { Icon: Shield, left: '46%', top: '93%', dur: 11, delay: 6.3, color: '#8B4513' },
]

function EcosystemBackground({
  nodes,
  size,
  geometryY,
  networkY,
  microY,
  hovered,
}: {
  nodes: EcoNode[]
  size: { w: number; h: number }
  geometryY: MotionValue<number>
  networkY: MotionValue<number>
  microY: MotionValue<number>
  hovered: number | null
}) {
  const ready = size.w > 0 && nodes.length === 6
  const hoveredEdgeIndices =
    hovered === null
      ? []
      : featureEdges.map((e, i) => (e.includes(hovered) ? i : -1)).filter((i) => i >= 0)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Ambient geometry — slowest parallax layer */}
      <motion.div className="absolute -inset-32" style={{ y: geometryY }}>
        <div className="absolute top-1/2 left-1/2 w-[62rem] h-[62rem]">
          <motion.div
            className="w-full h-full rounded-full border border-[#C9A96A]/[0.09]"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 w-[42rem] h-[42rem]">
          <motion.div
            className="w-full h-full rounded-full border border-dashed border-[#8B4513]/[0.08]"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 96, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 w-[30rem] h-[18rem]">
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              x: '-50%',
              y: '-50%',
              background: 'radial-gradient(ellipse, rgba(139,69,19,0.10), transparent 65%)',
              filter: 'blur(50px)',
            }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 84, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="absolute top-[22%] right-[8%] w-[26rem] h-[26rem]">
          <motion.div
            className="w-full h-full rounded-full border-t-2 border-[#B8B4AC]/[0.10]"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>

      {/* Network layer — one continuous canvas across the whole section */}
      <motion.div className="absolute inset-0" style={{ y: networkY }}>
        {ready && (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${size.w} ${size.h}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="eco-gold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D4B896" />
                <stop offset="50%" stopColor="#C9A96A" />
                <stop offset="100%" stopColor="#D4B896" />
              </linearGradient>
              <linearGradient id="eco-bronze" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B4513" />
                <stop offset="50%" stopColor="#7C3D0F" />
                <stop offset="100%" stopColor="#8B4513" />
              </linearGradient>
              <linearGradient id="eco-silver" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#B8B4AC" />
                <stop offset="50%" stopColor="#D8D4CC" />
                <stop offset="100%" stopColor="#B8B4AC" />
              </linearGradient>
            </defs>

            {featureEdges.map(([a, b], i) => {
              const d = buildBezier(nodes[a], nodes[b], edgeBows[i])
              return (
                <g key={i} opacity={edgeOpacity[i]}>
                  <path d={d} fill="none" stroke={`url(#eco-${edgeGrads[i]})`} strokeWidth={1} strokeLinecap="round" />
                  <path
                    d={d}
                    fill="none"
                    stroke={`url(#eco-${edgeGrads[i]})`}
                    strokeWidth={1.4}
                    strokeDasharray="3 15"
                    strokeLinecap="round"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-36" dur={`${edgeDashDur[i]}s`} repeatCount="indefinite" />
                  </path>
                  <circle r="2.2" fill="#C9A96A">
                    <animateMotion dur={`${edgePulseDur[i]}s`} begin={`${edgePulseBegin[i]}s`} repeatCount="indefinite" path={d} />
                  </circle>
                  <circle r="1.5" fill="#7C3D0F">
                    <animateMotion dur={`${edgePulseDur[i] * 1.45}s`} begin={`${edgePulseBegin[i] + 2.1}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              )
            })}
          </svg>
        )}
      </motion.div>

      {/* Hover ripple — a soft pulse travels only the hovered card's connections */}
      {ready && hovered !== null && (
        <svg
          key={hovered}
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
        >
          {hoveredEdgeIndices.map((idx, i) => {
            const [a, b] = featureEdges[idx]
            const start = a === hovered ? nodes[a] : nodes[b]
            const end = a === hovered ? nodes[b] : nodes[a]
            const d = buildBezier(start, end, edgeBows[idx])
            return (
              <g key={idx} opacity={0.55}>
                <circle r="2.6" fill="#C9A96A">
                  <animateMotion dur={`${1.6 + i * 0.25}s`} begin={`${i * 0.18}s`} repeatCount="1" path={d} />
                </circle>
                <circle r="4.5" fill="rgba(139,69,19,0.35)">
                  <animateMotion dur={`${1.6 + i * 0.25}s`} begin={`${i * 0.18}s`} repeatCount="1" path={d} />
                </circle>
              </g>
            )
          })}
        </svg>
      )}

      {/* Floating micro UI elements — gentle parallax drift */}
      <motion.div className="absolute inset-0" style={{ y: microY }}>
        {microElements.map((el, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: el.left, top: el.top }}
            animate={{ opacity: [0, 0.45, 0], y: [0, -16, 0], scale: [0.85, 1.05, 0.85] }}
            transition={{ duration: el.dur, delay: el.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <el.Icon className="w-4 h-4" style={{ color: el.color }} strokeWidth={1.5} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Features section ─── */
function FeaturesSection({ t }: { t: (key: string) => string }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [nodes, setNodes] = useState<EcoNode[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hovered, setHovered] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const geometryY = useTransform(scrollYProgress, [0, 1], [140, -140])
  const networkY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const microY = useTransform(scrollYProgress, [0, 1], [28, -28])

  useLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      setSize({ w: rect.width, h: rect.height })
      setNodes(
        cardRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 }
          const r = el.getBoundingClientRect()
          return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + r.height / 2 }
        })
      )
    }
    measure()
    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-20 lg:py-32 relative overflow-hidden">
      <EcosystemBackground
        nodes={nodes}
        size={size}
        geometryY={geometryY}
        networkY={networkY}
        microY={microY}
        hovered={hovered}
      />
      <div className="absolute inset-0 section-glow-left pointer-events-none" />
      <div className="absolute inset-0 section-glow-right pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[9rem] sm:text-[13rem] lg:text-[17rem] font-black text-[#1A1410]/[0.03] leading-none whitespace-nowrap tracking-tighter">
          FEATURES
        </span>
      </div>
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <SectionBadge label="Features" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">{t('features.title')}</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-14 md:gap-y-16 lg:gap-y-20">
          {features.map((feature, i) => (
            <div
              key={feature.slug}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              <motion.div
                initial={{ opacity: 0, y: 56, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.14 }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.desc}
                  background={feature.background}
                  character={feature.character}
                  reverse
                  characterShiftX={
                    feature.slug === 'exam-results' ? 72
                    : feature.slug === 'attendance' ? 52
                    : feature.slug === 'parent-communication' ? 40
                    : feature.slug === 'student-management' ? 20
                    : 0
                  }
                  characterScale={feature.slug === 'exam-results' ? 0.85 : 1}
                  descriptionShiftX={feature.slug === 'exam-results' ? -14 : 0}
                  aspectRatio="17 / 9"
                />
              </motion.div>
            </div>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <SectionBadge label="The Problem" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Running an institution shouldn't feel this hard</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Most schools juggle spreadsheets, paper registers, and disconnected apps. REVENEX brings it all together.</p>
        </motion.div>

        <div className="relative grid md:grid-cols-2 gap-8 md:gap-0 items-center max-w-5xl mx-auto">
          {/* Before card — dark, dramatic */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: -1.5 }}
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
            animate={{ opacity: 1, x: 0, rotate: 1.5 }}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <SectionBadge label="Products" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Empower Your Institution</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Purpose-built software to digitize and automate all aspects of school operations.</p>
        </motion.div>

        <p className="text-center text-[#6B5D52] max-w-xl mx-auto mb-12">
          {schoolProduct.blurb}
        </p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 sm:grid-cols-3">
          {schoolProduct.cards.map((card, i) => {
            const entrance = i === 0
              ? { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.65 } }
              : i === 1
                ? { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.15 } }
                : { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.65, delay: 0.1 } }
            return (
              <motion.div
                key={card.title}
                id={card.title.toLowerCase().replace(/\s+/g, '-')}
                initial={entrance.initial}
                animate={entrance.animate}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <SectionBadge label="Pricing" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Simple, transparent pricing</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Start free. Upgrade when you're ready to grow.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {/* Starter — flat, minimal white luxury card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
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
                  animate={{ opacity: 1, y: 0 }}
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
            animate={{ opacity: 1, y: -20 }}
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

/* ─── 3D Student model ─── */
function StudentModel() {
  const { scene } = useGLTF('/student.glb')
  const baseColor = useLoader(THREE.TextureLoader, '/student-basecolor.png')
  const ref = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    baseColor.colorSpace = THREE.SRGBColorSpace
    baseColor.flipY = true
    scene.traverse((obj) => {
      const mesh = obj as any;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.map = baseColor
        mat.metalness = 0.1
        mat.metalnessMap = null
        mat.needsUpdate = true
      }
    })
  }, [scene, baseColor])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={3.55}
      position={[0, -2.1, 0]}
    />
  )
}

function StudentCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.0, 5.1], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[3, 5, 3]} intensity={3.0} />
      <directionalLight position={[-3, 2, -3]} intensity={1.5} color="#C4A32A" />
      <pointLight position={[0, 3, 3]} intensity={1.4} color="#FFF8F0" />
      <pointLight position={[2, 1, 2]} intensity={0.8} color="#C4A32A" />
      <Suspense fallback={null}>
        <StudentModel />
        <ContactShadows
          position={[0, -1.0, 0]}
          opacity={0.12}
          scale={3}
          blur={2.5}
          color="#8B4513"
        />
      </Suspense>
    </Canvas>
  )
}

/* ─── Orbital 3D hero visual ─── */
function OrbitalHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePos({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const badges: Array<{
    label: string
    Icon: LucideIcon
    style: CSSProperties
    dur: number
    delay: number
  }> = [
    { label: 'Library', Icon: BookOpen, style: { top: '-2%', right: '-8%' }, dur: 4, delay: 0 },
    { label: 'Admissions', Icon: UserPlus, style: { top: '18%', left: '-15%' }, dur: 3.8, delay: 0.6 },
    { label: 'Attendance', Icon: CalendarCheck, style: { top: '18%', right: '-15%' }, dur: 4.5, delay: 1.2 },
    { label: 'Communication', Icon: MessageCircle, style: { top: '45%', left: '-18%' }, dur: 3.5, delay: 0.3 },
    { label: 'Fees', Icon: IndianRupee, style: { top: '45%', right: '-15%' }, dur: 4.2, delay: 0.9 },
    { label: 'Homework', Icon: BookMarked, style: { bottom: '5%', left: '-12%' }, dur: 3.9, delay: 1.5 },
    { label: 'Transport', Icon: Bus, style: { bottom: '5%', right: '-12%' }, dur: 4.8, delay: 0.5 },
  ]

  return (
    <div
      ref={containerRef}
      style={{ perspective: '1000px' }}
      className="relative w-full h-[680px] max-md:h-[420px] max-md:scale-[0.65] flex items-center justify-center"
    >
      {/* Scene wrapper — subtle mouse parallax */}
      <motion.div
        animate={{ rotateY: mousePos.x * 0.3, rotateX: -mousePos.y * 0.2 }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        className="relative w-[560px] h-[560px] flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* BACKGROUND GLOW */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '480px',
            height: '480px',
            zIndex: 0,
            background: 'radial-gradient(ellipse, rgba(196,163,42,0.08) 0%, rgba(139,69,19,0.04) 40%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* SVG gradient + glow definitions */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#D9A92E" />
              <stop offset="100%" stopColor="#9A6A15" />
            </linearGradient>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#C9C9D8" />
              <stop offset="100%" stopColor="#8A8AA0" />
            </linearGradient>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D6C6" />
              <stop offset="50%" stopColor="#C9906F" />
              <stop offset="100%" stopColor="#A06040" />
            </linearGradient>
            <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* RING 1 — Gold diagonal metallic ellipse */}
        <div className="absolute pointer-events-none" style={{ width: 480, height: 180, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <div className="absolute inset-0" style={{ transform: 'rotate(-35deg)' }}>
            <svg width="480" height="180" viewBox="0 0 480 180" fill="none" style={{ overflow: 'visible' }}>
              <ellipse cx="240" cy="90" rx="240" ry="90" stroke="url(#goldGrad)" strokeWidth="2.5" opacity="0.85" filter="url(#ringGlow)" />
            </svg>
            <motion.div className="absolute inset-0" style={{ willChange: 'transform' }} animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
              <div className="absolute rounded-full" style={{ top: '12%', left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, background: 'radial-gradient(circle at 35% 35%, #FFE066 0%, #C4A32A 100%)', boxShadow: '0 0 16px 6px rgba(196,163,42,0.9)' }} />
            </motion.div>
          </div>
        </div>

        {/* RING 2 — Silver diagonal metallic ellipse */}
        <div className="absolute pointer-events-none" style={{ width: 400, height: 150, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <div className="absolute inset-0" style={{ transform: 'rotate(35deg)' }}>
            <svg width="400" height="150" viewBox="0 0 400 150" fill="none" style={{ overflow: 'visible' }}>
              <ellipse cx="200" cy="75" rx="200" ry="75" stroke="url(#silverGrad)" strokeWidth="2" opacity="0.75" filter="url(#ringGlow)" />
            </svg>
            <motion.div className="absolute inset-0" style={{ willChange: 'transform' }} animate={{ rotate: [360, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
              <div className="absolute rounded-full" style={{ top: '12%', left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, background: 'radial-gradient(circle at 35% 35%, #E8E8F8 0%, #A0A0C0 100%)', boxShadow: '0 0 12px 4px rgba(160,160,192,0.8)' }} />
            </motion.div>
          </div>
        </div>

        {/* RING 3 — Rose gold horizontal metallic ellipse */}
        <div className="absolute pointer-events-none" style={{ width: 320, height: 110, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <div className="absolute inset-0" style={{ transform: 'rotate(0deg)' }}>
            <svg width="320" height="110" viewBox="0 0 320 110" fill="none" style={{ overflow: 'visible' }}>
              <ellipse cx="160" cy="55" rx="160" ry="55" stroke="url(#roseGrad)" strokeWidth="1.5" opacity="0.7" filter="url(#ringGlow)" />
            </svg>
            <motion.div className="absolute inset-0" style={{ willChange: 'transform' }} animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
              <div className="absolute rounded-full" style={{ top: '12%', left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, background: 'radial-gradient(circle at 35% 35%, #E8A060 0%, #8B4513 100%)', boxShadow: '0 0 10px 3px rgba(139,69,19,0.7)' }} />
            </motion.div>
          </div>
        </div>

        {/* STUDENT — 3D model */}
        <div
          className="absolute z-20"
          style={{
            width: '320px',
            height: '480px',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <StudentCanvas />
        </div>

        {/* FLOATING FEATURE BADGES */}
        {badges.map((b) => (
          <motion.div
            key={b.label}
            className="absolute z-30 flex items-center gap-2 px-5 py-2.5 rounded-full cursor-default"
            style={{
              ...b.style,
              background: '#FFFFFF',
              border: '1px solid #EDE8E3',
              boxShadow: '0 4px 20px rgba(139,69,19,0.10)',
              willChange: 'transform',
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
            whileHover={{ scale: 1.06 }}
          >
            <div className="w-8 h-8 bg-[#F5EDE0] rounded-lg flex items-center justify-center">
              <b.Icon size={16} color="#8B4513" />
            </div>
            <span className="text-sm font-semibold text-[#1A1410] whitespace-nowrap">{b.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Main Home component ─── */
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
          <div className="grid lg:grid-cols-[42fr_58fr] gap-12 items-center">
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
                <span className="text-[#1A1410]">{t('hero.title2')}</span>
                <br />
                <span className="gradient-text">{t('hero.titleHighlight')}</span>
                <br />
                <span className="text-[#1A1410]">{t('hero.titleEnd')}</span>{' '}
                <span className="gradient-text">{t('hero.titleBrand')}</span>
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
            </div>

            {/* Orbital 3D hero visual */}
            <div className="relative flex items-center justify-center lg:scale-[0.82] xl:scale-[0.92] origin-center w-full">
              <OrbitalHero />
            </div>
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



      <Footer />
      <Chatbot />
    </main>
  )
}

useGLTF.setDecoderPath('/draco/')
useGLTF.preload('/student.glb')
