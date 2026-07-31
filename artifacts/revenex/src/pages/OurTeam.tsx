import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Linkedin, Mail, Sparkles } from 'lucide-react'
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
    accentColor: '#8B4513',
    email: 'team@revenex.in'
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
    accentColor: '#C4722A',
    email: 'team@revenex.in'
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
    accentColor: '#166534'
  }
]

export default function OurTeam() {
  const { language, t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track the scroll of the entire 300vh section
  const { scrollYProgress } = useScroll({
    target: containerRef
  })

  // CEO Rounak (Person 1)
  const opacity0 = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0])
  const y0 = useTransform(scrollYProgress, [0, 0.25, 0.33], [0, 0, -80])
  const pointerEvents0 = useTransform(scrollYProgress, [0, 0.25, 0.33], ["auto", "auto", "none"])

  // Co-Founder Rohan (Person 2)
  const opacity1 = useTransform(scrollYProgress, [0.25, 0.33, 0.58, 0.66], [0, 1, 1, 0])
  const y1 = useTransform(scrollYProgress, [0.25, 0.33, 0.58, 0.66], [80, 0, 0, -80])
  const pointerEvents1 = useTransform(scrollYProgress, [0.25, 0.33, 0.58, 0.66], ["none", "auto", "auto", "none"])

  // CTO Prasanna (Person 3)
  const opacity2 = useTransform(scrollYProgress, [0.58, 0.66, 0.85, 1], [0, 1, 1, 1])
  const y2 = useTransform(scrollYProgress, [0.58, 0.66, 0.85, 1], [80, 0, 0, 0])
  const pointerEvents2 = useTransform(scrollYProgress, [0.58, 0.66, 0.85, 1], ["none", "auto", "auto", "auto"])

  const opacities = [opacity0, opacity1, opacity2]
  const ys = [y0, y1, y2]
  const pointerEventsList = [pointerEvents0, pointerEvents1, pointerEvents2]

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* 300vh scroll track */}
      <div ref={containerRef} className="relative min-h-[300vh]">
        
        {/* Sticky single viewport - stays stable as user scrolls */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#F5F0E8]">
          <div className="absolute inset-0 hero-glow opacity-30 pointer-events-none" />
          
          <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full h-full flex items-center justify-center">
            {team.map((member, i) => {
              const opacity = opacities[i]
              const y = ys[i]
              const pointerEvents = pointerEventsList[i]

              return (
                <motion.div
                  key={member.name}
                  style={{ opacity, y, pointerEvents }}
                  className="absolute inset-x-6 sm:inset-x-8 lg:inset-x-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                  
                  {/* Left Column: Details */}
                  <div className="space-y-6 lg:space-y-8 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC]">
                      <Sparkles className="h-3.5 w-3.5" style={{ color: member.accentColor }} />
                      <span className="text-xs font-semibold text-[#3D3128] uppercase tracking-widest">
                        {language === 'en' ? 'Our Team' : 'हमारी टीम'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1410] leading-tight">
                        {member.name}
                      </h2>
                      <p className="text-lg lg:text-xl font-bold uppercase tracking-wide" style={{ color: member.accentColor }}>
                        {language === 'en' ? member.role : member.roleHi}
                      </p>
                    </div>

                    <p className="text-base sm:text-lg text-[#3D3128] leading-relaxed max-w-xl">
                      {language === 'en' ? member.bioEn : member.bioHi}
                    </p>

                    {/* Expertise pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {member.expertise.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-3 py-1 rounded-full text-xs font-medium border border-[#E8E0D4] bg-[#F0E8DC] text-[#3D3128] hover:text-[#1A1410] hover:border-[#1A1410]/20 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#E8E0D4] bg-[#F0E8DC] text-[#3D3128] hover:text-[#1A1410] hover:border-[#1A1410]/20 transition-all font-semibold text-sm"
                      >
                        <Linkedin className="h-4.5 w-4.5" />
                        LinkedIn
                      </a>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#E8E0D4] bg-[#F0E8DC] text-[#3D3128] hover:text-[#1A1410] hover:border-[#1A1410]/20 transition-all font-semibold text-sm"
                        >
                          <Mail className="h-4.5 w-4.5" />
                          Email
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Photo sitting freely on background */}
                  <div className="flex justify-center">
                    <div className="relative group max-w-[380px] lg:max-w-[420px] w-full">
                      {/* Image sits freely, no card border or containers */}
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full aspect-[4/5] rounded-[2.5rem] object-cover object-top shadow-[0_20px_50px_rgba(139,69,19,0.08)] hover:scale-[1.02] transition-transform duration-500"
                        style={{ objectPosition: member.name === 'Prasanna Mate' ? '50% 15%' : 'top' }}
                      />
                    </div>
                  </div>

                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </main>
  )
}
