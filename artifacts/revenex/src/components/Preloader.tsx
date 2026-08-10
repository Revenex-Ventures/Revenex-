import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_PHRASES = [
  "Initializing experience...",
  "Securing dashboard connection...",
  "Loading school ERP modules...",
  "Preparing class metrics...",
  "Welcome to Revenex"
];

export function Preloader() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F0E8]"
    >
      <div className="relative flex flex-col items-center">
        {/* Central visual circle container */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Glassmorphic inner circle */}
          <div className="w-40 h-40 rounded-full bg-white/80 border border-[#E8E0D4] flex items-center justify-center shadow-[0_8px_32px_rgba(139,69,19,0.06)] backdrop-blur-md z-10">
            <motion.img
              src="/logo.png"
              alt="Revenex Logo"
              className="w-20 h-20 object-contain drop-shadow-[0_4px_12px_rgba(139,69,19,0.15)]"
              animate={{
                scale: [0.93, 1.05, 0.93],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Luxury rotating gold ring */}
          <svg className="absolute w-[184px] h-[184px] -rotate-90 z-0">
            <motion.circle
              cx="92"
              cy="92"
              r="86"
              stroke="#8B4513"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="540"
              initial={{ strokeDashoffset: 540 }}
              animate={{ 
                strokeDashoffset: [540, 0, 540],
                rotate: [0, 360]
              }}
              transition={{
                strokeDashoffset: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                },
                rotate: {
                  repeat: Infinity,
                  duration: 5,
                  ease: "linear"
                }
              }}
              strokeLinecap="round"
            />
          </svg>

          {/* Subtler background orbit track */}
          <div className="absolute w-[184px] h-[184px] rounded-full border border-[#8B4513]/10 z-0" />
        </div>

        {/* Dynamic status/loading messages */}
        <div className="h-6 mt-8 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-bold tracking-widest text-[#6B5D52] uppercase text-center font-sans"
            >
              {LOADING_PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
