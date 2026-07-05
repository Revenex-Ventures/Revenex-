import { motion } from 'framer-motion'
import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'wouter'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the REVENEX platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
      'If you do not agree with any of these terms, you are prohibited from using or accessing REVENEX.',
      'These Terms apply to all users, including school administrators, teachers, and staff.',
      'REVENEX reserves the right to update these Terms at any time without prior notice.',
    ],
  },
  {
    title: '2. Use of the Platform',
    content: [
      'REVENEX grants you a limited, non-exclusive, non-transferable licence to use the platform for your institution\'s legitimate educational administration purposes.',
      'You are responsible for maintaining the confidentiality of your login credentials.',
      'You agree not to share your account credentials with unauthorised individuals.',
      'You may not use the platform for any unlawful purpose or in a way that could harm REVENEX or other users.',
      'Automated access, scraping, or reverse engineering of the platform is strictly prohibited.',
    ],
  },
  {
    title: '3. Data Ownership',
    content: [
      'Your institution retains full ownership of all data entered into the REVENEX platform.',
      'REVENEX processes your data solely to provide the services described in the platform.',
      'Upon termination of your account, you may request a complete export of your data.',
      'REVENEX will not use your institutional data for advertising or sell it to third parties.',
    ],
  },
  {
    title: '4. Subscription and Payments',
    content: [
      'REVENEX is offered on a subscription basis. Pricing details are available upon request.',
      'All payments are processed securely through Razorpay.',
      'Subscription fees are billed in advance for the selected billing period.',
      'Refunds are subject to our refund policy, available on request at team@revenex.in.',
      'REVENEX reserves the right to change pricing with 30 days\' notice.',
    ],
  },
  {
    title: '5. Service Availability',
    content: [
      'REVENEX targets 99.9% uptime on an annual basis, excluding scheduled maintenance windows.',
      'We will provide advance notice of scheduled maintenance where possible.',
      'REVENEX is not liable for downtime caused by factors outside our reasonable control (force majeure, third-party outages, etc.).',
      'We do not guarantee uninterrupted, error-free service.',
    ],
  },
  {
    title: '6. Intellectual Property',
    content: [
      'The REVENEX platform, including all software, design, and content, is owned by REVENEX VENTURES PRIVATE LIMITED.',
      'You may not copy, modify, distribute, or create derivative works of the REVENEX platform.',
      'Your institution\'s name, logo, and data remain your property.',
      'Feedback and suggestions submitted by users may be incorporated into the platform without compensation.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'REVENEX is provided "as is" without warranties of any kind, express or implied.',
      'REVENEX\'s total liability to you shall not exceed the subscription fees paid in the 3 months preceding the claim.',
      'REVENEX is not liable for indirect, incidental, special, or consequential damages.',
      'We are not responsible for data loss due to user error, third-party outages, or force majeure events.',
    ],
  },
  {
    title: '8. Termination',
    content: [
      'Either party may terminate the agreement with 30 days\' written notice.',
      'REVENEX may immediately suspend or terminate your account for breach of these Terms.',
      'Upon termination, your access will be revoked and your data will be retained for 30 days before deletion.',
      'You may export your data at any time before or during the 30-day retention window.',
    ],
  },
  {
    title: '9. Governing Law',
    content: [
      'These Terms are governed by the laws of India.',
      'Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.',
      'For any disputes or concerns, please first contact us at team@revenex.in to seek an amicable resolution.',
    ],
  },
  {
    title: '10. Contact',
    content: [
      'REVENEX VENTURES PRIVATE LIMITED',
      'Email: team@revenex.in',
      'Phone: +91 90217 44355',
      'Address: Pune, Maharashtra, India',
    ],
  },
]

export default function Terms() {
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
                <FileText className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white sm:text-5xl">Terms of Service</h1>
                <p className="text-white/30 text-sm mt-1">Last updated: June 2026</p>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed mt-4">
              Please read these Terms of Service carefully before using the REVENEX platform operated by REVENEX VENTURES PRIVATE LIMITED. These Terms govern your access to and use of the REVENEX school ERP platform and services.
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
                <h2 className="text-lg font-bold text-aqua mb-4">{section.title}</h2>
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
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:team@revenex.in" className="text-aqua hover:underline">team@revenex.in</a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
