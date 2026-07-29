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

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [offline, setOffline] = useState(false)
  const { language, t } = useLanguage()
  const endRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = async (txt?: string) => {
    const text = (txt ?? input).trim(); if (!text) return
    setMessages(p => [...p, { text, isUser: true, id: idRef.current++ }])
    setInput(''); setTyping(true); setOffline(false)
    try {
      const { reply, model } = await askServer(text, language)
      setMessages(p => [...p, { text: reply, isUser: false, id: idRef.current++, isError: false }])
      // attach model info as a tiny system message
      if (model) setMessages(p => [...p, { text: `Model: ${model}`, isUser: false, id: idRef.current++ }])
    } catch {
      setOffline(true)
      setMessages(p => [...p, { text: language === 'en' ? 'The AI server is not running or returned an error. Try again or contact support.' : 'AI सर्वर चालू नहीं है या त्रुटि हुई। कृपया पुन: प्रयास करें।', isUser: false, id: idRef.current++, isError: true }])
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
                <p className='text-red-500 text-xs font-semibold'>API server is offline. Run START-API.bat to run chatbot.</p>
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
