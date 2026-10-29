import { useHindiText as useSiteText } from "@/lib/hindi-text";
import { getFaqAnswer } from "../../../../lib/api-zod/src/chat-knowledge";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { apiRequest } from "@/lib/api";

interface Msg {
  text: string;
  isUser: boolean;
  id: number;
  isError?: boolean;
  language?: "en" | "hi";
}

const QUICK = [
  { en: "What is REVENEX?", hi: "REVENEX क्या है?" },
  { en: "Book a Demo", hi: "डेमो बुक करें" },
  { en: "View Features", hi: "फीचर्स देखें" },
  { en: "Contact Support", hi: "सपोर्ट से संपर्क करें" },
];

export function Chatbot() {
  const siteText = useSiteText();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("revenex_faq_messages") ?? "[]",
      );
      return Array.isArray(saved)
        ? saved
            .filter(
              (m) =>
                typeof m.text === "string" &&
                typeof m.id === "number" &&
                typeof m.isUser === "boolean",
            )
            .slice(-60)
            .map((m) => ({ ...m, text: m.text.slice(0, 4000) }))
        : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { language, t } = useLanguage();
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(
    messages.length > 0 ? Math.max(...messages.map((m) => m.id)) + 1 : 0,
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "revenex_faq_messages",
        JSON.stringify(messages.slice(-60)),
      );
    } catch {
      /* Storage may be disabled. */
    }
  }, [messages]);

  const send = async (txt?: string) => {
    const text = (txt ?? input).trim();
    if (!text || typing) return;
    if (text.length > 2000) {
      setInput(text.slice(0, 2000));
      return;
    }
    setMessages((p) => [
      ...p.slice(-59),
      { text, isUser: true, id: idRef.current++, language },
    ]);
    setInput("");
    setTyping(true);
    try {
      const result = await apiRequest<{ reply: string }>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: text, language }),
        signal: AbortSignal.timeout(18000),
      });
      if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("Empty reply");
      setMessages(p => [...p.slice(-59), { text: result.reply, isUser: false, id: idRef.current++, language }]);
    } catch {
      const notice = language === "hi"
        ? "एआई उत्तर अभी उपलब्ध नहीं है। उपलब्ध जानकारी: "
        : "AI replies are currently unavailable. Available FAQ help: ";
      setMessages(p => [...p.slice(-59), {
        text: notice + getFaqAnswer(text, language), isUser: false,
        id: idRef.current++, isError: true, language,
      }]);
    } finally {
      setTyping(false);
    }
  };

  const visibleMessages = messages.filter(msg => (msg.language ?? "en") === language);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              delay: 1.5,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-[60] lg:bottom-6"
            aria-label={siteText("Open chat")}
          >
            <div className="relative w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-6 w-6 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#F5F0E8]"
                style={{ background: "#4ade80" }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-[60] w-[min(400px,calc(100vw-2rem))] max-h-[min(600px,calc(100dvh-8rem))] flex flex-col rounded-3xl overflow-hidden border border-[#E0D4C0] shadow-2xl lg:bottom-6"
            style={{
              background: "linear-gradient(135deg, #FDFDFB 0%, #F5EDE0 100%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D4C0] gradient-bg text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {siteText(t("chatbot.title"))}
                  </p>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: "#22c55e" }}
                    />
                    <span className="text-white/80 text-xs">
                      {siteText(language === "hi" ? "वेबसाइट सहायता" : "Website assistant")}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label={siteText("Close")}
              >
                <X className="h-4 w-4 text-white/80 hover:text-white" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 max-h-[380px]">
              {visibleMessages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-[#3D3128] font-semibold text-base mb-1">
                    {siteText(t("chatbot.title"))}
                  </p>
                  <p className="text-[#6B5D52] text-sm">
                    {siteText(t("chatbot.greeting"))}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 justify-center">
                    {QUICK.map((q) => (
                      <button
                        key={q.en}
                        onClick={() =>
                          void send(language === "en" ? q.en : q.hi)
                        }
                        className="text-xs px-3 py-2 rounded-full border border-[#E0D4C0] bg-white text-[#3D3128] hover:border-[#8B4513] hover:text-[#8B4513] hover:shadow-sm transition-all"
                      >
                        {siteText(language === "en" ? q.en : q.hi)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {visibleMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    "flex " + (msg.isUser ? "justify-end" : "justify-start")
                  }
                >
                  <div
                    className={
                      "max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed " +
                      (msg.isUser
                        ? "gradient-bg text-white rounded-br-sm shadow-sm"
                        : msg.isError
                          ? "bg-red-500/10 border border-red-500/20 text-red-600 rounded-bl-sm"
                          : "bg-white border border-[#E0D4C0] text-[#1A1410]/90 rounded-bl-sm shadow-sm")
                    }
                  >
                    {msg.isUser ? msg.text : siteText(msg.text)}
                    {!msg.isUser && msg.text.startsWith("Model:") ? (
                      <div className="text-[10px] text-[#6B5D52] mt-1 border-t border-[#E8E0D4] pt-1">
                        {siteText(msg.text)}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-[#E0D4C0] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <motion.span
                        key={`dot-${i}`}
                        className="w-2 h-2 rounded-full bg-[#8B4513]"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: d,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Form */}
            <div className="px-4 pb-4 pt-2 border-t border-[#E0D4C0]">
              <div className="flex gap-2 items-center bg-white border border-[#E0D4C0] rounded-2xl px-4 py-2 focus-within:border-[#8B4513]/50 focus-within:shadow-sm transition-all">
                <input
                  type="text"
                  value={input}
                  maxLength={2000}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder={siteText(t("chatbot.placeholder"))}
                  className="flex-1 bg-transparent text-[#1A1410]/90 placeholder-[#6B5D52]/40 text-sm outline-none"
                  disabled={typing}
                />
                <button
                  onClick={() => void send()}
                  disabled={!input.trim() || typing}
                  className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0 transition-transform active:scale-95"
                  aria-label={siteText("Send")}
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
