import { useRef } from 'react'
import { Link } from 'wouter'
import { motion, useInView } from 'framer-motion'
import {
  Target, Eye, ArrowRight, Linkedin, MapPin, Zap,
  Shield, TrendingUp, Users, BookOpen, Globe2, CheckCircle2
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const rounakImg = '/Rounak.jpg'
const rohanImg = '/Rohan.jpg'

function TiltCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transition = 'transform 0.08s linear'
    el.style.transform = `perspective(900px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) translateZ(8px)`
  }
  const onMouseLeave = () => {
    const el = ref.current; if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={className}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  )
}

const stats = [
  { value: '2024', label: 'Founded', icon: Zap, color: '#00E5C3' },
  { value: '8+', label: 'Modules Built', icon: BookOpen, color: '#7C4DFF' },
  { value: '99.9%', label: 'Uptime Target', icon: Shield, color: '#3B82F6' },
  { value: '48hr', label: 'Setup Time', icon: TrendingUp, color: '#10B981' },
]

const timeline = [
  {
    year: '2024',
    title: 'The Idea',
    desc: 'Three engineers noticed that Indian schools were still managing fee records in Excel and attendance in paper registers. The gap was clear: no ERP built truly for Indian classrooms.',
    color: '#00E5C3',
  },
  {
    year: '2024',
    title: 'Building REVENEX',
    desc: 'Development began in earnest — a modern cloud-first ERP with bilingual support, Razorpay integration, and Gemini AI analytics. Built for the 1.5 million schools across India.',
    color: '#7C4DFF',
  },
  {
    year: '2025',
    title: 'Going Live',
    desc: 'REVENEX enters the market with a full suite: student management, attendance, fee collection, parent communication, exam management, staff payroll, and AI-powered reporting.',
    color: '#3B82F6',
  },
]

const coFounders = [
  {
    name: 'Rounak Vijay Sute',
    role: 'Founder & CEO',
    img: rounakImg,
    desc: 'Product strategist and business leader. Drives REVENEX\'s vision of modernizing school administration across India.',
    linkedin: 'https://www.linkedin.com/in/rounaksute/',
    color: '#00E5C3',
    tags: ['Product Vision', 'Business Strategy', 'Partnerships'],
  },
  {
    name: 'Rohan Rajendra Raundal',
    role: 'Co-Founder',
    img: rohanImg,
    desc: 'Full-stack architect. Designed and built the REVENEX platform on Google Cloud with enterprise-grade reliability.',
    linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
    color: '#7C4DFF',
    tags: ['Full Stack', 'Cloud Architecture', 'AI/ML'],
  },
]

const values = [
  { icon: Users, title: 'Students First', desc: 'Every feature we build starts with: how does this help the student learn better?', color: '#00E5C3' },
  { icon: Shield, title: 'Data Privacy', desc: 'Student data is sacred. We handle it with bank-level encryption and strict access controls.', color: '#7C4DFF' },
  { icon: Globe2, title: 'India First', desc: 'Built for Indian boards, Indian languages, Indian payment rails. Not a Western product adapted for India.', color: '#3B82F6' },
  { icon: CheckCircle2, title: 'Reliability', desc: '99.9% uptime target, 2-hour support SLA. When schools depend on you, downtime isn\'t an option.', color: '#10B981' },
]

function TimelineItem({ item, i, total }: { item: typeof timeline[0]; i: number; total: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`grid lg:grid-cols-[1fr_80px_1fr] gap-6 items-center ${i % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}
    >
      <div className={`glass-card rounded-2xl p-6 lg:[direction:ltr] ${i % 2 !== 0 ? 'lg:col-start-3' : ''}`}
        style={{ border: `1px solid ${item.color}22` }}>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-4"
          style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
          <span className="text-xs font-black" style={{ color: item.color }}>{item.year}</span>
        </div>
        <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
      </div>

      {/* Center column — line + dot */}
      <div className="hidden lg:flex flex-col items-center self-stretch lg:[direction:ltr]">
        <div className="flex-1 w-px" style={{ background: i === 0 ? 'transparent' : 'rgba(255,255,255,0.06)' }} />
        <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: item.color, boxShadow: `0 0 16px ${item.color}60` }}>
          <div className="w-2 h-2 rounded-full bg-black" />
        </div>
        <div className="flex-1 w-px" style={{ background: i === total - 1 ? 'transparent' : 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Empty side on desktop */}
      <div className="hidden lg:block" />
    </motion.div>
  )
}

export default function About() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-36 pb-20">
        <div className="absolute inset-0 hero-glow opacity-60 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#7C4DFF]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(0,229,195,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse" />
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">About REVENEX</span>
            </div>
            <h1 className="text-5xl font-black text-white sm:text-6xl lg:text-7xl mb-5 leading-none">
              {language === 'en' ? (
                <>Modernising <span className="gradient-text">India's</span><br />School Management</>
              ) : (
                <><span className="gradient-text">भारत</span> की शिक्षा को<br />बेहतर बना रहे हैं</>
              )}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/40 leading-relaxed mb-10">
              REVENEX VENTURES PRIVATE LIMITED is building the operating system for India's 1.5 million schools — cloud-native, bilingual, and live in 48 hours.
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {['Pune, India', 'Est. 2024', 'Cloud-First ERP'].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 text-sm text-white/35">
                  {tag === 'Pune, India' ? <MapPin className="h-3.5 w-3.5 text-aqua" /> : <CheckCircle2 className="h-3.5 w-3.5 text-aqua" />}
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <TiltCard className="glass-card rounded-2xl p-6 text-center h-full" style={{ border: `1px solid ${s.color}18` } as React.CSSProperties}>
                  <div className="inline-flex w-11 h-11 rounded-xl mb-4 items-center justify-center"
                    style={{ background: `${s.color}14`, border: `1px solid ${s.color}28` }}>
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-white/40">{s.label}</div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-20 lg:py-24 relative">
        <div className="absolute inset-0 section-glow-left pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Purpose</span>
            </div>
            <h2 className="text-4xl font-black text-white sm:text-5xl">Mission & Vision</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                icon: Target, title: language === 'en' ? t('about.mission.title') : 'हमारा मिशन',
                desc: language === 'en' ? t('about.mission.desc') : 'भारत के हर स्कूल को आधुनिक ERP से सशक्त बनाना।',
                color: '#00E5C3', bg: 'bg-aqua/10', detail: 'Democratize enterprise-grade school management tools for every Indian institution — from elite city schools to rural government schools.',
              },
              {
                icon: Eye, title: language === 'en' ? t('about.vision.title') : 'हमारा विजन',
                desc: language === 'en' ? t('about.vision.desc') : 'हर छात्र के लिए बेहतर शिक्षा परिणाम।',
                color: '#7C4DFF', bg: 'bg-purple-400/10', detail: 'A future where every Indian student\'s academic journey is tracked, supported, and optimized by intelligent software — enabling better outcomes for 250M+ learners.',
              },
            ].map((item, i) => (
              <motion.div key={typeof item.title === 'string' ? item.title : i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <TiltCard className="glass-card animated-border rounded-3xl p-8 h-full">
                  <div className={`inline-flex rounded-2xl p-4 mb-5 ${item.bg}`}>
                    <item.icon className="h-7 w-7" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed mb-4">{item.desc}</p>
                  <p className="text-white/30 text-sm leading-relaxed border-t border-white/5 pt-4">{item.detail}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR JOURNEY (timeline) ── */}
      <section className="py-20 lg:py-24 relative border-t border-white/5">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Our Journey</span>
            </div>
            <h2 className="text-4xl font-black text-white sm:text-5xl">From Idea to Platform</h2>
          </motion.div>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} item={item} i={i} total={timeline.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM WE SOLVE ── */}
      <section className="py-20 lg:py-24 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <TiltCard className="glass-card animated-border rounded-3xl p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                <span className="text-xs font-black text-white/50 uppercase tracking-widest">Why We Exist</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-6">
                {language === 'en' ? "The Problem We're Solving" : 'हम किस समस्या को हल कर रहे हैं'}
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>
                  Indian schools were running on WhatsApp groups, paper registers, and broken Excel sheets. Fee collection was manual. Attendance was unreliable. Parents had zero visibility. Principals couldn't see real data.
                </p>
                <p>
                  Existing ERP solutions were either too expensive (₹5–20 lakhs for implementation), too foreign (built for Western academic systems), or too complex (requiring dedicated IT staff). Tier-2 and tier-3 city schools couldn't access them at all.
                </p>
                <p className="text-white/70 font-semibold">
                  REVENEX was built to fix this. Modern, affordable, India-first — and live in 48 hours.
                </p>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-20 lg:py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 section-glow-right pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Values</span>
            </div>
            <h2 className="text-4xl font-black text-white sm:text-5xl">What We Stand For</h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <TiltCard className="glass-card rounded-2xl p-6 h-full group" style={{ border: `1px solid ${v.color}18` } as React.CSSProperties}>
                  <div className="w-11 h-11 rounded-xl mb-5 flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ background: `${v.color}14`, border: `1px solid ${v.color}28` }}>
                    <v.icon className="h-5 w-5" style={{ color: v.color }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CO-FOUNDERS ── */}
      <section className="py-20 lg:py-24 relative border-t border-white/5">
        <div className="absolute inset-0 bg-white/[0.008]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Leadership</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-2">{t('founders.title')}</h2>
            <p className="text-white/40">{t('founders.subtitle')}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {coFounders.map((founder, i) => (
              <motion.div key={founder.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <TiltCard className="glass-card animated-border rounded-3xl p-8 group h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative shrink-0">
                      <img src={founder.img} alt={founder.name}
                        className="w-16 h-16 rounded-2xl object-cover object-top"
                        style={{ border: `2px solid ${founder.color}30` }} />
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{ background: `radial-gradient(circle at center, ${founder.color} 0%, transparent 70%)` }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-0.5">{founder.name}</h3>
                      <p className="text-sm font-semibold" style={{ color: founder.color }}>{founder.role}</p>
                    </div>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{founder.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {founder.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                        style={{ background: `${founder.color}12`, border: `1px solid ${founder.color}22`, color: `${founder.color}cc` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={founder.linkedin} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all hover:scale-105"
                    style={{ color: founder.color, borderColor: `${founder.color}30`, background: `${founder.color}08` }}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
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
