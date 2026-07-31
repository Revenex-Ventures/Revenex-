import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { ArrowRight, Linkedin, Mail, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const team = [
  {
    name: 'Rounak Vijay Sute',
    role: 'Founder & CEO',
    roleHi: 'संस्थापक और CEO',
    linkedin: 'https://www.linkedin.com/in/rounaksute/',
    bioEn: 'Leads product strategy, customer partnerships, and business growth to modernize school administration across India.',
    bioHi: 'स्कूल प्रशासन को आधुनिक बनाने के लिए उत्पाद रणनीति, व्यावसायिक विकास और ग्राहक भागीदारी का नेतृत्व करते हैं।',
    expertise: ['Product Strategy', 'EdTech Vision', 'Business Development', 'Partnerships'],
    photo: '/Rounak.jpg',
    accentColor: '#C4722A',
    email: 'team@revenex.in',
    bgClass: 'bg-[#1A1410]'
  },
  {
    name: 'Rohan Rajendra Raundal',
    role: 'Co-Founder',
    roleHi: 'सह-संस्थापक',
    linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
    bioEn: 'Leads engineering and platform architecture, focused on high-availability cloud infrastructure and AI systems.',
    bioHi: 'सह-संस्थापक। इंजीनियरिंग और प्लेटफ़ॉर्म आर्किटेक्चर का नेतृत्व करते हैं, विश्वसनीयता और स्केलेबिलिटी पर केंद्रित।',
    expertise: ['Cloud Architecture', 'Full-Stack Development', 'AI Systems', 'DevOps'],
    photo: '/Rohan.jpg',
    accentColor: '#8B4513',
    email: 'team@revenex.in',
    bgClass: 'bg-[#15110E]'
  },
  {
    name: 'Prasanna Mate',
    role: 'CTO',
    roleHi: 'CTO और सॉफ्टवेयर डेवलपर',
    linkedin: 'https://www.linkedin.com/in/prasanna-mate-a247b5328/',
    email: 'prasannamate1754@gmail.com',
    bioEn: 'Built the REVENEX platform from scratch. Oversees security audits, codebase integrity, and automated deployments.',
    bioHi: 'REVENEX प्लेटफॉर्म और वेबसाइट बनाईं। भरोसेमंद कोड, स्केलेबल सिस्टम और सुचारू तैनाती पर ध्यान।',
    expertise: ['Software Architecture', 'Database Tuning', 'System Security', 'ERP Deployments'],
    photo: '/Prasanna.jpg',
    accentColor: '#166534',
    bgClass: 'bg-[#100D0B]'
  }
]

export default function OurTeam() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen bg-[#1A1410] overflow-x-hidden">
      <Navbar />

      {/* Parent scroll container for stacking cards */}
      <div className="relative z-10">
        {team.map((member, i) => (
          <section
            key={member.name}
            className={`sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden ${member.bgClass} shadow-[-20px_-20px_100px_rgba(0,0,0,0.5)] border-t border-[#3D3128]/20`}
            style={{ zIndex: i + 1 }}
          >
            {/* Background elements */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none" style={{ background: `${member.accentColor}0a` }} />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Left Column: Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 lg:space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#EDE8E3]/10 bg-[#EDE8E3]/5">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: member.accentColor }} />
                  <span className="text-xs font-semibold text-[#EDE8E3]/70 uppercase tracking-widest">
                    {language === 'en' ? 'Our Team' : 'हमारी टीम'}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                    {member.name}
                  </h2>
                  <p className="text-lg lg:text-xl font-bold uppercase tracking-wide" style={{ color: member.accentColor }}>
                    {language === 'en' ? member.role : member.roleHi}
                  </p>
                </div>

                <p className="text-base sm:text-lg text-[#EDE8E3]/80 leading-relaxed max-w-xl">
                  {language === 'en' ? member.bioEn : member.bioHi}
                </p>

                {/* Expertise pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {member.expertise.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 rounded-full text-xs font-medium border border-[#EDE8E3]/10 bg-[#EDE8E3]/5 text-[#EDE8E3]/80 hover:text-white hover:border-[#EDE8E3]/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#EDE8E3]/10 bg-[#EDE8E3]/5 text-[#EDE8E3]/90 hover:text-white hover:border-[#EDE8E3]/30 hover:bg-[#EDE8E3]/10 transition-all font-semibold text-sm"
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                    LinkedIn
                  </a>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#EDE8E3]/10 bg-[#EDE8E3]/5 text-[#EDE8E3]/90 hover:text-white hover:border-[#EDE8E3]/30 hover:bg-[#EDE8E3]/10 transition-all font-semibold text-sm"
                    >
                      <Mail className="h-4.5 w-4.5" />
                      Email
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Right Column: Visual Photo */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center"
              >
                <div className="relative group max-w-[400px] lg:max-w-[450px] w-full">
                  {/* Photo frame glow */}
                  <div className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ background: member.accentColor }} />
                  
                  {/* Visual container */}
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#EDE8E3]/10 bg-[#EDE8E3]/5 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700"
                      style={{ objectPosition: member.name === 'Prasanna Mate' ? '50% 15%' : 'top' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/10 to-transparent opacity-60" />
                  </div>
                </div>
              </motion.div>

            </div>
          </section>
        ))}
      </div>

      <Footer />
      <Chatbot />
    </main>
  )
}
