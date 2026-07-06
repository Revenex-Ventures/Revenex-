import { useRef, useState } from 'react'
import { Link } from 'wouter'
import { useQueryClient } from '@tanstack/react-query'
import { motion, useScroll, useSpring, useInView, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Users, BookOpen, CreditCard, Bell, Calendar,
  BarChart3, Shield, Cpu, CheckCircle2, Zap, Cloud, Sparkles,
  GraduationCap, TrendingUp, Lock, Activity, Server,
  MessageSquare, Award, Star, Send, Globe2, Linkedin,
  Mail, Phone, MapPin, Building2, FileBarChart, Smartphone,
  LayoutDashboard, BedDouble, UtensilsCrossed, ShoppingBag, Settings2,
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
  },
  {
    step: '02',
    icon: Cpu,
    titleEn: 'Custom ERP Setup',
    descEn: 'We set up the platform to match your processes and rules.',
    detailEn: 'We migrate data and apply your branding.',
    tags: ['Zero Data Loss', 'Custom Branding', '48hr Turnaround'],
    color: '#7C3D0F',
    glow: 'rgba(124, 61, 15,0.22)',
    bg: 'rgba(124, 61, 15,0.09)',
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
  },
]

/* ─── Partner logos (white pill style) ─── */
const partners = [
  { name: 'Google Cloud', logo: googleCloudLogo },
  { name: 'Gemini', logo: geminiLogo },
  { name: 'Razorpay', logo: razorpayLogo },
  { name: 'Firebase', logo: firebaseLogo },
  { name: 'Twilio', logo: twilioLogo },
]

function PartnersMarquee() {
  const doubled = [...partners, ...partners, ...partners]
  return (
    <div className="relative overflow-hidden py-3">
      <div className="flex marquee-track gap-4 items-center">
        {doubled.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex items-center justify-center gap-3 shrink-0 min-w-[160px] h-14 px-6 py-3 rounded-2xl bg-white border border-[#E8E0D4] hover:shadow-lg transition-all"
            style={{ boxShadow: '0 2px 8px rgba(139,69,19,0.06)' }}
          >
            <img src={p.logo} alt={p.name} className="block h-7 w-auto object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── How It Works step item (left vertical timeline, icon box + tag pills) ─── */
function HowStep({ step, isLast }: { step: typeof howItWorks[0]; isLast: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 12 }}
      transition={{ duration: 0.55 }}
      className="relative grid grid-cols-[64px_1fr] gap-6 lg:gap-8"
    >
      {/* Left column — icon box + connector dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={isInView
            ? { boxShadow: `0 0 22px ${step.glow}, 0 0 44px ${step.glow}` }
            : { boxShadow: '0 0 0px transparent' }}
          transition={{ duration: 0.55 }}
          className="relative z-10 w-14 h-14 lg:w-[60px] lg:h-[60px] rounded-2xl flex items-center justify-center shrink-0 bg-white"
          style={{ border: `1.5px solid ${step.color}30` }}
        >
          <div className="absolute inset-0 rounded-2xl" style={{ background: step.bg }} />
          <Icon className="relative h-6 w-6" style={{ color: step.color }} />
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white leading-none z-10"
            style={{ background: step.color }}
          >
            {step.step}
          </span>
        </motion.div>
        {!isLast && (
          <motion.span
            className="w-2 h-2 rounded-full mt-3 shrink-0"
            animate={{ opacity: isInView ? 1 : 0.3, scale: isInView ? 1 : 0.6 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ background: step.color }}
          />
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

        <h3 className="text-xl lg:text-2xl font-black text-[#1A1410] mb-3 leading-snug">{step.titleEn}</h3>
        <p className="text-[#3D3128] leading-relaxed text-[15px] mb-2">{step.descEn}</p>
        <p className="text-[#6B5D52] text-sm leading-relaxed mb-5">{step.detailEn}</p>

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

/* ─── How It Works — left vertical timeline with scroll-driven progress line ─── */
function HowItWorksSection({ language }: { language: string }) {
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.75', 'end 0.6'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

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

        {/* Left vertical timeline with animated progress line */}
        <div ref={timelineRef} className="relative max-w-3xl">
          <div className="absolute left-[27px] lg:left-[29px] top-7 bottom-7 w-px bg-[#E8E0D4]" />
          <motion.div
            className="absolute left-[27px] lg:left-[29px] top-7 w-px origin-top bg-gradient-to-b from-[#8B4513] via-[#7C3D0F] to-[#166534]"
            style={{ height: lineHeight }}
          />
          {howItWorks.map((step) => (
            <HowStep key={step.step} step={step} isLast={step.step === howItWorks[howItWorks.length - 1].step} />
          ))}
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
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-[#1A1410]">{review.name}</span>
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
                      className={`h-7 w-7 transition-colors ${
                        s <= (hoverRating || form.rating) ? 'text-[#8B4513] fill-[#8B4513]' : 'text-[#6B5D52]'
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
                    <h3 className="text-base font-bold text-[#1A1410] mb-3">{reason.title}</h3>
                    <p className="text-sm text-[#6B5D52] leading-relaxed mb-5">{reason.desc}</p>
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
      color: '#8B4513',
    },
    {
      name: 'Rohan Rajendra Raundal',
      role: 'Co-Founder',
      img: rohanNewImg,
      desc: 'Leads technology, product development, and innovation to build reliable and scalable digital products.',
      linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
      color: '#7C3D0F',
    },
    {
      name: 'Prasanna Mate',
      role: 'CTO',
      img: prasannaImg,
      desc: 'Built REVENEX from scratch. Leads platform engineering to ensure reliability, performance, and smooth deployments.',
      linkedin: 'https://www.linkedin.com/in/prasanna-mate-a247b5328/',
      color: '#3D3128',
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
                <h3 className="text-xl font-black text-[#1A1410] mb-1">{f.name}</h3>
                <p className="text-sm font-semibold mb-4" style={{ color: f.color }}>{f.role}</p>
                <p className="text-[#6B5D52] text-sm leading-relaxed mb-6">{f.desc}</p>
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

/* ─── Features section ─── */
function FeaturesSection({ t }: { t: (key: string) => string }) {
  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 section-glow-left pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <SectionBadge label="Features" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">{t('features.title')}</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">{t('features.subtitle')}</p>
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
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Most schools and businesses juggle spreadsheets, paper registers, and disconnected apps. REVENEX brings it all together.</p>
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

/* ─── Products section (School ERP vs Business CRM tabs) ─── */
function ProductsSection() {
  const [tab, setTab] = useState<'school' | 'business'>('school')

  const tabs = {
    school: {
      label: 'School ERP',
      icon: GraduationCap,
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
    },
    business: {
      label: 'Business CRM',
      icon: Building2,
      blurb: 'A lightweight CRM for hospitality and retail businesses to manage operations and customers.',
      cards: [
        {
          title: 'Hotel Management', desc: 'Bookings, housekeeping, and guest billing in a single system.', icon: BedDouble, color: '#7C3D0F',
          features: ['Room booking engine', 'Housekeeping schedules', 'Guest billing & invoices', 'Channel manager sync', 'Loyalty programs', 'Occupancy analytics'],
          slug: 'fees',
        },
        {
          title: 'Restaurant Management', desc: 'Orders, table turnover, and inventory tracked in real time.', icon: UtensilsCrossed, color: '#8B4513',
          features: ['Table & order management', 'Live kitchen display', 'Inventory tracking', 'Staff shift scheduling', 'Menu & pricing control', 'Sales reporting'],
          slug: 'attendance',
        },
        {
          title: 'Retail Management', desc: 'Inventory, billing, and customer loyalty made simple.', icon: ShoppingBag, color: '#166534',
          features: ['POS billing', 'Inventory & stock alerts', 'Customer loyalty points', 'Multi-store sync', 'Barcode scanning', 'Sales dashboards'],
          slug: 'student-management',
        },
      ],
    },
  } as const

  const active = tabs[tab]

  return (
    <section id="products" className="py-20 lg:py-28 relative border-t border-[#E8E0D4] scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <SectionBadge label="Products" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">One platform, two products</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Purpose-built software for education and for service businesses.</p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#E8E0D4] shadow-sm gap-1">
            {(Object.keys(tabs) as Array<keyof typeof tabs>).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  tab === key ? 'text-white' : 'text-[#3D3128] hover:text-[#7C3D0F]'
                }`}
              >
                {tab === key && (
                  <motion.span
                    layoutId="products-tab-pill"
                    className="absolute inset-0 gradient-bg rounded-xl shadow-lg"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {(() => { const Icon = tabs[key].icon; return <Icon className="h-4 w-4" /> })()}
                  {tabs[key].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.p key={tab + '-blurb'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[#6B5D52] max-w-xl mx-auto mb-10">
          {active.blurb}
        </motion.p>

        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid gap-6 sm:grid-cols-3">
          {active.cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl p-7 h-full bg-white border border-[#E8E0D4] hover:border-transparent transition-all duration-300 hover:shadow-2xl overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(160deg, ${card.color}0d 0%, transparent 60%)` }}
              />
              <div className="relative z-10">
                <div className="inline-flex rounded-2xl p-3.5 mb-5" style={{ background: `${card.color}14` }}>
                  <card.icon className="h-6 w-6" style={{ color: card.color }} />
                </div>
                <h3 className="text-lg font-black text-[#1A1410] mb-2">{card.title}</h3>
                <p className="text-sm text-[#6B5D52] leading-relaxed mb-5">{card.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-[#3D3128]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: card.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/features/${card.slug}`}>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-bold opacity-70 group-hover:opacity-100 group-hover:gap-2.5 transition-all"
                    style={{ color: card.color }}
                  >
                    Explore Features <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Pricing section (luxury upgrade) ─── */
function PricingSection() {
  const starter = {
    name: 'Starter',
    price: '₹0',
    period: '/forever',
    desc: 'For schools and businesses just getting started with digital management.',
    features: ['Up to 100 students/records', 'Attendance & basic reporting', 'Parent/customer dashboard', 'Email support'],
    cta: 'Get Started Free',
  }
  const growth = {
    name: 'Growth',
    price: '₹20,000',
    period: '/year',
    desc: 'For institutions ready to scale with automation and priority support.',
    features: ['Unlimited students/records', 'Fee collection & payroll automation', 'Advanced analytics & reports', 'Priority support', 'Custom onboarding'],
    cta: 'Schedule a Demo',
  }

  return (
    <section id="pricing" className="py-20 lg:py-28 relative border-t border-[#E8E0D4] scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <SectionBadge label="Pricing" />
          <h2 className="text-4xl font-black text-[#1A1410] sm:text-5xl mb-4">Simple, transparent pricing</h2>
          <p className="text-[#6B5D52] text-lg max-w-2xl mx-auto">Start free. Upgrade when you're ready to grow.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-center">
          {/* Starter — flat, minimal white card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 border border-[#E8E0D4] bg-white"
          >
            <h3 className="text-xl font-black text-[#1A1410] mb-1">{starter.name}</h3>
            <p className="text-sm text-[#6B5D52] mb-5">{starter.desc}</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-black text-[#1A1410]">{starter.price}</span>
              <span className="text-sm text-[#6B5D52] mb-1">{starter.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {starter.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#3D3128]">
                  <CheckCircle2 className="h-4 w-4 text-[#7C3D0F] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold cursor-pointer border border-[#1A1410] text-[#1A1410] hover:bg-[#F0E8DC] transition-all"
              >
                {starter.cta} <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>

          {/* Growth — elevated dark gradient, most popular */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: -14, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl p-8"
            style={{ background: 'linear-gradient(155deg, #2A1A0F 0%, #1A1410 100%)', boxShadow: '0 30px 60px -15px rgba(26,20,16,0.5)' }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-bg text-white text-xs font-bold uppercase tracking-widest shadow-lg whitespace-nowrap"
            >
              Most Popular
            </motion.div>
            <h3 className="text-xl font-black text-white mb-1">{growth.name}</h3>
            <p className="text-sm text-white/60 mb-5">{growth.desc}</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-black text-white">{growth.price}</span>
              <span className="text-sm text-white/50 mb-1">{growth.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {growth.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-[#D4A574] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold cursor-pointer gradient-bg text-white shadow-lg"
              >
                {growth.cta} <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
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

      {/* ── FEATURES ── */}
      <FeaturesSection t={t} />

      {/* ── WHY REVENEX ── */}
      <WhyRevenexSection language={language} />

      {/* ── PRODUCTS ── */}
      <ProductsSection />

      {/* ── HOW IT WORKS (vertical animated timeline) ── */}
      <HowItWorksSection language={language} />

      {/* ── PRICING ── */}
      <PricingSection />

      {/* ── REVIEWS / TESTIMONIALS ── */}
      <ReviewsSection />

      {/* ── MEET THE TEAM / ABOUT ── */}
      <MeetFoundersSection />

      {/* ── LET'S TALK / CONTACT ── */}
      <LetsTalkSection language={language} />

      {/* ── ENGINEERING SPECS ── */}
      <section className="py-12 border-y border-[#E8E0D4]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '99.9%', label: 'Uptime SLA Target', color: 'text-aqua' },
              { value: '2hr', label: 'Support Response', color: 'text-[#8B4513]' },
              { value: '256-bit', label: 'AES Encryption', color: 'text-green-700' },
              { value: '24/7', label: 'Monitoring', color: 'text-amber-700' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className={`text-3xl font-black lg:text-4xl mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-[#6B5D52]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
