import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'wouter'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/lib/language-context'

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Personal identification information: name, email address, phone number, and designation.',
      'Institution details: school name, city, and number of students.',
      'Usage data: how you interact with the REVENEX platform, including pages visited and features used.',
      'Technical data: IP address, browser type, device information, and cookies.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To provide, operate, and improve the REVENEX platform and services.',
      'To process demo requests and communicate with you about the platform.',
      'To send product updates, service announcements, and support messages.',
      'To analyse usage patterns and improve user experience.',
      'To comply with legal obligations and enforce our Terms of Service.',
    ],
  },
  {
    title: '3. Data Storage & Security',
    content: [
      'All data is stored on Google Cloud infrastructure with enterprise-grade security.',
      'We use 256-bit AES encryption for data at rest and TLS 1.3 for data in transit.',
      'Access to personal data is strictly limited to authorised REVENEX personnel.',
      'We perform regular security audits and vulnerability assessments.',
      'Your institution\'s data is logically isolated from other institutions.',
    ],
  },
  {
    title: '4. Data Sharing',
    content: [
      'We do not sell, rent, or trade your personal information to third parties.',
      'We may share data with service providers (Google Cloud, Firebase, Twilio, Razorpay) strictly to deliver the REVENEX services.',
      'We may disclose data if required by law, court order, or government regulation.',
      'In the event of a merger or acquisition, user data may be transferred with prior notice.',
    ],
  },
  {
    title: '5. Cookies',
    content: [
      'We use strictly necessary cookies to operate the platform (e.g., session management).',
      'Analytics cookies may be used with your consent to improve user experience.',
      'You can manage cookie preferences through your browser settings.',
      'Disabling certain cookies may affect platform functionality.',
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      'Right to access: You may request a copy of your personal data held by us.',
      'Right to correction: You may request correction of inaccurate personal data.',
      'Right to deletion: You may request deletion of your account and associated data.',
      'Right to portability: You may request your data in a machine-readable format.',
      'To exercise any of these rights, contact us at team@revenex.in.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    content: [
      'REVENEX is intended for use by schools and educational institutions, not directly by children.',
      'Student data processed via REVENEX is done so on behalf of the institution, under their data protection obligations.',
      'We do not knowingly collect personal information directly from children under 13.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    content: [
      'We may update this Privacy Policy periodically.',
      'We will notify registered users of material changes via email.',
      'Continued use of REVENEX after changes constitutes acceptance of the updated policy.',
      'We recommend reviewing this page periodically for any changes.',
    ],
  },
  {
    title: '9. Contact Us',
    content: [
      'REVENEX VENTURES PRIVATE LIMITED',
      'Email: team@revenex.in',
      'Phone: +91 90217 44355',
      'Address: Pune, Maharashtra, India',
    ],
  },
]

export default function PrivacyPolicy() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/">
              <span className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-aqua transition-colors cursor-pointer mb-8 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </span>
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white sm:text-5xl">Privacy Policy</h1>
                <p className="text-white/30 text-sm mt-1">Last updated: June 2026</p>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed mt-4">
              REVENEX VENTURES PRIVATE LIMITED ("REVENEX", "we", "us", or "our") is committed to protecting the privacy of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the REVENEX platform and services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl p-7"
              >
                <h2 className="text-lg font-bold text-white mb-4 text-aqua">{section.title}</h2>
                <ul className="space-y-2.5">
                  {section.content.map((item, j) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-aqua/50 mt-2 shrink-0" />
                      <p className="text-sm text-white/55 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 glass-card rounded-2xl p-6 border border-aqua/10 text-center"
          >
            <p className="text-sm text-white/40">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:team@revenex.in" className="text-aqua hover:underline">team@revenex.in</a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
