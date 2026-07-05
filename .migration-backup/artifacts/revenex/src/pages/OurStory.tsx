import { useRef } from 'react'
import { Link } from 'wouter'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import { ArrowRight, Lightbulb, Code2, Rocket, Building2, Globe, Heart, Target } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const timeline = [
  {
    period: 'APR 2025', icon: Lightbulb,
    titleEn: 'The Problem', titleHi: 'समस्या की पहचान',
    descEn: 'Indian schools were drowning in paper registers, WhatsApp groups, and spreadsheets. Fee collection was manual, attendance unreliable, communication broken. We decided to solve it.',
    descHi: 'भारतीय स्कूल कागज़ के रजिस्टर, WhatsApp ग्रुप और स्प्रेडशीट में डूब रहे थे। हमने इसे हल करने का फैसला किया।',
    quoteEn: '"We didn\'t just see a problem — we felt it every single day."',
    quoteHi: '"हमने सिर्फ समस्या नहीं देखी — हम इसे हर दिन महसूस करते थे।"',
    color: '#00E5C3', glow: 'rgba(0,229,195,0.3)', bg: 'bg-[#00E5C3]/10', border: 'border-[#00E5C3]/25',
  },
  {
    period: 'JUN 2025', icon: Code2,
    titleEn: 'The Build', titleHi: 'निर्माण शुरू',
    descEn: 'Development began on the core: Student Management, Attendance, Fee Collection. Tech stack locked in — React frontend, Node.js backend, PostgreSQL, Google Cloud. Every obstacle became a lesson.',
    descHi: 'कोर मॉड्यूल पर डेवलपमेंट शुरू हुई। हर बाधा एक सीख बन गई।',
    quoteEn: '"They said we needed funding to exist. We said we needed better engineering."',
    quoteHi: '"उन्होंने कहा हमें फंडिंग चाहिए। हमने कहा — बेहतर इंजीनियरिंग चाहिए।"',
    color: '#7C4DFF', glow: 'rgba(124,77,255,0.3)', bg: 'bg-[#7C4DFF]/10', border: 'border-[#7C4DFF]/25',
  },
  {
    period: 'SEP 2025', icon: Rocket,
    titleEn: 'Platform Alpha', titleHi: 'प्लेटफॉर्म अल्फा',
    descEn: 'First working version went live internally. UX research with real school administrators. Bilingual (English + Hindi) support added. Product started feeling real.',
    descHi: 'पहला कार्यशील संस्करण आंतरिक रूप से लाइव हुआ। उत्पाद असली लगने लगा।',
    quoteEn: '"When the principal said she finally felt in control — that was the moment."',
    quoteHi: '"जब प्राचार्य ने कहा उन्हें अब नियंत्रण महसूस होता है — वो पल था।"',
    color: '#00E5C3', glow: 'rgba(0,229,195,0.3)', bg: 'bg-[#00E5C3]/10', border: 'border-[#00E5C3]/25',
  },
  {
    period: 'EARLY 2026', icon: Building2,
    titleEn: 'The Pivot', titleHi: 'नई दिशा',
    descEn: 'REVENEX VENTURES PRIVATE LIMITED officially incorporated. Razorpay fee payments went live. Twilio parent communication completed. The hardest decisions — made right.',
    descHi: 'REVENEX VENTURES PRIVATE LIMITED आधिकारिक रूप से निगमित। सबसे कठिन फैसले — सही तरीके से लिए गए।',
    quoteEn: '"Incorporation was not the goal. It was the foundation."',
    quoteHi: '"निगमन लक्ष्य नहीं था। यह नींव थी।"',
    color: '#7C4DFF', glow: 'rgba(124,77,255,0.3)', bg: 'bg-[#7C4DFF]/10', border: 'border-[#7C4DFF]/25',
  },
  {
    period: '2026 →', icon: Globe,
    titleEn: 'Growing Now', titleHi: 'अभी विकास',
    descEn: 'Onboarding pilot schools across Maharashtra. Building Gemini AI analytics, exam modules, and expanding for institutions across India. The mission is just getting started.',
    descHi: 'महाराष्ट्र में पायलट स्कूल ऑनबोर्ड हो रहे हैं। मिशन अभी शुरू हुआ है।',
    quoteEn: '"The best school ERP in India doesn\'t exist yet. We\'re building it."',
    quoteHi: '"भारत का सबसे अच्छा स्कूल ERP अभी तक नहीं बना। हम इसे बना रहे हैं।"',
    color: '#00E5C3', glow: 'rgba(0,229,195,0.3)', bg: 'bg-[#00E5C3]/10', border: 'border-[#00E5C3]/25',
  },
]

/* ─── 3D tilt card for values ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transition = 'transform 0.08s linear'
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`
  }
  const onMouseLeave = () => {
    const el = ref.current; if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      className={className} style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}

function ContentBlock({ item, isInView, flip = false }: { item: typeof timeline[0]; isInView: boolean; flip?: boolean }) {
  return (
    <div className={`pt-1 ${flip ? 'text-right' : 'text-left'}`}>
      <motion.div animate={isInView ? { opacity: 1 } : { opacity: 0.4 }} className="mb-3">
        <span
          className="inline-block text-[11px] font-black tracking-widest px-3 py-1 rounded-full"
          style={{ color: item.color, background: item.color + '18', border: `1px solid ${item.color}30` }}
        >
          {item.period}
        </span>
      </motion.div>
      <motion.h3
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 5 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-2xl font-black text-white mb-3"
        style={{ color: item.titleEn === 'The Problem' ? item.color : undefined }}
      >
        {item.titleEn}
      </motion.h3>
      <motion.p
        animate={isInView ? { opacity: 1 } : { opacity: 0.35 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-white/55 leading-relaxed mb-4 max-w-sm"
        style={{ marginLeft: flip ? 'auto' : undefined }}
      >
        {item.descEn}
      </motion.p>
      <motion.div
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: flip ? 10 : -10 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className={`py-1 ${flip ? 'border-r-2 pr-4' : 'border-l-2 pl-4'}`}
        style={{ borderColor: item.color + '60' }}
      >
        <p className="text-sm italic" style={{ color: item.color + 'cc' }}>{item.quoteEn}</p>
      </motion.div>
    </div>
  )
}

function TimelineItem({ item, index }: { item: typeof timeline[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-15% 0px -15% 0px' })
  const isEven = index % 2 === 0

  const iconNode = (
    <motion.div
      animate={isInView ? {
        boxShadow: `0 0 24px ${item.glow}, 0 0 48px ${item.glow.replace('0.3', '0.12')}`
      } : { boxShadow: '0 0 0px transparent' }}
      transition={{ duration: 0.5 }}
      className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center z-10 relative shrink-0`}
      style={{ borderColor: isInView ? item.color + '60' : 'rgba(255,255,255,0.1)' }}
    >
      <item.icon className="h-6 w-6" style={{ color: item.color }} />
    </motion.div>
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile layout (linear, icon on left) */}
      <div className="flex gap-8 pb-16 last:pb-0 lg:hidden">
        <div className="flex-shrink-0">{iconNode}</div>
        <ContentBlock item={item} isInView={isInView} />
      </div>

      {/* Desktop — cinematic alternating layout */}
      <div className="hidden lg:grid grid-cols-[1fr_72px_1fr] gap-x-10 pb-20 last:pb-0 items-start">
        {/* Left column */}
        <div className="flex justify-end">
          {isEven && <div className="max-w-sm w-full"><ContentBlock item={item} isInView={isInView} flip /></div>}
        </div>
        {/* Center icon */}
        <div className="flex justify-center pt-1">{iconNode}</div>
        {/* Right column */}
        <div className="flex justify-start">
          {!isEven && <div className="max-w-sm w-full"><ContentBlock item={item} isInView={isInView} /></div>}
        </div>
      </div>
    </motion.div>
  )
}

export default function OurStory() {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 30%'],
  })

  const lineScaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="absolute top-16 right-1/4 w-[400px] h-[400px] bg-[#7C4DFF]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Our Story</span>
            </div>
            <h1 className="text-5xl font-black text-white sm:text-6xl lg:text-7xl mb-6">
              {language === 'en' ? 'Our Story' : 'हमारी कहानी'}
            </h1>
            <p className="mx-auto max-w-xl text-lg text-white/40">
              {language === 'en'
                ? 'The journey of REVENEX — from idea to platform'
                : 'REVENEX की यात्रा — विचार से प्लेटफॉर्म तक'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why We Built */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <TiltCard className="glass-card animated-border rounded-3xl p-8 lg:p-10">
              <h2 className="text-2xl font-black text-white mb-5">
                {language === 'en' ? 'Why We Built REVENEX' : 'हमने REVENEX क्यों बनाया'}
              </h2>
              <div className="space-y-4 text-white/50 leading-relaxed text-[15px]">
                <p>
                  {language === 'en'
                    ? 'Indian schools were still using paper registers, WhatsApp groups, and broken spreadsheets to run their institutions. Manual attendance, offline fee collection, zero parent visibility.'
                    : 'भारतीय स्कूल अभी भी कागज़ के रजिस्टर और WhatsApp ग्रुप से चल रहे थे।'}
                </p>
                <p>
                  {language === 'en'
                    ? "We believed a single, unified platform — built specifically for Indian schools — could change this. That's why we started in April 2025."
                    : 'हमने अप्रैल 2025 में REVENEX बनाना शुरू किया।'}
                </p>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Timeline — cinematic alternating desktop layout */}
      <section className="py-16 lg:py-24 relative">
        {/* Background glows for depth */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00E5C3]/4 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#7C4DFF]/4 rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl lg:max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Journey</span>
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              {language === 'en' ? 'From Idea to Reality' : 'विचार से वास्तविकता तक'}
            </h2>
          </motion.div>

          {/* Timeline container */}
          <div ref={containerRef} className="relative pl-20 lg:pl-0">
            {/* Background line — left on mobile, center on desktop */}
            <div
              className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            {/* Animated progress line */}
            <motion.div
              className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 w-0.5 rounded-full origin-top"
              style={{
                scaleY: lineScaleY,
                height: '100%',
                background: 'linear-gradient(to bottom, #00E5C3 0%, #7C4DFF 50%, #00E5C3 100%)',
              }}
            />

            {timeline.map((item, i) => (
              <TimelineItem key={item.period || i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-black text-white/50 uppercase tracking-widest">Values</span>
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              {language === 'en' ? 'What Drives Us' : 'हमें क्या प्रेरित करता है'}
            </h2>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Heart, titleEn: 'Student First', descEn: 'Every product decision is about improving student outcomes and making education more accessible.' },
              { icon: Lightbulb, titleEn: 'Innovation', descEn: 'We use AI and modern technology to solve real-world school administration problems, not theoretical ones.' },
              { icon: Target, titleEn: 'Impact', descEn: 'Solving real problems for real educators across India — from metro cities to tier-3 towns.' },
            ].map((value, i) => (
              <motion.div
                key={value.titleEn}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard className="glass-card animated-border rounded-2xl p-7 text-center group hover:border-aqua/20 transition-all h-full">
                  <div className="mx-auto mb-4 inline-flex rounded-2xl bg-aqua/10 p-4 group-hover:bg-aqua/15 transition-colors">
                    <value.icon className="h-7 w-7 text-aqua" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.titleEn}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{value.descEn}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 relative">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <TiltCard className="glass-card animated-border rounded-3xl p-10 text-center">
              <div className="text-5xl text-aqua mb-4 font-serif leading-none">"</div>
              <p className="text-lg text-white/65 leading-relaxed italic mb-8">
                Every school in India deserves world-class tools. REVENEX is our commitment to making that happen.
              </p>
              <div className="flex justify-center gap-10 flex-wrap">
                {['Rounak Vijay Sute — CEO', 'Rohan Rajendra Raundal — CTO'].map((n) => (
                  <div key={n} className="text-center">
                    <div className="text-sm font-bold text-aqua">{n.split(' — ')[0]}</div>
                    <div className="text-xs text-white/30">{n.split(' — ')[1]}</div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white sm:text-4xl mb-4">
              {language === 'en' ? 'Be Part of the Journey' : 'यात्रा का हिस्सा बनें'}
            </h2>
            <p className="text-white/45 mb-8">
              {language === 'en' ? 'We\'re onboarding pilot schools. Let\'s talk.' : 'हम पायलट स्कूलों को ऑनबोर्ड कर रहे हैं।'}
            </p>
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-8 py-4 rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(0,229,195,0.3)]"
              >
                Book a Demo <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
