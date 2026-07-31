import { Link } from 'wouter'
import { Sparkles, Linkedin, Mail } from 'lucide-react'
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
    bioEn: 'Leads product strategy, business growth, and customer partnerships to modernize school administration across India.',
    bioHi: 'स्कूल प्रशासन को आधुनिक बनाने के लिए उत्पाद रणनीति, व्यावसायिक विकास और ग्राहक भागीदारी का नेतृत्व करते हैं।',
    expertise: ['Product Strategy', 'EdTech Vision', 'Business Development', 'Partnerships'],
    photo: '/Rounak.png?v=6',
    accentColor: '#C4722A',
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
    photo: '/Rohan.png?v=6',
    accentColor: '#8B4513',
    email: 'team@revenex.in'
  },
  {
    name: 'Prasanna Mate',
    role: 'CTO',
    roleHi: 'CTO और सॉफ्टवेयर डेवलपर',
    linkedin: 'https://www.linkedin.com/in/prasanna-mate-a247b5328/',
    bioEn: 'Built the REVENEX platform from scratch. Oversees security audits, codebase integrity, and automated deployments.',
    bioHi: 'REVENEX प्लेटफॉर्म और वेबसाइट बनाईं। भरोसेमंद कोड, स्केलेबल सिस्टम और सुचारू तैनाती पर ध्यान।',
    expertise: ['Software Architecture', 'Database Tuning', 'System Security', 'ERP Deployments'],
    photo: '/Prasanna.png?v=6',
    accentColor: '#166534',
    email: 'prasannamate1754@gmail.com'
  }
]

export default function OurTeam() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      {/* 300vh scroll track */}
      <div className="relative min-h-[300vh] bg-[#F5F0E8]">
        {team.map((member, i) => (
          /* Sticky single viewport - slides over previous ones natively */
          <section
            key={member.name}
            className="sticky top-0 h-screen w-full flex items-center justify-center bg-[#F5F0E8] overflow-hidden shadow-[-20px_-20px_100px_rgba(61,49,40,0.08)] border-t border-[#1A1410]/5"
            style={{ zIndex: i + 1 }}
          >
            {/* Background elements */}
            <div className="absolute inset-0 hero-glow opacity-30 pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
              
              {/* Left Column: Details */}
              <div className="space-y-6 lg:space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC]">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: member.accentColor }} />
                  <span className="text-xs font-semibold text-[#3D3128] uppercase tracking-widest">
                    {language === 'en' ? 'Our Team' : 'हमारी टीम'}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1410] leading-tight font-display tracking-tight">
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

                {/* Social Actions */}
                <div className="flex items-center gap-4 pt-4">
                  {/* LinkedIn Pill Link */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between gap-6 px-6 py-2.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] text-[#3D3128] hover:text-[#1A1410] hover:border-[#C4722A] hover:shadow-[0_0_20px_rgba(196,114,42,0.1)] transition-all cursor-pointer"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-semibold text-[#6B5D52] uppercase tracking-wider leading-none mb-0.5">Visit Profile</span>
                      <span className="text-xs font-extrabold text-[#1A1410]">LinkedIn Profile</span>
                    </div>
                    <span className="text-sm font-bold text-[#C4722A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </a>

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#3D3128] hover:text-[#1A1410] transition-colors"
                    >
                      <Mail className="h-4.5 w-4.5" />
                      {language === 'en' ? 'Contact Direct' : 'सीधे संपर्क करें'}
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Photo sitting freely on background */}
              <div className="flex justify-center">
                <div className="relative group max-w-[380px] lg:max-w-[420px] w-full aspect-[4/5] flex items-center justify-center">
                  
                  {/* Glow overlay backing the silhouette */}
                  <div 
                    className="absolute inset-[-50px] rounded-[2rem] pointer-events-none z-10 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to top, #F5F0E8 0%, transparent 22%), radial-gradient(circle at 50% 85%, rgba(196, 114, 42, 0.06) 0%, transparent 65%)`
                    }}
                  />

                  {/* Clean cutout image */}
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="max-w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 z-20"
                    style={{
                      filter: `drop-shadow(0 20px 40px rgba(139, 69, 19, 0.06))`
                    }}
                  />
                </div>
              </div>

            </div>
          </section>
        ))}
      </div>

      <Footer />
      <Chatbot />
    </main>
  )
}
