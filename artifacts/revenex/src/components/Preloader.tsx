import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Vector outlines match the shared Revenex wordmark exactly.
const letters = [
  {
    x: -190,
    y: -150,
    path: "M0 0h39q17 0 17 15 0 11-11 14l15 21H42L29 31H15v19H0zm15 11v9h22q5 0 5-4.5T37 11z",
  },
  { x: -240, y: 0, path: "M66 0h52v12H81v7h33v12H81v7h38v12H66z" },
  { x: -190, y: 160, path: "M124 0h17l17 33 17-33h17l-27 50h-15z" },
  { x: 0, y: 190, path: "M198 0h52v12h-37v7h33v12h-33v7h38v12h-53z" },
  { x: 190, y: -150, path: "M260 0h16l31 30V0h15v50h-15l-32-31v31h-15z" },
  { x: 240, y: 0, path: "M332 0h52v12h-37v7h33v12h-33v7h38v12h-53z" },
  {
    x: 190,
    y: 160,
    path: "M390 0h20l15 16 15-16h20l-26 25 27 25h-21l-15-16-16 16h-20l27-25z",
  },
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduced ? 250 : 3300);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduced]);

  return (
    <motion.div
      role="status"
      aria-label="Welcome to Revenex"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.35 } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#F5F0E8] px-6"
    >
      <div
        className="flex w-full max-w-[360px] flex-col items-center"
        style={{ perspective: 900 }}
      >
        <motion.img
          src="/brand/mark-dark.svg"
          alt=""
          width={112}
          height={86}
          initial={
            reduced ? false : { opacity: 0, z: -450, scale: 0.35, rotateX: 16 }
          }
          animate={{ opacity: 1, z: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 h-auto w-24 sm:w-28"
        />
        <svg
          viewBox="0 0 461 50"
          role="img"
          aria-label="REVENEX"
          className="h-auto w-full max-w-[320px] overflow-visible fill-[#17375D]"
        >
          {letters.map((letter, index) => (
            <motion.path
              key={index}
              d={letter.path}
              fillRule="evenodd"
              initial={
                reduced
                  ? false
                  : { opacity: 0, x: letter.x, y: letter.y, scale: 0.65 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{
                delay: 0.65 + index * 0.14,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </svg>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 2.15, duration: 0.5 }}
          className="mt-4 flex w-full flex-col items-center text-center"
        >
          <p className="text-[11px] font-bold uppercase leading-relaxed tracking-[.16em] text-[#9A7628] sm:text-xs">
            Ventures Pvt. Ltd.
          </p>
          <p className="mt-1.5 text-[8px] font-semibold uppercase leading-relaxed tracking-[.26em] text-[#17375D] sm:text-[9px]">
            Software Solutions
          </p>
          <span aria-hidden="true" className="mt-5 h-px w-12 bg-[#B99640]/35" />
          <p className="mt-4 flex items-center justify-center gap-3 text-[11px] font-medium leading-none tracking-[.08em] text-[#6B5D52] sm:gap-4 sm:text-xs">
            <span>Build</span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-[#B99640]"
            />
            <span>Innovate</span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-[#B99640]"
            />
            <span>Grow</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
