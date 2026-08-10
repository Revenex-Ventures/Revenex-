import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import { useLanguage } from '@/lib/language-context'
import { 
  Zap, Shield, TrendingUp, ArrowRight, Sparkles, Languages, Users, CreditCard, BarChart3, MapPin
} from 'lucide-react'

// English and Hindi copy matching the layout structures in the shared image reference
const content = {
  en: {
    subAbout: "• ABOUT REVENEX",
    heroTitle: "The home of school management.",
    heroItalic: "If a school runs in India — we streamline and secure it with our School ERP system, with AI integration at the best price.",
    
    // Stop being a basic school card content
    badgeText: "STOP USING BROKEN EXCEL SHEETS",
    cardHeading: "GET GLOBALLY TRUSTED BILINGUAL ERP & GEMINI AI ANALYTICS AT THE BEST PRICE IN INDIA",
    bullets: [
      { text: "India's 1st Bilingual School ERP (English & Hindi)", icon: Languages },
      { text: "48-Hour Setup & Free Data Migration", icon: Zap },
      { text: "100% Secure, Encrypted Cloud Hosting", icon: Shield },
      { text: "Razorpay Payments & Fee Collections", icon: TrendingUp }
    ],
    qrTitle: "Scan QR To Demo App And",
    qrSub: "Claim Your 14-Day Free Trial",
    availableFor: "AVAILABLE FOR",
    
    // Innovation section content
    subInnovation: "• INDIA-FIRST INNOVATION",
    innovationTitle: "We came, we saw, we modernized the system.",
    innovationItalic: "Empowering CBSE, ICSE, and State Board schools across Bharat.",
    innovationDesc: "When we pitched REVENEX to school administrators, they saw what parents and teachers already knew — that school operations don't need to be complex. A reliable, affordable, and AI-enabled ERP is the future of education management.",
    
    innovationCards: [
      {
        title: "AI Analytics by Gemini",
        desc: "Instant insights on fee defaults, academic performance, and class attendance patterns.",
        badge: "Smart Reports"
      },
      {
        title: "Bilingual Mobile Portal",
        desc: "Bringing parent engagement closer with real-time WhatsApp updates in English and Hindi.",
        badge: "Bilingual Hub"
      },
      {
        title: "48-Hour Rapid Onboarding",
        desc: "Fully loaded ERP with automated spreadsheet migration and fee templates in 2 days.",
        badge: "Instant Setup"
      }
    ],

    // Timeline section content
    timelineSub: "• INTERACTIVE SHOWCASE",
    timelineTitle: "A Day in the Life of a Smart School",
    timelineDesc: "See how REVENEX automates operations from morning gate entry to evening executive briefs."
  },
  hi: {
    subAbout: "• रेवेनेक्स के बारे में",
    heroTitle: "स्कूल प्रबंधन का घर।",
    heroItalic: "यदि भारत में कोई स्कूल चलता है — तो हम उसे अपने स्कूल ईआरपी सिस्टम (एआई एकीकरण के साथ) से व्यवस्थित और सुरक्षित करते हैं, वह भी सबसे अच्छे दाम में।",
    
    // Stop being a basic school card content
    badgeText: "टूटी हुई एक्सेल शीट्स का उपयोग बंद करें",
    cardHeading: "भारत में सर्वोत्तम मूल्य पर वैश्विक स्तर पर विश्वसनीय द्विभाषी ईआरपी और जेमिनी एआई विश्लेषिकी प्राप्त करें",
    bullets: [
      { text: "भारत का पहला द्विभाषी स्कूल ईआरपी (अंग्रेजी और हिंदी)", icon: Languages },
      { text: "48 घंटे का सेटअप और मुफ्त डेटा माइग्रेशन", icon: Zap },
      { text: "100% सुरक्षित, एन्क्रिप्टेड क्लाउड होस्टिंग", icon: Shield },
      { text: "रेज़रपे भुगतान और स्मार्ट शुल्क संग्रह", icon: TrendingUp }
    ],
    qrTitle: "डेमो ऐप के लिए क्यूआर स्कैन करें",
    qrSub: "और अपने 14 दिनों के मुफ़्त परीक्षण का दावा करें",
    availableFor: "उपलब्ध है",
    
    // Innovation section content
    subInnovation: "• भारत-प्रथम नवाचार",
    innovationTitle: "हम आए, हमने देखा, हमने सिस्टम को आधुनिक बनाया।",
    innovationItalic: "पूरे भारत में CBSE, ICSE और स्टेट बोर्ड स्कूलों को सशक्त बनाना।",
    innovationDesc: "जब हमने स्कूल प्रशासकों के सामने REVENEX को प्राप्त कराया, तो उन्होंने वही देखा जो अभिभावक और शिक्षक पहले से जानते थे — कि स्कूल संचालन को जटिल होने की आवश्यकता नहीं है। एक विश्वसनीय, किफायती और AI-सक्षम ERP ही शिक्षा प्रबंधन का भविष्य है।",
    
    innovationCards: [
      {
        title: "जेमिनी द्वारा संचालित एआई विश्लेषण",
        desc: "शुल्क बकाया, शैक्षणिक प्रदर्शन और वर्ग उपस्थिति पैटर्न पर त्वरित रिपोर्ट प्राप्त करें।",
        badge: "स्मार्ट रिपोर्ट"
      },
      {
        title: "द्विभाषी मोबाइल पोर्टल",
        desc: "अंग्रेजी और हिंदी में त्वरित व्हाट्सएप अपडेट के साथ माता-पिता की भागीदारी बढ़ाएं।",
        badge: "द्विभाषी हब"
      },
      {
        title: "48-घंटे रैपिड ऑनबोर्डिंग",
        desc: "2 दिनों में स्वचालित स्प्रेडशीट माइग्रेशन और पूर्व-निर्मित शुल्क टेम्पलेट्स के साथ लाइव जाएं।",
        badge: "त्वरित सेटअप"
      }
    ],

    // Timeline section content
    timelineSub: "• इंटरैक्टिव शोकेस",
    timelineTitle: "एक स्मार्ट स्कूल का एक दिन",
    timelineDesc: "देखें कि कैसे रेवेनेक्स सुबह गेट प्रवेश से लेकर शाम की कार्यकारी रिपोर्ट तक सभी कार्यों को स्वचालित करता है।"
  }
}

export default function About() {
  const { language } = useLanguage()
  const tCopy = content[language] || content.en
  const [activeTab, setActiveTab] = useState(0)

  const timelineItems = [
    {
      time: "07:30 AM",
      title: language === 'en' ? "Automated Gate Entry" : "स्वचालित गेट प्रवेश",
      desc: language === 'en' ? "Biometric scanners track student arrival. Instant, secure notifications dispatch to parents' phones." : "बायोमेट्रिक स्कैनर छात्रों के प्रवेश को ट्रैक करते हैं। अभिभावकों को तुरंत सूचना भेजी जाती है।",
      badge: language === 'en' ? "Attendance Active" : "उपस्थिति सक्रिय",
      icon: Users,
      explanation: {
        badge: language === 'en' ? "Gate Control" : "गेट नियंत्रण",
        title: language === 'en' ? "Bilingual Entry Scanner" : "द्विभाषी प्रवेश स्कैनर",
        bullets: language === 'en' ? [
          "Tracks student check-ins instantly via RFID or biometric devices.",
          "Updates class registers in real-time without teacher intervention.",
          "Dispatches direct WhatsApp arrival alerts to parents."
        ] : [
          "आरएफआईडी या बायोमेट्रिक उपकरणों के माध्यम से छात्रों के प्रवेश को ट्रैक करता है।",
          "शिक्षकों के बिना वास्तविक समय में कक्षा रजिस्टर अपडेट करता है।",
          "अभिभावकों को सीधे व्हाट्सएप आगमन अलर्ट भेजता है।"
        ],
        insight: language === 'en' 
          ? "Eliminates gate queues entirely, reducing delays by up to 42%." 
          : "गेट की लाइनों को पूरी तरह से समाप्त करता है, देरी को 42% तक कम करता है।"
      },
      preview: (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[10px] font-black tracking-widest text-[#FF453A] uppercase">LIVE STREAM: GATE ENTRY SCANS</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">ONLINE</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Live scans list */}
            <div className="md:col-span-7 bg-[#1C1612] border border-white/5 rounded-2xl p-4 space-y-3">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block mb-1">Recent check-ins</span>
              <div className="space-y-2">
                {[
                  { name: "Rohan Raundal", class: "Class X-A", time: "07:28 AM", status: "On Time", statusColor: "text-green-400" },
                  { name: "Rounak Sute", class: "Class X-B", time: "07:29 AM", status: "On Time", statusColor: "text-green-400" },
                  { name: "Prasanna Mate", class: "Class IX-C", time: "07:30 AM", status: "Late Entry", statusColor: "text-amber-400" },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/30 p-2.5 rounded-lg border border-white/5 text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-center justify-center font-bold text-white text-[8px]">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-[8px] text-white/40">{s.class}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 font-mono">{s.time}</div>
                      <div className={`text-[8px] font-bold ${s.statusColor}`}>{s.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp notification simulation */}
            <div className="md:col-span-5 flex flex-col justify-between bg-[#0B141A] border border-emerald-950/30 rounded-2xl p-4 shadow-lg text-left">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950/50">
                <span className="text-[8px] text-emerald-400 font-black tracking-widest uppercase">WhatsApp Gateway</span>
                <span className="text-[7px] text-emerald-400 font-semibold bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-900/30">DISPATCHED</span>
              </div>
              <div className="flex-1 flex flex-col justify-center py-4">
                <div className="bg-[#1F2C34] text-white p-3 rounded-lg rounded-tl-none border border-[#2b3941] text-[10px] space-y-1.5 max-w-[180px] self-start relative">
                  <div className="text-[7px] text-emerald-400 font-bold">REVENEX ALERTS</div>
                  <p className="leading-relaxed text-white/90">
                    "Dear Parent, <b>Rohan</b> has scanned in at the school gate at <b>07:28 AM</b>. Status: <b>Present</b>."
                  </p>
                  <span className="text-[6px] text-white/30 text-right block font-mono">07:28 AM</span>
                </div>
              </div>
              <p className="text-[8px] text-white/30 italic">
                * Automatic alerts sent to parents' verified mobile numbers instantly.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      time: "10:00 AM",
      title: language === 'en' ? "Gemini AI Document Parsing" : "जेमिनी एआई दस्तावेज़ पार्सिंग",
      desc: language === 'en' ? "New admissions are processed automatically. Upload a stack of PDFs and watch Gemini classify and extract student data." : "नए दाखिले अपने आप प्रोसेस होते हैं। पीडीएफ अपलोड करें और जेमिनी डेटा एक्सट्रैक्ट कर देगा।",
      badge: language === 'en' ? "AI Engine Running" : "एआई इंजन सक्रिय",
      icon: Sparkles,
      explanation: {
        badge: language === 'en' ? "AI Admissions" : "एआई प्रवेश",
        title: language === 'en' ? "Gemini Document OCR" : "जेमिनी दस्तावेज़ ओसीआर",
        bullets: language === 'en' ? [
          "Parses multi-format document uploads like PDF birth certificates.",
          "Extracts fields (names, DOB, addresses) with 99%+ accuracy.",
          "Populates student profiles automatically for review."
        ] : [
          "पीडीएफ जन्म प्रमाण पत्र जैसे विभिन्न दस्तावेजों को स्वचालित रूप से पार्स करता है।",
          "99%+ सटीकता के साथ नाम, जन्म तिथि, और पते जैसे विवरण निकालता है।",
          "समीक्षा के लिए छात्र प्रोफाइल को स्वचालित रूप से भरता है।"
        ],
        insight: language === 'en' 
          ? "Reduces average administrative processing time from 15 minutes to 45 seconds per profile." 
          : "औसत प्रशासनिक प्रसंस्करण समय को प्रति प्रोफाइल 15 मिनट से घटाकर 45 सेकंड कर देता है।"
      },
      preview: (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[10px] font-black tracking-widest text-[#FF453A] uppercase">ADMISSIONS PIPELINE & GEMINI OCR</span>
            <span className="text-purple-400 text-xs font-bold">✨ AI ACTIVE</span>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Input scan file simulation */}
            <div className="md:col-span-5 bg-[#1C1612] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block mb-2">Uploaded Document</span>
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500">
                    <span className="font-bold text-xs">PDF</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-white truncate">Birth_Certificate.pdf</div>
                    <div className="text-[8px] text-white/40">1.4 MB • Uploaded today</div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] text-white/40">OCR Status:</div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Classification Success
                </div>
              </div>
            </div>

            {/* Extracted form data */}
            <div className="md:col-span-7 bg-[#1C1612] border border-white/5 rounded-2xl p-4 space-y-4 text-left">
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Extracted data summary</span>
              <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-purple-900/30">
                {[
                  { field: "Student Name", value: "Rounak Vijay Sute", conf: "99.8% confidence" },
                  { field: "Father's Name", value: "Vijay Sute", conf: "99.7% confidence" },
                  { field: "Date of Birth", value: "17th July 2018", conf: "100% confidence" },
                  { field: "Extracted Address", value: "Kothrud, Pune, Maharashtra", conf: "98.9% confidence" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] py-1 border-b border-white/5 last:border-b-0">
                    <div>
                      <div className="text-white/40 text-[8px] font-bold uppercase">{row.field}</div>
                      <div className="text-white font-semibold">{row.value}</div>
                    </div>
                    <div className="text-emerald-400 text-[8px] font-bold bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-900/30">{row.conf}</div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold transition-all shadow-md">
                Approve & Sync to Student Records
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      time: "01:30 PM",
      title: language === 'en' ? "Seamless UPI Settlements" : "सहज यूपीआई भुगतान",
      desc: language === 'en' ? "Razorpay API automatically records fee collections. No manual receipts or cash counting errors." : "रेज़रपे एपीआई स्वचालित रूप से शुल्क रिकॉर्ड करता है। कोई मैन्युअल रसीद या नकदी गणना की गलती नहीं।",
      badge: language === 'en' ? "Ledger Verified" : "बहीखाता सत्यापित",
      icon: CreditCard,
      explanation: {
        badge: language === 'en' ? "Payments Hub" : "भुगतान हब",
        title: language === 'en' ? "Automated Reconciliation" : "स्वचालित समाधान",
        bullets: language === 'en' ? [
          "Razorpay gateway handles fees, bus passes, and activities.",
          "Generates secure payment links sent via SMS/WhatsApp.",
          "Settles collections directly into the ledger in real-time."
        ] : [
          "रेज़रपे गेटवे फीस, बस पास और अन्य गतिविधियों का भुगतान संभालता है।",
          "एसएमएस/व्हाट्सएप के जरिए सुरक्षित भुगतान लिंक जनरेट करता है।",
          "संग्रह को सीधे वास्तविक समय में बहीखाते में जमा करता है।"
        ],
        insight: language === 'en' 
          ? "Zero billing mismatches or counting errors, streamlining auditors' reviews." 
          : "बिलिंग विसंगतियों या गिनती की त्रुटियों को पूरी तरह समाप्त कर ऑडिटर्स के काम को आसान बनाता है।"
      },
      preview: (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[10px] font-black tracking-widest text-[#FF453A] uppercase">RAZORPAY INTEGRATION & AUTO-SETTLEMENTS</span>
            <div className="text-xs text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Settle Target Met: 92%
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Live ledger stats */}
            <div className="md:col-span-5 bg-[#1C1612] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block mb-1">Settled Balance</span>
                <h3 className="text-2xl font-black text-[#F5F0E8] leading-none mb-1">₹1,84,200</h3>
                <p className="text-[9px] text-[#FF453A] font-bold">14 Online Payments Collected</p>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-white/5">
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF453A] h-full" style={{ width: '92%' }} />
                </div>
                <div className="flex justify-between text-[8px] text-white/40 font-bold">
                  <span>Target: ₹2,00,000</span>
                  <span>92% Collected</span>
                </div>
              </div>
            </div>

            {/* Transactions audit log */}
            <div className="md:col-span-7 bg-[#1C1612] border border-white/5 rounded-2xl p-4 space-y-3 text-left">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block">Live transaction settlements</span>
              <div className="space-y-2">
                {[
                  { id: "pay_N92jL0s1fM", parent: "Prasanna Mate", amount: "₹12,500", method: "UPI", date: "01:28 PM" },
                  { id: "pay_K83bS1e2gQ", parent: "Rohan Raundal", amount: "₹15,400", method: "Card", date: "01:14 PM" },
                  { id: "pay_R29mK4h8zW", parent: "Rounak Sute", amount: "₹12,500", method: "UPI", date: "01:05 PM" }
                ].map((t, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/30 p-2 border border-white/5 rounded-lg text-[9px]">
                    <div>
                      <div className="font-bold text-white">{t.parent}</div>
                      <div className="text-[7px] text-white/30 font-mono">{t.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-400">{t.amount}</div>
                      <div className="text-[7px] text-white/40">{t.method} • {t.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      time: "04:30 PM",
      title: language === 'en' ? "Daily AI briefings" : "दैनिक एआई ब्रीफिंग",
      desc: language === 'en' ? "At departure, Gemini compiles a complete visual operational report, delivered straight to the principal's dashboard." : "स्कूल बंद होने पर, जेमिनी एक संपूर्ण परिचालन रिपोर्ट तैयार करता है, जो सीधे प्रिंसिपल के डैशबोर्ड पर जाती है।",
      badge: language === 'en' ? "Summary Dispatched" : "सारांश भेजा गया",
      icon: BarChart3,
      explanation: {
        badge: language === 'en' ? "Exec Summary" : "कार्यकारी सारांश",
        title: language === 'en' ? "Gemini Daily Briefings" : "जेमिनी दैनिक रिपोर्ट",
        bullets: language === 'en' ? [
          "Compiles attendance records, fee settlements, and active tickets at day close.",
          "Generates conversational natural language summaries for administrators.",
          "Offers instant PDF downloads and team broadcast links."
        ] : [
          "दिन के अंत में उपस्थिति रिकॉर्ड, शुल्क भुगतान और सक्रिय टिकटों को संकलित करता है।",
          "प्रशासकों के लिए सरल भाषा में बातचीत जैसी रिपोर्ट तैयार करता है।",
          "त्वरित पीडीएफ डाउनलोड और टीम प्रसारण लिंक प्रदान करता है।"
        ],
        insight: language === 'en' 
          ? "Gives school principals 100% operations visibility in 30 seconds before school close." 
          : "स्कूल बंद होने से पहले 30 सेकंड में प्रिंसिपलों को संपूर्ण संचालन की दृश्यता देता है।"
      },
      preview: (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[10px] font-black tracking-widest text-[#FF453A] uppercase">GEMINI OPERATIONAL REPORT FOR PRINCIPALS</span>
            <span className="text-purple-400 text-xs font-bold">✨ READY FOR BROADCAST</span>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Daily stats summary cards */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              {[
                { label: "Attendance", value: "96.8%", change: "+1.2% vs yesterday", color: "text-emerald-400" },
                { label: "Fees Settled", value: "₹1.84 Lakh", change: "14 collections", color: "text-emerald-400" },
                { label: "Outbound Alerts", value: "1,248", change: "WhatsApp / SMS", color: "text-white" },
                { label: "AI Resolutions", value: "12", change: "Chatbot answers", color: "text-purple-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-[#1C1612] border border-white/5 p-3 rounded-xl text-left space-y-1">
                  <div className="text-white/40 text-[8px] font-bold uppercase">{stat.label}</div>
                  <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[7px] text-white/50">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* AI Insights block */}
            <div className="md:col-span-7 bg-[#1C1612] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-1.5 flex-1">
                <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>✨ Gemini Daily Briefing</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-purple-900/30">
                  "Today's school operations concluded successfully. Fee reconciliation target was met with <b>₹1,84,200</b> settled. No hardware connectivity failures reported. Outbound parent check-in notifications were sent to <b>1,248 parents</b> with a 99.8% delivery success rate."
                </p>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-bold border border-white/10 transition-all">
                  Download Exec PDF
                </button>
                <button className="flex-1 py-2 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white rounded-xl text-[9px] font-bold transition-all">
                  Broadcast to Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-x-hidden selection:bg-[#7C3D0F] selection:text-white">
      <Navbar />

      {/* ── SECTION 1: HERO & PREMIUM APP PROMOTION CARD ── */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="max-w-4xl mb-12">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-black tracking-[0.2em] text-[#3D3128]/60 uppercase mb-3"
          >
            {tCopy.subAbout}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#1A1410] tracking-tight leading-none mb-6"
          >
            {tCopy.heroTitle}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl font-serif italic text-[#7C3D0F] leading-relaxed max-w-3xl"
          >
            {tCopy.heroItalic}
          </motion.p>
        </div>

        {/* Black App Promotion Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-[#120E0A] text-white rounded-[2rem] p-8 lg:p-12 border border-[#8B4513]/25 shadow-2xl grid lg:grid-cols-12 gap-8 items-center relative overflow-hidden"
        >
          {/* Card background overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-[#8B4513]/10 to-transparent opacity-60 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-[#7C3D0F]/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Column: Core selling points */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="inline-block text-xs font-black tracking-widest text-[#FF453A] border border-[#FF453A]/30 bg-[#FF453A]/10 px-3 py-1 rounded-full uppercase">
              {tCopy.badgeText}
            </span>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F0E8] leading-tight tracking-tight">
              {tCopy.cardHeading}
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#F5F0E8]/10">
              {tCopy.bullets.map((bullet, i) => {
                const BulletIcon = bullet.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F0E8]/5 flex items-center justify-center border border-[#F5F0E8]/10 text-[#FF453A] shrink-0 mt-0.5">
                      <BulletIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-[#F5F0E8]/85 leading-tight font-medium">
                      {bullet.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Simulated Screen Mockup + QR Code */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            {/* CSS-designed Mobile Phone Mockup */}
            <div className="relative border-[6px] border-[#3D3128] rounded-[2rem] h-[280px] w-[140px] bg-[#120E0A] shadow-2xl overflow-hidden shrink-0">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-3.5 bg-black rounded-b-xl mx-auto w-16 z-20" />
              {/* Internal Screen Content */}
              <div className="h-full w-full p-2.5 pt-5 flex flex-col justify-between text-[8px] text-[#3D3128] font-sans bg-[#F5F0E8]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#E8E0D4] pb-1">
                  <span className="font-black text-[#1A1410] tracking-wide">REVENEX</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                {/* Dynamic Screen Data */}
                <div className="flex-1 py-1.5 space-y-1.5 overflow-hidden">
                  <div className="bg-white p-1 rounded-lg border border-[#E8E0D4] shadow-xs">
                    <div className="text-[6px] text-gray-500 font-medium">Fee Collection</div>
                    <div className="font-black text-[#7C3D0F] text-[10px]">₹12.45 Lakhs</div>
                    <div className="w-full bg-gray-100 h-1 rounded-full mt-0.5 overflow-hidden">
                      <div className="bg-[#7C3D0F] h-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="bg-white p-1 rounded-lg border border-[#E8E0D4] shadow-xs flex justify-between items-center">
                    <div>
                      <div className="text-[6px] text-gray-500 font-medium">Live Attendance</div>
                      <div className="font-black text-[#1A1410] text-[9px]">96.8%</div>
                    </div>
                    <div className="text-green-600 font-bold text-[6px]">ON TARGET</div>
                  </div>
                  <div className="bg-white/80 p-1.5 rounded-lg border border-purple-200 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0.5 right-0.5 text-[6px] text-purple-600">✨</div>
                    <div className="text-[5px] font-bold text-purple-700">Gemini Insight</div>
                    <p className="text-[5px] leading-tight text-gray-600">Fee arrears down 18%</p>
                  </div>
                </div>
                {/* Home Indicator */}
                <div className="w-10 h-0.5 bg-gray-400 rounded-full mx-auto" />
              </div>
            </div>

            {/* QR Code and App store buttons */}
            <div className="text-center sm:text-left space-y-4">
              <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border border-white/10">
                {/* Simulated QR Code via SVG */}
                <svg className="w-24 h-24 bg-white" viewBox="0 0 100 100">
                  <path d="M5 5h30v30H5zm0 60h30v30H5zm60 0h30v30H65zm0-60h30v30H65z" fill="#000"/>
                  <path d="M10 10h20v20H10zm0 60h20v20H10zm60 0h20v20H60zm0-60h20v20H60z" fill="#fff"/>
                  <path d="M15 15h10v10H15zm0 60h10v10H15zm60 0h10v10H75zm0-60h10v10H75z" fill="#000"/>
                  {/* Random squares in the body */}
                  <path d="M40 5h10v10H40zm15 0h10v20H55zm-15 20h20v10H40zm0 15h10v10H40zm15 0h10v25H55zm-15 35h10v10H40zm15 15h10v10H55zm20-30h15v10H75zm10-15h10v10H85zm-15-10h10v10H70zm20 35h10v10H90zm-15 15h15v10H75z" fill="#000"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-[#F5F0E8]/70 font-semibold tracking-wide uppercase leading-tight">
                  {tCopy.qrTitle}
                </p>
                <p className="text-xs text-white font-bold mb-3">
                  {tCopy.qrSub}
                </p>
                
                <span className="text-[9px] text-[#F5F0E8]/50 block mb-2 font-black tracking-widest uppercase">
                  {tCopy.availableFor}
                </span>
                
                {/* Custom app badges */}
                <div className="flex gap-2 justify-center sm:justify-start">
                  <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-white/10 transition-colors">
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.12.3.12.9 0 2.02-.62 2.51-1.45"/>
                    </svg>
                    <span className="text-[8px] font-black tracking-wider uppercase text-white">App Store</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-white/10 transition-colors">
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.25 2.3c-.15.15-.25.38-.25.68v18.04c0 .3.1.53.25.68l.06.06L13.7 11.95v-.2L3.31 2.24l-.06.06zM17.15 8.5l-3.45 3.45v.2l3.45 3.45.06-.03 4.08-2.32c1.17-.66 1.17-1.75 0-2.42l-4.08-2.32-.06-.03zM13.7 11.75L3.62 1.66c-.36-.36-.96-.13-1.16.4l11.24 9.69zM13.7 12.25L2.46 21.94c.2.53.8.76 1.16.4l10.08-10.09z"/>
                    </svg>
                    <span className="text-[8px] font-black tracking-wider uppercase text-white">Google Play</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 2: INNOVATION / SHARK-TANK-STYLE DARK BOTTOM BLOCK ── */}
      <section className="bg-[#120E0A] text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Dark Side Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-black tracking-[0.2em] text-[#FF453A] uppercase block">
              {tCopy.subInnovation}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F0E8] tracking-tight leading-tight">
              {tCopy.innovationTitle}
            </h2>
            
            <p className="text-xl sm:text-2xl font-serif italic text-[#FF453A] leading-relaxed">
              {tCopy.innovationItalic}
            </p>
            
            <p className="text-sm sm:text-base text-[#F5F0E8]/75 leading-relaxed max-w-xl">
              {tCopy.innovationDesc}
            </p>
          </div>

          {/* Right Column: Three Horizontal stacked highlight cards */}
          <div className="lg:col-span-6 space-y-4">
            {tCopy.innovationCards.map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -3, borderColor: 'rgba(255, 69, 58, 0.4)' }}
                className="bg-[#1C1612] border border-[#F5F0E8]/10 p-6 rounded-2xl flex gap-4 items-start shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Badge/Icon container */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3D0F]/40 to-[#120E0A] flex items-center justify-center text-[#FF453A] shrink-0 border border-[#7C3D0F]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#F5F0E8]">
                      {card.title}
                    </h3>
                    <span className="text-[8px] font-black tracking-widest text-[#FF453A] bg-[#FF453A]/10 border border-[#FF453A]/25 px-2 py-0.5 rounded-full uppercase shrink-0">
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F0E8]/60 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 3: INTERACTIVE SMART SCHOOL TIMELINE PREVIEW ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E0D4]">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-black tracking-[0.2em] text-[#7C3D0F] uppercase block">
            {tCopy.timelineSub}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1410] tracking-tight leading-tight">
            {tCopy.timelineTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#6B5D52] font-medium leading-relaxed">
            {tCopy.timelineDesc}
          </p>
        </div>

        {/* Interactive Dashboard Selector Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch mt-12">
          {/* Left Column: Vertical Interactive Timeline Cards */}
          <div className="lg:col-span-4 space-y-4">
            {timelineItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === index
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer outline-none focus:ring-2 focus:ring-[#FF453A]/20 ${
                    isActive 
                      ? 'bg-white border-[#FF453A] shadow-xl translate-x-2' 
                      : 'bg-white/40 border-[#E8E0D4] hover:bg-white/70'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isActive 
                      ? 'bg-[#FF453A]/10 border-[#FF453A]/20 text-[#FF453A]' 
                      : 'bg-[#3D3128]/5 border-[#3D3128]/10 text-[#3D3128]/60'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#FF453A]/10 text-[#FF453A]' : 'bg-[#3D3128]/5 text-[#3D3128]/60'
                      }`}>
                        {item.time}
                      </span>
                      <span className="text-[8px] font-black tracking-widest text-[#7C3D0F] uppercase">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1A1410]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6B5D52] leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Middle Column: Simulated Live Console Screen */}
          <div className="lg:col-span-5 flex">
            <div className="w-full bg-[#120E0A] text-white rounded-[2.5rem] p-6 lg:p-8 border border-[#8B4513]/25 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[440px]">
              <div className="absolute inset-0 bg-radial-gradient from-[#8B4513]/10 to-transparent opacity-60 pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-[300px] h-[300px] bg-[#7C3D0F]/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                {/* Simulated Screen header */}
                <div className="flex justify-between items-center text-[10px] text-white/40 uppercase tracking-widest border-b border-white/5 pb-4 mb-6">
                  <span>Revenex Active Console</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A] animate-pulse" />
                    <span>SYSTEM ONLINE</span>
                  </div>
                </div>

                {/* Animated Display Content */}
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-center"
                >
                  {timelineItems[activeTab].preview}
                </motion.div>

                {/* Screen footer */}
                <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[8px] text-white/30 uppercase tracking-widest">
                  <span>Node: AP-SOUTH-1</span>
                  <span>SSL SECURED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Explanation Panel */}
          <div className="lg:col-span-3 flex text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-[#FDFBF7] border border-[#E8E0D4] rounded-[2.5rem] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#F5EDE0]/30 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#FF453A]/10 bg-[#FF453A]/5 text-[#FF453A] w-fit mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {timelineItems[activeTab].explanation.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-[#1A1410] leading-snug mb-4">
                      {timelineItems[activeTab].explanation.title}
                    </h3>

                    {/* Bullets */}
                    <ul className="space-y-3">
                      {timelineItems[activeTab].explanation.bullets.map((bullet, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.08 }}
                          className="flex gap-2.5 items-start text-xs text-[#6B5D52] leading-relaxed"
                        >
                          <span className="text-[#FF453A] font-bold mt-0.5">•</span>
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Insight Box */}
                  <div className="bg-white border border-[#E8E0D4] p-4 rounded-2xl shadow-xs mt-6">
                    <div className="text-[9px] font-black text-[#7C3D0F] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>✨ Gemini Operational Tip</span>
                    </div>
                    <p className="text-[11px] text-[#3D3128] font-medium leading-relaxed italic">
                      "{timelineItems[activeTab].explanation.insight}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </main>
  )
}
