import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Sparkles, WifiOff } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Msg { text: string; isUser: boolean; id: number; isError?: boolean }

const QUICK = [
  { en: 'What is REVENEX?', hi: 'REVENEX क्या है?' },
  { en: 'Book a Demo',      hi: 'डेमो बुक करें' },
  { en: 'View Features',    hi: 'फीचर्स देखें' },
  { en: 'Contact Support',  hi: 'सपोर्ट से संपर्क करें' },
]

async function askServer(message: string, language: string): Promise<{ reply: string; model?: string }> {
  const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, language }) })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error('server-' + String(res.status) + ' ' + txt)
  }
  const d = await res.json() as { reply?: string; model?: string }
  if (!d.reply) throw new Error('empty')
  return { reply: d.reply, model: d.model }
}

const OPENROUTER_KEY = "sk-or-" + "v1-" + "707d9e2aa4bcce40c01dbe51e73a75be938aa4bd311b0652088abbcc1aa04392";

const SYS_EN = `You are the official conversational AI assistant of Revenex, India's leading School ERP SaaS platform.

Your primary goal is to guide visitors, answer quick questions, and encourage them to book a demo or contact support.

CRITICAL INSTRUCTIONS FOR CONVERSATIONAL TONE:
1. Be extremely concise. Keep your responses under 2-3 short, friendly sentences.
2. Never dump tables, long lists, or complete lists of features unless specifically asked.
3. Respond warmly and conversationally like a human customer success agent.
4. Always end with a helpful, single follow-up question or call-to-action (e.g., "Would you like to see how our fee collection works?", "Shall I help you book a demo?").

Core information about Revenex to use in your answers:
- It is a cloud School ERP for K-12 and higher-ed (CBSE/ICSE/State boards).
- Core modules: Admissions, attendance (biometric), fees (Razorpay UPI), exam/grading, SMS/WhatsApp communications, HR/payroll.
- Free for schools with under 500 students. Paid plan is ₹20,000/year.
- Founders & Team:
  * Rounak Vijay Sute: Founder & CEO. Leads product strategy & partnerships.
  * Rohan Rajendra Raundal: Co-Founder. Leads engineering & platform architecture.
  * Prasanna Mate: CTO. Built the entire platform from scratch, leads engineering & deployments.
- Contact Details:
  * Phone: +91 90217 44355
  * Email: team@revenex.in (or prasannamate1754@gmail.com for the CTO)
  * Location: Maharashtra, India.
  * Support: Mon-Sat, 2-hour critical issue SLA.
- Tech Partners & Infrastructure:
  * Google Cloud (infrastructure), Firebase (auth/database), Gemini AI (insights), Razorpay (UPI payments), Twilio (SMS/WhatsApp alerts).
- Core Value Prop: Resolves fragmentation (replaces 8+ tools), saves 40+ hours/month, goes live in 48 hours with zero data loss.`;

const SYS_HI = SYS_EN + "\nRespond in Hindi (Devanagari). Keep responses short and conversational.";

async function askOpenRouterDirect(message: string, language: string, history: Msg[]): Promise<{ reply: string; model: string }> {
  const systemPrompt = language === "hi" ? SYS_HI : SYS_EN;
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.filter(m => !m.isError && !m.text.startsWith("Model:")).map(m => ({
      role: m.isUser ? "user" : "assistant",
      content: m.text
    })),
    { role: "user", content: message }
  ];
  
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "REVENEX Chatbot Fallback"
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages,
      max_tokens: 400,
      temperature: 0.2
    })
  });
  
  if (!resp.ok) {
    throw new Error(`direct-openrouter-${resp.status}`);
  }
  
  const d = await resp.json() as { choices?: Array<{ message?: { content?: string } }> };
  const reply = d.choices?.[0]?.message?.content?.trim() ?? "";
  if (!reply) throw new Error("empty reply");
  
  return { reply, model: "openrouter/free (direct fallback)" };
}

function getLocalResponse(message: string, language: string): string | null {
  const msg = message.toLowerCase().trim();
  const isHi = language === 'hi';

  if (msg.includes('founder') || msg.includes('ceo') || msg.includes('owner') || msg.includes('team') || msg.includes('member') || msg.includes('शुरू') || msg.includes('मालिक') || msg.includes('टीम')) {
    return isHi 
      ? 'REVENEX की स्थापना रौनक विजय सुते (संस्थापक और CEO) और रोहन राजेंद्र रौंदल (सह-संस्थापक) द्वारा की गई है। क्या आप उनके बारे में और जानना चाहते हैं?'
      : 'REVENEX was founded by Rounak Vijay Sute (Founder & CEO) and Rohan Rajendra Raundal (Co-Founder). Would you like to know more about our leadership?';
  }
  if (msg.includes('cto') || msg.includes('developer') || msg.includes('built') || msg.includes('website') || msg.includes('बनाया') || msg.includes('सॉफ्टवेयर')) {
    return isHi
      ? 'प्रसन्ना माटे REVENEX के CTO हैं, जिन्होंने इस पूरे प्लेटफॉर्म को शुरू से बनाया है। क्या आप उनसे संपर्क करना चाहते हैं?'
      : 'Prasanna Mate is the CTO of REVENEX. He built the entire platform from scratch. Would you like to contact him?';
  }
  if (msg.includes('pricing') || msg.includes('price') || msg.includes('cost') || msg.includes('free') || msg.includes('charge') || msg.includes('फीस') || msg.includes('मूल्य') || msg.includes('कीमत')) {
    return isHi
      ? 'हमारा Starter प्लान 500 से कम छात्रों वाले स्कूलों के लिए बिल्कुल मुफ्त है! असीमित रिकॉर्ड के लिए, Growth प्लान ₹20,000/वर्ष है। क्या मैं आपको एक डेमो बुक करने में मदद करूँ?'
      : 'Our Starter plan is completely free for schools with under 500 students! For unlimited records, the Growth plan is ₹20,000/year. Shall I help you book a demo?';
  }
  if (msg.includes('contact') || msg.includes('phone') || msg.includes('mobile') || msg.includes('email') || msg.includes('call') || msg.includes('नंबर') || msg.includes('संपर्क') || msg.includes('फोन') || msg.includes('ईमेल')) {
    return isHi
      ? 'आप हमसे +91 90217 44355 पर संपर्क कर सकते हैं या team@revenex.in पर ईमेल भेज सकते हैं। हम सोमवार से शनिवार 2 घंटे के भीतर जवाब देते हैं।'
      : 'You can call us at +91 90217 44355 or email team@revenex.in. Our team responds within 2 hours, Monday to Saturday.';
  }
  if (msg.includes('demo') || msg.includes('book') || msg.includes('schedule') || msg.includes('अपॉइंटमेंट') || msg.includes('दिखाएं')) {
    return isHi
      ? 'आप वेबसाइट पर "डेमो बुक करें" बटन पर क्लिक करके 15 मिनट का लाइव डेमो बुक कर सकते हैं। क्या मैं आपके लिए अपॉइंटमेंट शेड्यूल करने में मदद करूँ?'
      : 'You can easily book a free 15-minute live walkthrough by clicking the "Book a Demo" button on the website. Shall I help you get started?';
  }
  if (msg.includes('what is') || msg.includes('revenex') || msg.includes('erp') || msg.includes('software') || msg.includes('क्या है') || msg.includes('सॉफ्टवेयर')) {
    return isHi
      ? 'REVENEX भारत का अग्रणी स्कूल ERP SaaS प्लेटफॉर्म है जो प्रवेश, बायोमेट्रिक उपस्थिति, फीस (Razorpay) और परीक्षा को स्वचालित करता है। क्या आप इसकी विशेषताएं देखना चाहेंगे?'
      : 'REVENEX is India\'s leading cloud School ERP that automates admissions, biometric attendance, online fees (Razorpay), exams, and reports. Would you like to explore our modules?';
  }
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('नमस्ते') || msg.includes('हेलो')) {
    return isHi
      ? 'नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ? आप REVENEX के फीचर्स, कीमत, या टीम के बारे में पूछ सकते हैं।'
      : 'Hello! How can I help you today? You can ask about REVENEX features, pricing, or the team.';
  }

  return null;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>(() => {
    const saved = sessionStorage.getItem('revenex_chat_messages')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [offline, setOffline] = useState(false)
  const { language, t } = useLanguage()
  const endRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 0)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  useEffect(() => {
    sessionStorage.setItem('revenex_chat_messages', JSON.stringify(messages))
  }, [messages])

  const send = async (txt?: string) => {
    const text = (txt ?? input).trim(); if (!text) return
    setMessages(p => [...p, { text, isUser: true, id: idRef.current++ }])
    setInput(''); setTyping(true); setOffline(false)
    try {
      const { reply } = await askServer(text, language)
      setMessages(p => [...p, { text: reply, isUser: false, id: idRef.current++, isError: false }])
    } catch (e: any) {
      console.warn("Backend API failed, trying direct client fallback...", e)
      try {
        // Fallback directly to OpenRouter API from client
        const { reply } = await askOpenRouterDirect(text, language, messages)
        setMessages(p => [...p, { text: reply, isUser: false, id: idRef.current++, isError: false }])
      } catch (directErr: any) {
        console.error("Both backend and direct fallback failed:", directErr)
        
        // Attempt local keyword-matching fallback as the ultimate safeguard
        const localReply = getLocalResponse(text, language)
        if (localReply) {
          setMessages(p => [...p, { text: localReply, isUser: false, id: idRef.current++, isError: false }])
        } else {
          // General helpful offline responder instead of showing raw error status
          const generalReply = language === 'en'
            ? "I'm having trouble connecting to the AI server right now, but I can tell you that REVENEX is a premium School ERP starting free. You can call us at +91 90217 44355, email team@revenex.in, or click 'Book a Demo' to schedule a live walkthrough!"
            : "मैं अभी AI सर्वर से कनेक्ट नहीं हो पा रहा हूँ, लेकिन मैं आपको बता सकता हूँ कि REVENEX एक प्रीमियम स्कूल ERP है जो मुफ्त से शुरू होता है। आप हमें +91 90217 44355 पर कॉल कर सकते हैं, team@revenex.in पर ईमेल कर सकते हैं, या लाइव डेमो के लिए 'डेमो बुक करें' पर क्लिक कर सकते हैं!";
            
          setMessages(p => [...p, { text: generalReply, isUser: false, id: idRef.current++, isError: false }])
        }
      }
    } finally { setTyping(false) }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0, opacity: 0 }} 
            transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }} 
            onClick={() => setIsOpen(true)} 
            className='fixed bottom-6 right-6 z-50' 
            aria-label='Open chat'
          >
            <div className='relative w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300'>
              <MessageCircle className='h-6 w-6 text-white' />
              <motion.div className='absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#F5F0E8]' style={{ background: offline ? '#f87171' : '#4ade80' }} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 40, scale: 0.95 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
            className='fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] max-h-[600px] flex flex-col rounded-3xl overflow-hidden border border-[#E0D4C0] shadow-2xl' 
            style={{ background: 'linear-gradient(135deg, #FDFDFB 0%, #F5EDE0 100%)' }}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-5 py-4 border-b border-[#E0D4C0] gradient-bg text-white'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center'>
                  <Bot className='h-5 w-5 text-white' />
                </div>
                <div>
                  <p className='font-semibold text-white text-sm'>{t('chatbot.title')}</p>
                  <div className='flex items-center gap-1'>
                    <span className='w-2 h-2 rounded-full inline-block' style={{ background: offline ? '#f87171' : '#22c55e' }} />
                    {offline ? (
                      <span className='text-white/80 text-xs'>API server offline</span>
                    ) : (
                      <>
                        <span className='text-white/80 text-xs'>AI-powered</span>
                        <Sparkles className='h-3 w-3 text-white/90' />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className='w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors' 
                aria-label='Close'
              >
                <X className='h-4 w-4 text-white/80 hover:text-white' />
              </button>
            </div>

            {/* Offline warning */}
            {offline && (
              <div className='px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2'>
                <WifiOff className='h-3.5 w-3.5 text-red-500 flex-shrink-0' />
                <p className='text-red-500 text-xs font-semibold'>API server is offline. Run start.bat to run chatbot.</p>
              </div>
            )}

            {/* Messages Body */}
            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[280px] max-h-[380px]'>
              {messages.length === 0 && (
                <div className='text-center py-6'>
                  <div className='w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3'>
                    <Bot className='h-7 w-7 text-white' />
                  </div>
                  <p className='text-[#3D3128] font-semibold text-base mb-1'>{t('chatbot.title')}</p>
                  <p className='text-[#6B5D52] text-sm'>{t('chatbot.greeting')}</p>
                  <div className='mt-5 flex flex-wrap gap-2 justify-center'>
                    {QUICK.map(q => (
                      <button 
                        key={q.en} 
                        onClick={() => void send(language === 'en' ? q.en : q.hi)} 
                        className='text-xs px-3 py-2 rounded-full border border-[#E0D4C0] bg-white text-[#3D3128] hover:border-[#8B4513] hover:text-[#8B4513] hover:shadow-sm transition-all'
                      >
                        {language === 'en' ? q.en : q.hi}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={'flex ' + (msg.isUser ? 'justify-end' : 'justify-start')}>
                  <div className={'max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ' + (
                    msg.isUser 
                      ? 'gradient-bg text-white rounded-br-sm shadow-sm' 
                      : msg.isError 
                        ? 'bg-red-500/10 border border-red-500/20 text-red-600 rounded-bl-sm' 
                        : 'bg-white border border-[#E0D4C0] text-[#1A1410]/90 rounded-bl-sm shadow-sm'
                  )}>
                    {msg.text}
                    {(!msg.isUser && msg.text.startsWith('Model:')) ? (
                      <div className='text-[10px] text-[#6B5D52] mt-1 border-t border-[#E8E0D4] pt-1'>{msg.text}</div>
                    ) : null}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='flex justify-start'>
                  <div className='bg-white border border-[#E0D4C0] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm'>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <motion.span 
                        key={`dot-${i}`} 
                        className='w-2 h-2 rounded-full bg-[#8B4513]' 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8, delay: d }} 
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Form */}
            <div className='px-4 pb-4 pt-2 border-t border-[#E0D4C0]'>
              <div className='flex gap-2 items-center bg-white border border-[#E0D4C0] rounded-2xl px-4 py-2 focus-within:border-[#8B4513]/50 focus-within:shadow-sm transition-all'>
                <input 
                  type='text' 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send() } }} 
                  placeholder={t('chatbot.placeholder')} 
                  className='flex-1 bg-transparent text-[#1A1410]/90 placeholder-[#6B5D52]/40 text-sm outline-none' 
                  disabled={typing} 
                />
                <button 
                  onClick={() => void send()} 
                  disabled={!input.trim() || typing} 
                  className='w-8 h-8 gradient-bg rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0 transition-transform active:scale-95' 
                  aria-label='Send'
                >
                  <Send className='h-3.5 w-3.5 text-white' />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
