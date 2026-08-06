import { Link } from 'wouter'
import { Sparkles, Linkedin, Mail } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'

const team = [
  {
    name: 'Rounak Sute',
    role: 'Chief Executive Officer (CEO)',
    roleHi: 'मुख्य कार्यकारी अधिकारी (CEO)',
    linkedin: 'https://www.linkedin.com/in/rounaksute/',
    bioEn: 'Rounak sets the company\'s vision and strategic direction, overseeing resource allocation, building the founding team, and representing Revenex to investors and partners to drive sustainable growth.',
    bioHi: 'रेवेनेक्स के विजन और रणनीतिक दिशा को तय करते हैं, टीम निर्माण, संसाधन आवंटन और निवेशकों के साथ साझेदारी का नेतृत्व करते हैं ताकि टिकाऊ विकास हो सके।',
    expertise: ['Strategic Vision', 'Resource Allocation', 'Team Leadership', 'Investor Relations', 'Client Strategy'],
    photo: '/Rounak.png?v=6',
    photoClass: 'scale-100',
    accentColor: '#C4722A',
    email: 'team@revenex.in'
  },
  {
    name: 'Rohan Raundal',
    role: 'Head of Finance',
    roleHi: 'वित्त प्रमुख',
    linkedin: 'https://www.linkedin.com/in/rohan-raundal/',
    bioEn: 'Rohan manages the financial operations of Revenex, including cash flow monitoring, financial planning, statutory compliance, payroll management, and delivering key insights for strategic decisions.',
    bioHi: 'रेवेनेक्स के वित्तीय संचालन का प्रबंधन करते हैं, जिसमें नकदी प्रवाह, बजट निर्माण, वित्तीय योजना, कर अनुपालन और सामरिक निर्णयों के लिए वित्तीय जानकारी देना शामिल है।',
    expertise: ['Financial Planning', 'Budgeting & Compliance', 'Cash Flow Monitoring', 'Payroll Operations', 'Fiscal Discipline'],
    photo: '/Rohan.png?v=6',
    photoClass: 'scale-100',
    accentColor: '#8B4513',
    email: 'team@revenex.in'
  },
  {
    name: 'Prasanna Mate',
    role: 'Technical Director',
    roleHi: 'तकनीकी निदेशक',
    linkedin: 'https://www.linkedin.com/in/prasanna-mate-a247b5328/',
    bioEn: 'Prasanna leads full-stack engineering, product design, and tool execution, focused on codebase integrity, scalable infrastructure deployment, and maintaining system reliability and quality.',
    bioHi: 'फुल-स्टैक इंजीनियरिंग, उत्पाद डिजाइन और उपकरण कार्यान्वयन का नेतृत्व करते हैं, जो कोडबेस अखंडता, स्केलेबल बुनियादी ढांचे और सिस्टम विश्वसनीयता पर केंद्रित है।',
    expertise: ['Product Engineering', 'System Architecture', 'Infrastructure Scaling', 'Quality Assurance', 'Troubleshooting'],
    photo: '/Prasanna.png?v=7',
    photoClass: 'scale-100',
    accentColor: '#166534',
    email: 'prasannamate1754@gmail.com'
  },
  {
    name: 'Isha Singh',
    role: 'Head of Marketing',
    roleHi: 'विपणन प्रमुख',
    linkedin: 'https://www.linkedin.com/company/revenex-ventures/',
    bioEn: 'Isha drives the marketing and brand-building strategies at Revenex, executing digital campaigns, conducting competitor analysis, and generating leads to communicate our core value proposition.',
    bioHi: 'रेवेनेक्स में विपणन और ब्रांड-निर्माण रणनीतियों का नेतृत्व करती हैं, जिसमें डिजिटल अभियान, प्रतिस्पर्धी विश्लेषण और मूल्य प्रस्ताव को संप्रेषित करने के लिए लीड उत्पन्न करना शामिल है।',
    expertise: ['Marketing Strategy', 'Brand Development', 'Campaign Management', 'Lead Generation', 'Market Research'],
    photo: '/Isha.png?v=7',
    photoClass: 'scale-100',
    accentColor: '#7C3AED',
    email: 'team@revenex.in'
  }
]

export default function OurTeam() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      {/* Responsive scroll track: sticky stacking on desktop, standard scroll flow on mobile */}
      <div className="relative md:min-h-[400vh] bg-[#F5F0E8]">
        {team.map((member, i) => (
          /* Sticky stack on desktop, natural page flow on mobile to prevent content cut-off */
          <section
            key={member.name}
            className="relative md:sticky top-0 min-h-screen md:h-screen w-full flex items-center justify-center bg-[#F5F0E8] overflow-y-auto md:overflow-hidden py-12 md:py-0 shadow-[-20px_-20px_100px_rgba(61,49,40,0.08)] border-t border-[#1A1410]/5"
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
                    className="group inline-flex items-center justify-between gap-6 px-6 py-2.5 rounded-full border border-[#E8E0D4] bg-[#F0E8DC] text-[#3D3128] hover:text-[#1A1410] transition-all cursor-pointer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = member.accentColor
                      e.currentTarget.style.boxShadow = `0 0 20px ${member.accentColor}15`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E8E0D4'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-semibold text-[#6B5D52] uppercase tracking-wider leading-none mb-0.5">Visit Profile</span>
                      <span className="text-xs font-extrabold text-[#1A1410]">LinkedIn Profile</span>
                    </div>
                    <span className="text-sm font-bold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: member.accentColor }}>↗</span>
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
                      background: `linear-gradient(to top, #F5F0E8 0%, transparent 22%), radial-gradient(circle at 50% 85%, ${member.accentColor}0a 0%, transparent 65%)`
                    }}
                  />

                  {/* Clean cutout image */}
                  <img
                    src={member.photo}
                    alt={member.name}
                    className={`max-w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 z-20 ${member.photoClass || 'scale-100'}`}
                    style={{
                      filter: `drop-shadow(0 20px 40px ${member.accentColor}10)`
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
