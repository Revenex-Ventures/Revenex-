import { useParams, Link } from 'wouter'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ArrowRight, Server, Sparkles, Globe2, Zap, Shield, Users, CreditCard, Bell, Calendar, BarChart3, BookOpen, Cloud } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'

const featureData: Record<string, {
  badge: string
  title: string
  subtitle: string
  icon: React.ElementType
  color: string
  glow: string
  bgGlow: string
  sections: { heading: string; body: string; points?: string[] }[]
  stats: { value: string; label: string }[]
}> = {
  'one-platform': {
    badge: 'All-in-One',
    title: 'One Platform, Everything Connected',
    subtitle: 'Replace 8+ fragmented tools with a single unified ERP built specifically for Indian schools.',
    icon: Server,
    color: '#00E5C3',
    glow: 'rgba(0,229,195,0.25)',
    bgGlow: 'rgba(0,229,195,0.06)',
    stats: [
      { value: '8+', label: 'Apps Replaced' },
      { value: '40hrs', label: 'Saved Per Month' },
      { value: '100%', label: 'Data In One Place' },
      { value: '1 Login', label: 'For Everything' },
    ],
    sections: [
      {
        heading: 'The Problem with Fragmented Tools',
        body: 'Most Indian schools run on a patchwork of 8–12 different tools: WhatsApp groups for parent communication, Excel sheets for fee tracking, paper registers for attendance, a separate platform for exams, and another for HR. No data sync. No single view. Constant manual work.',
        points: [
          'Data lives in 8+ disconnected systems',
          'Teachers spend 3+ hours/week on manual data entry',
          'Zero real-time visibility for principals',
          'Parent communication is inconsistent and unreliable',
        ],
      },
      {
        heading: 'The REVENEX Difference',
        body: "REVENEX consolidates every school operation into one intelligent dashboard. Student records, attendance, fees, exams, HR, parent communication — all interconnected. When a student's fee is paid, it automatically updates in the student record, triggers a WhatsApp receipt, and reflects in the principal's analytics. Zero manual steps.",
        points: [
          'Student Management + Admissions',
          'Attendance (Biometric / Manual / RFID)',
          'Fee Collection with Razorpay UPI',
          'Exam Management + Report Cards',
          'Staff Payroll & Leave Management',
          'Parent Communication via WhatsApp & SMS',
          'Gemini AI Analytics Dashboard',
          'Role-Based Access for every user type',
        ],
      },
      {
        heading: 'How It Saves Time Every Day',
        body: 'School administrators who switch to REVENEX typically reclaim 40+ hours per month. Fee reconciliation drops from 3 days to 1 click. Monthly report cards go from a week of printing to instant digital delivery. Parent queries drop 60% because information is available proactively.',
      },
    ],
  },
  'ai-insights': {
    badge: 'AI-Powered',
    title: 'AI-Powered Insights with Gemini',
    subtitle: 'Real-time analytics that predict problems before they happen and automate routine reporting.',
    icon: Sparkles,
    color: '#7C4DFF',
    glow: 'rgba(124,77,255,0.25)',
    bgGlow: 'rgba(124,77,255,0.06)',
    stats: [
      { value: '90%', label: 'Faster Reporting' },
      { value: '15min', label: 'Monthly Report Time' },
      { value: 'Gemini', label: 'AI Engine' },
      { value: '24/7', label: 'Insight Updates' },
    ],
    sections: [
      {
        heading: 'Why Most School Data Is Useless',
        body: "Most school ERP systems collect data but never turn it into actionable insight. A principal has to manually download Excel sheets, pivot tables, and calculate metrics. By the time a trend is identified, it's too late to act on it.",
      },
      {
        heading: 'Gemini AI Inside REVENEX',
        body: 'REVENEX is integrated with Google Gemini AI to provide natural language insights and automated analytics. Ask questions like "Which students have attendance below 75% this month?" and get an instant, precise answer. The system also proactively alerts principals about dropout risks, fee defaulters, and performance trends.',
        points: [
          'Natural language question answering',
          'Automated monthly performance reports',
          'Dropout risk prediction with early alerts',
          'Fee collection trend analysis',
          'Attendance pattern anomaly detection',
          'Staff performance benchmarking',
          'AI-generated parent update summaries',
          'Real-time dashboard with live KPIs',
        ],
      },
      {
        heading: 'From Data to Decision in Minutes',
        body: 'What used to take a school administrator a full day of analysis now happens automatically. REVENEX generates your monthly board report, identifies your at-risk students, and surfaces fee collection gaps — all before your morning tea.',
      },
    ],
  },
  'india-first': {
    badge: 'India-First',
    title: 'Built for India\'s Schools',
    subtitle: 'Not a foreign SaaS adapted for India — built ground-up for Indian curriculum, payments, and connectivity.',
    icon: Globe2,
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.25)',
    bgGlow: 'rgba(59,130,246,0.06)',
    stats: [
      { value: '2', label: 'Languages (EN + HI)' },
      { value: 'UPI', label: 'Razorpay Payments' },
      { value: 'CBSE', label: '& ICSE Ready' },
      { value: '2G', label: 'Network Compatible' },
    ],
    sections: [
      {
        heading: 'The Problem with Foreign SaaS',
        body: "Most school ERP platforms in India are American or European products retrofitted for the Indian market. They assume fast internet, English-only users, credit card payments, and Western academic structures. They don't understand Maharashtra SSC, CBSE marksheets, or WhatsApp-first parent communication.",
      },
      {
        heading: 'Designed for Indian Realities',
        body: "REVENEX was designed by Indians, for Indian schools. Every feature reflects the reality of running a school in India — from tier-1 cities to tier-3 towns. The platform works reliably on 2G mobile connections, supports UPI and Razorpay for fee payments, and has full bilingual (Hindi + English) support throughout the interface.",
        points: [
          'Full Hindi + English bilingual interface',
          'Razorpay UPI, NetBanking, and card payments',
          'CBSE, ICSE, and State Board grade formats',
          'WhatsApp-first parent communication via Twilio',
          '2G/3G compatible — lightweight & fast',
          'India time zones and date formats throughout',
          'Rupee-denominated billing and invoices',
          'Supports Indian school calendar and academic year',
        ],
      },
      {
        heading: 'For Schools Across Maharashtra and Beyond',
        body: "We're currently onboarding pilot schools in Maharashtra with plans to expand across India. Our support team is fluent in Hindi, Marathi, and English. We understand your workflow because we've worked inside Indian schools to design REVENEX.",
      },
    ],
  },
  'zero-setup': {
    badge: 'Fast Setup',
    title: 'Zero Friction, Live in 48 Hours',
    subtitle: 'No IT team. No months of implementation. Teachers trained in 30 minutes. Full support, always.',
    icon: Zap,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.25)',
    bgGlow: 'rgba(16,185,129,0.06)',
    stats: [
      { value: '48hrs', label: 'Average Go-Live Time' },
      { value: '30min', label: 'Teacher Onboarding' },
      { value: '2hr', label: 'Critical Support SLA' },
      { value: '0', label: 'IT Team Required' },
    ],
    sections: [
      {
        heading: 'Why School ERP Implementations Fail',
        body: 'Traditional school ERP projects take 6–18 months to implement, cost lakhs of rupees in consulting fees, and require a dedicated IT team. By the time they go live, half the staff has given up and reverted to their old methods.',
      },
      {
        heading: 'The REVENEX 48-Hour Guarantee',
        body: 'Our onboarding process is built for speed and simplicity. We configure the platform for your school, migrate your existing data, and train your complete staff — all within 48 hours. No IT team needed. No complicated servers. Everything runs on Google Cloud, managed entirely by us.',
        points: [
          'Day 1: Discovery call and school configuration',
          'Day 1–2: Data migration from existing systems',
          'Day 2: Live training sessions (2–3 hours)',
          'Day 2: Go-live with full monitoring support',
          'Week 1: Daily check-ins and refinements',
          'Ongoing: 2-hour critical issue SLA, Mon–Sat',
          'Monthly: Usage reports and performance reviews',
          '99.9% uptime target on Google Cloud infrastructure',
        ],
      },
      {
        heading: 'Support That Actually Responds',
        body: "When something goes wrong at 8am before school starts, you need a real human — not a chatbot ticketing system. REVENEX provides direct WhatsApp support with a 2-hour SLA for critical issues. Our team has actual school context and can resolve problems before first period.",
      },
    ],
  },
}

const moduleData: Record<string, {
  badge: string; title: string; subtitle: string; icon: React.ElementType; color: string; glow: string
  desc: string; points: string[]
}> = {
  'student-management': {
    badge: 'Module', title: 'Student Management & Scalability', subtitle: 'Complete student lifecycle from admission to graduation — scales from 100 to 10,000+ students effortlessly.',
    icon: Users, color: '#7C4DFF', glow: 'rgba(124,77,255,0.25)',
    desc: 'Manage every student record digitally. Track admission, academic history, attendance, fee status, and behaviour records — all in one unified profile. Built to handle institutions of any size without performance degradation.',
    points: ['Digital admission with document uploads', 'Academic history and subject tracking', 'Attendance linked to student profiles', 'Fee dues and payment history per student', 'Parent contact management', 'Student ID generation', 'Graduation and alumni records', 'Scales from 100 to 10,000+ students seamlessly'],
  },
  'fee-management': {
    badge: 'Module', title: 'Fee Management', subtitle: 'Online fee collection, receipts, dues tracking and Razorpay integration.',
    icon: CreditCard, color: '#F59E0B', glow: 'rgba(245,158,11,0.25)',
    desc: 'Collect fees online via Razorpay UPI, cards, and NetBanking. Automatically generate receipts, track dues, and send automated WhatsApp reminders.',
    points: ['Razorpay UPI & card integration', 'Automated digital receipts', 'Due date tracking with WhatsApp alerts', 'Partial payment and installment support', 'Fee structure by class/section', 'Monthly collection dashboards', 'GST-compliant invoicing'],
  },
  'fees': {
    badge: 'Affordable', title: 'Transparent & Affordable Pricing', subtitle: 'One plan, all features. Designed specifically for Indian schools — no hidden costs, no per-module charges.',
    icon: CreditCard, color: '#10B981', glow: 'rgba(16,185,129,0.25)',
    desc: 'REVENEX is priced to be accessible for every Indian school — from small private schools to large multi-campus institutions. One flat subscription covers every feature, with no surprise add-ons.',
    points: [
      'Single flat subscription — all features included',
      'No per-module or per-user hidden charges',
      'Rupee-denominated billing, no forex surprises',
      'Free onboarding and data migration',
      'Free staff training included',
      'Monthly and annual plans available',
      'Scales with your school — no upgrade tiers',
      'ROI typically achieved within 3 months',
    ],
  },
  'security': {
    badge: 'Secure & Cloud', title: 'Bank-Grade Security on Google Cloud', subtitle: '256-bit AES encryption, role-based access, GDPR-compliant data handling — hosted on Google Cloud with 99.9% uptime.',
    icon: Shield, color: '#00E5C3', glow: 'rgba(0,229,195,0.25)',
    desc: 'REVENEX uses the same encryption standards as Indian banks. Hosted on Google Cloud infrastructure, your school data is protected around the clock — with role-based access ensuring every user sees only what they need.',
    points: [
      '256-bit AES encryption at rest and in transit',
      'Role-based access: Principal, Teacher, Parent, Staff',
      'GDPR and Indian data protection compliant',
      'Hosted on Google Cloud — 99.9% uptime target',
      'Access from any device — mobile, tablet, desktop',
      'Automatic daily backups with point-in-time recovery',
      'Audit logs for every admin action',
      'Zero data selling policy — your data stays yours',
    ],
  },
  'ai-analytics': {
    badge: 'AI Powered', title: 'AI-Powered School Intelligence', subtitle: 'Gemini AI generates reports, predicts dropout risks, and automates routine admin tasks — so you focus on education.',
    icon: BarChart3, color: '#8B5CF6', glow: 'rgba(139,92,246,0.25)',
    desc: 'Natural language queries, automated monthly reports, dropout risk alerts, and real-time KPI dashboards — all powered by Google Gemini AI. Ask questions about your school in plain English and get instant, precise answers.',
    points: [
      'Natural language analytics queries in Hindi & English',
      'Automated monthly performance reports',
      'Dropout risk prediction with early alerts',
      'Fee collection trend analysis',
      'Real-time KPI dashboard for principals',
      'Attendance anomaly detection',
      'Staff performance benchmarking',
      'AI-generated parent update summaries',
    ],
  },
  'security-access': {
    badge: 'Module', title: 'Security & Access Control', subtitle: 'Role-based access, data encryption, and GDPR-compliant handling.',
    icon: Shield, color: '#EF4444', glow: 'rgba(239,68,68,0.25)',
    desc: '256-bit AES encryption at rest and in transit. Role-based access ensures principals, teachers, and parents see exactly what they need — nothing more.',
    points: ['256-bit AES encryption', 'Role-based access control', 'GDPR-compliant data handling', 'Audit logs for all actions', '24/7 security monitoring', 'Automated backups', 'Zero data selling policy'],
  },
  'attendance': {
    badge: 'Module', title: 'Attendance Tracking', subtitle: 'Biometric, RFID and manual attendance with instant parent SMS and WhatsApp alerts.',
    icon: Calendar, color: '#10B981', glow: 'rgba(16,185,129,0.25)',
    desc: 'Mark and track attendance digitally across every class and section. Biometric and RFID integrations allow fully automated marking — and parents are notified the moment their child is marked absent.',
    points: [
      'Biometric and RFID-based auto attendance',
      'Manual marking with teacher mobile app',
      'Instant WhatsApp and SMS alerts to parents',
      'Class-wise and student-wise attendance reports',
      'Monthly attendance summaries for parents',
      'Automatic low-attendance warnings',
      'Holiday and leave management',
      'Detention tracking for chronic absentees',
    ],
  },
  'parent-communication': {
    badge: 'Module', title: 'Parent Communication', subtitle: 'SMS, WhatsApp and in-app notifications keep parents always informed — in real time.',
    icon: Bell, color: '#F97316', glow: 'rgba(249,115,22,0.25)',
    desc: 'Keep parents engaged and informed at every step. REVENEX sends automatic WhatsApp messages for attendance, fee reminders, exam results, and school announcements — all without the admin lifting a finger.',
    points: [
      'WhatsApp messages via Twilio integration',
      'SMS alerts for attendance and fee dues',
      'Instant absence notifications to parents',
      'Fee payment receipts sent automatically',
      'Exam schedule and result notifications',
      'Bulk announcements to all parents',
      'Two-way parent-teacher messaging',
      'Bilingual messages in Hindi and English',
    ],
  },
  'exam-results': {
    badge: 'Module', title: 'Exam Management & Results', subtitle: 'Online exams, grading, report cards, and performance analytics — fully digital.',
    icon: BookOpen, color: '#A855F7', glow: 'rgba(168,85,247,0.25)',
    desc: 'Create and manage exams digitally, auto-calculate grades, generate digital report cards, and share results with parents via WhatsApp — all within one platform.',
    points: [
      'Online exam scheduling and timetable',
      'Marks entry with auto grade calculation',
      'CBSE, ICSE and State Board grade formats',
      'Digital report card generation in seconds',
      'Parent WhatsApp delivery of report cards',
      'Subject-wise and class-wise performance analytics',
      'Comparative performance trend charts',
      'Exam hall ticketing and seating management',
    ],
  },
  'staff-management': {
    badge: 'Module', title: 'Staff Management', subtitle: 'Payroll, leave management, and performance tracking for all teaching and non-teaching staff.',
    icon: Users, color: '#06B6D4', glow: 'rgba(6,182,212,0.25)',
    desc: 'Manage your entire staff lifecycle digitally — from hiring and onboarding to payroll processing, leave approvals, and performance reviews. Everything in one place, fully automated.',
    points: [
      'Staff digital profiles and documents',
      'Monthly payroll processing and payslips',
      'Leave application and approval workflow',
      'Attendance tracking for teaching staff',
      'Performance review and appraisal module',
      'Substitution management for absent teachers',
      'PF and ESI deduction automation',
      'Timetable and class assignment management',
    ],
  },
  'cloud-based': {
    badge: 'Cloud Infrastructure', title: 'Cloud Based on Google Cloud', subtitle: 'Hosted on Google Cloud with 99.9% uptime target. Access your ERP from any device, anywhere, anytime.',
    icon: Cloud, color: '#3B82F6', glow: 'rgba(59,130,246,0.25)',
    desc: 'REVENEX runs on Google Cloud — enterprise-grade infrastructure trusted by thousands of businesses globally. Your school data is always available, always fast, and always protected, whether you\'re on a mobile in a classroom or a laptop in the principal\'s office.',
    points: [
      '99.9% uptime target on Google Cloud infrastructure',
      'Access from any device — mobile, tablet, desktop',
      'Works reliably on 2G/3G connections in rural India',
      'Automatic daily backups with point-in-time recovery',
      'Zero IT team required — we manage everything',
      'Instant updates — no manual software installs',
      'Data centres in India for low-latency performance',
      'Scales automatically as your school grows',
    ],
  },
}

export default function FeatureDetail() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug ?? ''

  const data = featureData[slug] ?? moduleData[slug]

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-32">
          <h1 className="text-3xl font-black text-white mb-4">Feature Not Found</h1>
          <Link href="/">
            <span className="text-aqua hover:underline cursor-pointer">← Back to home</span>
          </Link>
        </div>
      </main>
    )
  }

  const Icon = data.icon
  const isFullFeature = slug in featureData
  const full = isFullFeature ? featureData[slug] : null
  const mod = !isFullFeature ? moduleData[slug] : null

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${data.glow}, transparent 70%)` }} />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: data.bgGlow }} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/">
              <motion.span whileHover={{ x: -3 }} className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer mb-8">
                <ArrowLeft className="h-4 w-4" /> Back to home
              </motion.span>
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${data.color}18`, border: `1px solid ${data.color}30` }}>
                <Icon className="h-7 w-7" style={{ color: data.color }} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ color: data.color, background: `${data.color}14`, border: `1px solid ${data.color}25` }}>
                {data.badge}
              </span>
            </div>

            <h1 className="text-4xl font-black text-white sm:text-5xl lg:text-6xl mb-6 leading-tight">
              {data.title}
            </h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-2xl">{data.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats row (full features only) */}
      {full && (
        <section className="border-y border-white/5 py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {full.stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: full.color }}>{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content sections */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {full?.sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-3xl p-8 lg:p-10"
              style={{ border: `1px solid ${full.color}18` }}
            >
              <h2 className="text-2xl font-black text-white mb-4">{section.heading}</h2>
              <p className="text-white/55 leading-relaxed mb-6">{section.body}</p>
              {section.points && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.points.map((point, j) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: full.color }} />
                      <span className="text-sm text-white/65">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {mod && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-3xl p-8 lg:p-10" style={{ border: `1px solid ${mod.color}18` }}>
              <h2 className="text-2xl font-black text-white mb-4">What's Included</h2>
              <p className="text-white/55 leading-relaxed mb-6">{mod.desc}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {mod.points.map((point, j) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
                    <span className="text-sm text-white/65">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${data.bgGlow}, transparent)` }} />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-4">Ready to see it in action?</h2>
            <p className="text-white/45 mb-8">Book a free demo and see how REVENEX transforms your school operations.</p>
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${data.glow}` }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-8 py-4 rounded-2xl cursor-pointer"
              >
                Book Free Demo <ArrowRight className="h-4 w-4" />
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
