import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.security': 'Security',
    'nav.ourStory': 'Our Story',
    'nav.contact': 'Contact',
    'nav.bookDemo': 'Book a Demo',

    'hero.badge': 'School ERP Platform',
    'hero.title': 'Modern school management',
    'hero.titleHighlight': 'Made for India',
    'hero.titleEnd': 'Simple with REVENEX',
    'hero.subtitle': 'REVENEX is a secure cloud ERP that automates attendance, fees, communications, and reporting — trusted by schools.',
    'hero.cta.demo': 'Schedule a Demo',
    'hero.cta.explore': 'Explore Features',

    'features.title': 'Everything Your School Needs',
    'features.subtitle': 'Tools that make school administration simple and reliable',

    'why.title': 'Why Schools Choose REVENEX',
    'why.subtitle': 'Purpose-built for Indian educational institutions',
    'why.cloud': 'Cloud-First',
    'why.cloud.desc': 'Access from anywhere, anytime',
    'why.ai': 'AI-Powered',
    'why.ai.desc': 'Smart insights and automation',
    'why.secure': 'Enterprise Security',
    'why.secure.desc': 'Bank-grade data protection',
    'why.support': 'Fast Support',
    'why.support.desc': 'Quick response, dedicated team',
    'why.future': 'Future-Ready',
    'why.future.desc': 'Regular updates and new features',
    'why.bilingual': 'Bilingual',
    'why.bilingual.desc': 'Full English and Hindi support',

    'tech.title': 'Built on Enterprise Technology',
    'tech.subtitle': 'Powered by the world\'s best infrastructure',

    'security.title': 'Enterprise-Grade Security',
    'security.subtitle': 'Your data is protected by industry-leading security measures',
    'security.auth': 'Secure Authentication',
    'security.auth.desc': 'Multi-factor authentication and secure login',
    'security.role': 'Role-Based Access',
    'security.role.desc': 'Granular permissions and access control',
    'security.encryption': 'Data Encryption',
    'security.encryption.desc': 'End-to-end encryption for all data',
    'security.cloud': 'Cloud Security',
    'security.cloud.desc': 'Google Cloud infrastructure',
    'security.backup': 'Backup Systems',
    'security.backup.desc': 'Automated backups and disaster recovery',
    'security.privacy': 'Privacy Protection',
    'security.privacy.desc': 'GDPR-compliant data handling',

    'cta.title': 'Transform Your Institution with Modern ERP Solutions',
    'cta.subtitle': 'Be among the first institutions to experience REVENEX',
    'cta.demo': 'Schedule a Demo',
    'cta.contact': 'Contact Team',

    'footer.company': 'REVENEX VENTURES PRIVATE LIMITED',
    'footer.tagline': 'Educational Technology Solutions',
    'footer.quickLinks': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.techPartners': 'Technology Partners',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.rights': 'All rights reserved',

    'contact.title': 'Get in Touch',
    'contact.subtitle': 'We\'d love to hear from you',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',
    'contact.info.email': 'Email Us',
    'contact.info.phone': 'Call Us',
    'contact.info.address': 'Visit Us',

    'demo.title': 'Book a Demo',
    'demo.subtitle': 'See REVENEX in Action',
    'demo.form.name': 'Your Name',
    'demo.form.school': 'School Name',
    'demo.form.type': 'Institution Type',
    'demo.form.email': 'Email Address',
    'demo.form.phone': 'Phone Number',
    'demo.form.message': 'Additional Information',
    'demo.form.submit': 'Request Demo',
    'demo.types.school': 'School',
    'demo.types.college': 'College',
    'demo.types.coaching': 'Coaching Institute',
    'demo.types.other': 'Other',

    'about.title': 'About REVENEX',
    'about.subtitle': 'Building Educational Technology for Indian Institutions',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To empower educational institutions with intelligent, accessible, and affordable technology solutions.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To become the most trusted EdTech partner for educational institutions across India.',

    'story.title': 'Our Story',
    'story.subtitle': 'The journey of REVENEX — from idea to platform',

    'chatbot.title': 'REVENEX Assistant',
    'chatbot.greeting': 'Hello! How can I help you today?',
    'chatbot.placeholder': 'Type your message...',

    'founders.title': 'Meet the Founders',
    'founders.subtitle': 'The team building REVENEX',
  },
  hi: {
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.security': 'सुरक्षा',
    'nav.ourStory': 'हमारी कहानी',
    'nav.contact': 'संपर्क',
    'nav.bookDemo': 'डेमो बुक करें',

    'hero.badge': 'स्कूल ERP प्लेटफॉर्म',
    'hero.title': 'आधुनिक स्कूल प्रबंधन,',
    'hero.titleHighlight': 'भारत के लिए निर्मित,',
    'hero.titleEnd': 'REVENEX के साथ सरल बनें',
    'hero.subtitle': 'REVENEX एक सुरक्षित, क्लाउड-नेटिव ERP प्रदान करता है जो उपस्थिति, शुल्क, संचार और रिपोर्टिंग को स्वचालित करता है — भारतीय स्कूलों और शिक्षकों के लिए डिज़ाइन किया गया।',
    'hero.cta.demo': 'डेमो शेड्यूल करें',
    'hero.cta.explore': 'सुविधाएं देखें',

    'features.title': 'आपके स्कूल के लिए सब कुछ',
    'features.subtitle': 'स्कूल प्रशासन के हर पहलू को सरल बनाने के लिए डिज़ाइन किए गए उपकरणों का पूरा सेट',

    'why.title': 'स्कूल REVENEX क्यों चुनते हैं',
    'why.subtitle': 'भारतीय शैक्षणिक संस्थानों के लिए उद्देश्य-निर्मित',
    'why.cloud': 'क्लाउड-फर्स्ट',
    'why.cloud.desc': 'कहीं से भी, कभी भी एक्सेस करें',
    'why.ai': 'AI-संचालित',
    'why.ai.desc': 'स्मार्ट इनसाइट्स और ऑटोमेशन',
    'why.secure': 'एंटरप्राइज सुरक्षा',
    'why.secure.desc': 'बैंक-ग्रेड डेटा सुरक्षा',
    'why.support': 'तेज़ सपोर्ट',
    'why.support.desc': 'त्वरित प्रतिक्रिया, समर्पित टीम',
    'why.future': 'भविष्य के लिए तैयार',
    'why.future.desc': 'नियमित अपडेट और नई सुविधाएं',
    'why.bilingual': 'द्विभाषी',
    'why.bilingual.desc': 'पूर्ण अंग्रेजी और हिंदी सपोर्ट',

    'tech.title': 'एंटरप्राइज तकनीक पर निर्मित',
    'tech.subtitle': 'दुनिया के सर्वश्रेष्ठ इंफ्रास्ट्रक्चर द्वारा संचालित',

    'security.title': 'एंटरप्राइज-ग्रेड सुरक्षा',
    'security.subtitle': 'आपका डेटा उद्योग-अग्रणी सुरक्षा उपायों से सुरक्षित है',
    'security.auth': 'सुरक्षित प्रमाणीकरण',
    'security.auth.desc': 'मल्टी-फैक्टर प्रमाणीकरण और सुरक्षित लॉगिन',
    'security.role': 'रोल-आधारित एक्सेस',
    'security.role.desc': 'दानेदार अनुमतियां और एक्सेस कंट्रोल',
    'security.encryption': 'डेटा एन्क्रिप्शन',
    'security.encryption.desc': 'सभी डेटा के लिए एंड-टू-एंड एन्क्रिप्शन',
    'security.cloud': 'क्लाउड सुरक्षा',
    'security.cloud.desc': 'Google Cloud इंफ्रास्ट्रक्चर',
    'security.backup': 'बैकअप सिस्टम',
    'security.backup.desc': 'स्वचालित बैकअप और डिजास्टर रिकवरी',
    'security.privacy': 'गोपनीयता सुरक्षा',
    'security.privacy.desc': 'GDPR अनुपालक डेटा हैंडलिंग',

    'cta.title': 'आधुनिक ERP समाधानों के साथ अपने संस्थान को बदलें',
    'cta.subtitle': 'REVENEX का अनुभव करने वाले पहले संस्थानों में से एक बनें',
    'cta.demo': 'डेमो शेड्यूल करें',
    'cta.contact': 'टीम से संपर्क करें',

    'footer.company': 'REVENEX VENTURES PRIVATE LIMITED',
    'footer.tagline': 'शैक्षणिक प्रौद्योगिकी समाधान',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.legal': 'कानूनी',
    'footer.techPartners': 'प्रौद्योगिकी भागीदार',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'नियम और शर्तें',
    'footer.rights': 'सर्वाधिकार सुरक्षित',

    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'हम आपसे सुनना चाहेंगे',
    'contact.form.name': 'आपका नाम',
    'contact.form.email': 'ईमेल पता',
    'contact.form.phone': 'फ़ोन नंबर',
    'contact.form.message': 'आपका संदेश',
    'contact.form.submit': 'संदेश भेजें',
    'contact.info.email': 'ईमेल करें',
    'contact.info.phone': 'कॉल करें',
    'contact.info.address': 'हमसे मिलें',

    'demo.title': 'डेमो बुक करें',
    'demo.subtitle': 'REVENEX को कार्य में देखें',
    'demo.form.name': 'आपका नाम',
    'demo.form.school': 'स्कूल का नाम',
    'demo.form.type': 'संस्थान का प्रकार',
    'demo.form.email': 'ईमेल पता',
    'demo.form.phone': 'फ़ोन नंबर',
    'demo.form.message': 'अतिरिक्त जानकारी',
    'demo.form.submit': 'डेमो अनुरोध करें',
    'demo.types.school': 'स्कूल',
    'demo.types.college': 'कॉलेज',
    'demo.types.coaching': 'कोचिंग संस्थान',
    'demo.types.other': 'अन्य',

    'about.title': 'REVENEX के बारे में',
    'about.subtitle': 'भारतीय संस्थानों के लिए शैक्षणिक प्रौद्योगिकी का निर्माण',
    'about.mission.title': 'हमारा मिशन',
    'about.mission.desc': 'शैक्षणिक संस्थानों को बुद्धिमान, सुलभ और किफायती प्रौद्योगिकी समाधानों के साथ सशक्त बनाना।',
    'about.vision.title': 'हमारी दृष्टि',
    'about.vision.desc': 'पूरे भारत में शैक्षणिक संस्थानों के लिए सबसे विश्वसनीय EdTech भागीदार बनना।',

    'story.title': 'हमारी कहानी',
    'story.subtitle': 'REVENEX की यात्रा — विचार से प्लेटफॉर्म तक',

    'chatbot.title': 'Revenex सहायक',
    'chatbot.greeting': 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?',
    'chatbot.placeholder': 'अपना संदेश लिखें...',

    'founders.title': 'संस्थापकों से मिलें',
    'founders.subtitle': 'REVENEX बनाने वाली टीम',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('revenex-language') as Language
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('revenex-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
