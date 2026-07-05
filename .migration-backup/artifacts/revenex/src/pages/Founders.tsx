import { useRef } from 'react'
import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { ArrowRight, Linkedin, Heart, Sparkles, Code2, Server, Cloud, CreditCard, MessageSquare, Brain, Mail } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'
const rounakImg = '/Rounak.jpg'
const rohanImg = '/Rohan.jpg'
const prasannaImg = '/Prasanna.jpg'

/* ─── 3D Tilt card ─── */
function TiltCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transition = 'transform 0.08s linear, box-shadow 0.08s linear'
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(12px)`
    el.style.boxShadow = `${-x * 20}px ${y * 20}px 60px rgba(0,229,195,0.08), 0 40px 80px rgba(0,0,0,0.4)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease'
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
    el.style.boxShadow = ''
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

const founders = [
  {
    name: 'Rounak Vijay Sute',
    role: 'Founder & CEO',
    roleHi: 'संस्थापक और CEO',
    linkedin: 'https://www.linkedin.com/in/rounaksute/',
    bioEn: 'Founder & CEO. Leads product strategy and customer partnerships to modernize school administration.',
    bioHi: 'संस्थापक और CEO। स्कूल प्रशासन को आधुनिक करने के लिए उत्पाद रणनीति और भागीदारी का नेतृत्व करते हैं।',
    expertise: ['Product Strategy', 'EdTech Vision', 'Business Development', 'Partnerships'],
    photo: rounakImg,
    accentColor: '#00E5C3',
    gradient: 'from-[#00D4C6] to-[#6E56CF]',
    email: null,
  },
  {
    name: 'Rohan Rajendra Raundal',
    role: 'Co-Founder',
    roleHi: 'सह-संस्थापक',
    linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
    bioEn: 'Co-founder. Leads engineering and platform architecture, focused on reliability and scalability.',
    bioHi: 'सह-संस्थापक। इंजीनियरिंग और प्लेटफ़ॉर्म आर्किटेक्चर का नेतृत्व करते हैं, विश्वसनीयता और स्केलेबिलिटी पर केंद्रित।',
    expertise: ['Full-Stack Engineering', 'Cloud Architecture', 'AI/ML', 'DevOps'],
    photo: rohanImg,
    accentColor: '#7C4DFF',
    gradient: 'from-[#6E56CF] to-[#00D4C6]',
    email: null,
  },
]

const cto = {
  name: 'Prasanna Mate',
  role: 'CTO',
  roleHi: 'CTO और सॉफ्टवेयर डेवलपर',
  linkedin: 'https://www.linkedin.com/in/prasanna-mate-a247b5328/',
  email: 'prasannamate1754@gmail.com',
  bioEn: 'Built REVENEX from scratch. Leads platform engineering to ensure reliability, performance, and smooth deployments.',
  bioHi: 'REVENEX प्लेटफॉर्म और वेबसाइट बनाईं। भरोसेमंद कोड, स्केलेबल सिस्टम और सुचारू तैनाती पर ध्यान।',
  photo: prasannaImg,
  expertise: ['Software Architecture', 'Full-Stack Development', 'Cloud Infrastructure', 'ERP Systems'],
  accentColor: '#3B82F6',
  gradient: 'from-[#00D4C6] to-[#3B82F6]',
}

const techStack = [
  {
    category: 'Frontend', categoryHi: 'फ्रंटएंड', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Code2,
    items: [{ name: 'React', desc: 'UI library' }, { name: 'TypeScript', desc: 'Type safety' }, { name: 'Tailwind CSS', desc: 'Styling' }, { name: 'Framer Motion', desc: 'Animations' }],
  },
  {
    category: 'Backend', categoryHi: 'बैकएंड', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: Server,
    items: [{ name: 'Node.js', desc: 'Runtime' }, { name: 'Express', desc: 'API framework' }, { name: 'PostgreSQL', desc: 'Database' }, { name: 'Drizzle ORM', desc: 'ORM' }],
  },
  {
    category: 'Infrastructure', categoryHi: 'इंफ्रास्ट्रक्चर', color: 'text-aqua', bg: 'bg-aqua/10', border: 'border-aqua/20', icon: Cloud,
    items: [{ name: 'Google Cloud', desc: 'Cloud platform' }, { name: 'Firebase', desc: 'Auth & storage' }, { name: 'Cloud Run', desc: 'Containers' }, { name: 'Cloud SQL', desc: 'Managed DB' }],
  },
  {
    category: 'Payments', categoryHi: 'भुगतान', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: CreditCard,
    items: [{ name: 'Razorpay', desc: 'Payment gateway' }, { name: 'UPI', desc: 'Instant payments' }, { name: 'Bank transfers', desc: 'NEFT/RTGS' }, { name: 'Auto-receipts', desc: 'PDF generation' }],
  },
  {
    category: 'Communication', categoryHi: 'संचार', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: MessageSquare,
    items: [{ name: 'Twilio', desc: 'SMS & WhatsApp' }, { name: 'Push Notifications', desc: 'Mobile alerts' }, { name: 'Email', desc: 'SMTP service' }, { name: 'In-app chat', desc: 'Real-time' }],
  },
  {
    category: 'AI & Analytics', categoryHi: 'AI और एनालिटिक्स', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', icon: Brain,
    items: [{ name: 'Gemini AI', desc: 'Google AI' }, { name: 'Analytics', desc: 'Dashboards' }, { name: 'Predictions', desc: 'ML models' }, { name: 'Reports', desc: 'Auto-generated' }],
  },
]

/* ─── Partner logo SVGs ─── */
function PartnerLogo({ name }: { name: string }) {
  if (name === 'Google Cloud') return (
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <path d="M24 9C16.27 9 9.9 14.55 8.4 21.87 4.73 22.67 2 25.98 2 30c0 4.42 3.58 8 8 8h28c4.42 0 8-3.58 8-8 0-3.94-2.84-7.22-6.6-7.9C38.1 14.55 31.73 9 24 9z" fill="#4285F4"/>
    </svg>
  )
  if (name === 'Firebase') return (
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <path d="M8 40l6-36 10 18 5-9 11 27z" fill="#FFC107"/>
      <path d="M14 4L8 40l10-12z" fill="#FF9800" opacity=".8"/>
      <path d="M29 13l-5 9-6 18 22-27z" fill="#F57C00" opacity=".6"/>
    </svg>
  )
  if (name === 'Gemini AI') return (
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <defs><linearGradient id="gG2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1C69FF"/><stop offset="100%" stopColor="#9966FF"/></linearGradient></defs>
      <path d="M24 4C13.5 4 5 12.5 5 23s8.5 19 19 19 19-8.5 19-19S34.5 4 24 4zm-2 30v-8a9 9 0 010-10V10a15.5 15.5 0 010 24zm4 0V10a15.5 15.5 0 010 24v-8a9 9 0 000-10v14z" fill="url(#gG2)"/>
    </svg>
  )
  if (name === 'Razorpay') return (
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <path d="M8 6l11 36 6-17 8-19z" fill="#3395FF"/>
      <path d="M19 42l6-17L10 6z" fill="#072654" opacity=".7"/>
    </svg>
  )
  if (name === 'Twilio') return (
    <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="#F22F46" strokeWidth="2.5">
      <circle cx="24" cy="24" r="20"/>
      <circle cx="16" cy="16" r="4" fill="#F22F46" stroke="none"/>
      <circle cx="32" cy="16" r="4" fill="#F22F46" stroke="none"/>
      <circle cx="16" cy="32" r="4" fill="#F22F46" stroke="none"/>
      <circle cx="32" cy="32" r="4" fill="#F22F46" stroke="none"/>
    </svg>
  )
  return null
}

const partners = [
  { name: 'Google Cloud', color: '#4285F4', desc: 'Cloud Infrastructure' },
  { name: 'Firebase', color: '#FFCA28', desc: 'Auth & Storage' },
  { name: 'Gemini AI', color: '#9966FF', desc: 'AI Analytics' },
  { name: 'Razorpay', color: '#3395FF', desc: 'Payments' },
  { name: 'Twilio', color: '#F22F46', desc: 'Communications' },
]

export default function Founders() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-[#7C4DFF]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-aqua" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Founders</span>
            </div>
            <h1 className="text-5xl font-black text-white sm:text-6xl lg:text-7xl mb-6">{t('founders.title')}</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/40">{t('founders.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Founder Cards — 3D tilt */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <TiltCard className="glass-card animated-border rounded-3xl overflow-hidden h-full">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${founder.gradient}`} />
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <img
                        src={founder.photo}
                        alt={founder.name}
                        className="w-20 h-20 rounded-3xl object-cover object-top border-2 border-white/10"
                      />
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all text-sm"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-1">{founder.name}</h3>
                    <p className="text-sm font-semibold mb-4" style={{ color: founder.accentColor }}>
                      {language === 'en' ? founder.role : founder.roleHi}
                    </p>
                    <p className="text-sm text-white/50 leading-relaxed mb-6">
                      {language === 'en' ? founder.bioEn : founder.bioHi}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {founder.expertise.map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* CTO Card — Prasanna Mate */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <TiltCard className="glass-card animated-border rounded-3xl overflow-hidden">
              <div className={`h-1.5 w-full bg-gradient-to-r ${cto.gradient}`} />
              <div className="p-8 lg:grid lg:grid-cols-[auto_1fr] lg:gap-8">
                <div>
                  <img
                    src={cto.photo}
                    alt={cto.name}
                    className="w-20 h-20 rounded-3xl object-cover border-2 border-white/10 mb-4 lg:mb-0 lg:w-24 lg:h-24" style={{ objectPosition: '50% 15%' }}
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-white mb-1">{cto.name}</h3>
                      <p className="text-sm font-semibold" style={{ color: cto.accentColor }}>
                        {language === 'en' ? cto.role : cto.roleHi}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={cto.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all text-sm"
                      >
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </a>
                      <a
                        href={`mailto:${cto.email}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-aqua hover:border-aqua/30 hover:bg-aqua/5 transition-all text-sm"
                      >
                        <Mail className="h-4 w-4" /> Email
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-5">
                    {language === 'en' ? cto.bioEn : cto.bioHi}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cto.expertise.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 lg:py-24 relative border-t border-white/5">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Tech Stack</span>
            </div>
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-4">
              {language === 'en' ? 'Built on Enterprise Technology' : 'एंटरप्राइज तकनीक पर निर्मित'}
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              {language === 'en'
                ? 'REVENEX is powered by modern, battle-tested technologies trusted by leading global companies'
                : 'REVENEX आधुनिक, परीक्षित तकनीकों द्वारा संचालित है'}
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((stack, i) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <TiltCard className={`glass-card animated-border rounded-2xl p-6 border ${stack.border} h-full`}>
                  <div className={`inline-flex rounded-2xl p-3 mb-4 ${stack.bg}`}>
                    <stack.icon className={`h-6 w-6 ${stack.color}`} />
                  </div>
                  <h3 className={`text-base font-bold mb-4 ${stack.color}`}>
                    {language === 'en' ? stack.category : stack.categoryHi}
                  </h3>
                  <div className="space-y-2.5">
                    {stack.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{item.name}</span>
                        <span className="text-xs text-white/30">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Official partner logos — real SVGs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14"
          >
            <p className="text-center text-xs font-semibold text-white/25 uppercase tracking-widest mb-8">
              {language === 'en' ? 'Official Technology Partners' : 'आधिकारिक प्रौद्योगिकी भागीदार'}
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <TiltCard className="glass-card rounded-2xl p-5 flex flex-col items-center gap-2.5 border border-white/5 cursor-default w-28"
                    style={{ '--partner-color': partner.color } as React.CSSProperties}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${partner.color}14`, border: `1px solid ${partner.color}28` }}
                    >
                      <PartnerLogo name={partner.name} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-white/75 leading-snug">{partner.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{partner.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Quote */}
      <section className="py-16 lg:py-24 relative">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <TiltCard className="glass-card animated-border rounded-3xl p-12 text-center">
              <div className="text-5xl text-aqua font-serif mb-6">"</div>
              <p className="text-xl text-white/70 leading-relaxed italic mb-8">
                {language === 'en'
                  ? '"Every school deserves powerful, easy-to-use tools. We built REVENEX to make school management reliable, affordable, and simple."'
                  : 'हर विद्यालय के पास सरल और भरोसेमंद उपकरण होने चाहिए। हमने REVENEX को स्कूल प्रबंधन को आसान, सस्ता और भरोसेमंद बनाने के लिए बनाया।'}
              </p>
              <div className="flex items-center justify-center gap-2 text-aqua font-semibold">
                <Heart className="h-4 w-4" />
                <span>The REVENEX Founders</span>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white sm:text-5xl mb-6">{t('cta.title')}</h2>
            <p className="text-white/50 mb-8 text-lg">{t('cta.subtitle')}</p>
            <Link href="/book-demo">
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-8 py-4 rounded-2xl cursor-pointer shadow-[0_0_30px_rgba(0,229,195,0.3)]">
                {t('cta.demo')} <ArrowRight className="h-4 w-4" />
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
