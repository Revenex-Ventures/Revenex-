import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
export function Preloader() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      role="status"
      aria-label="Welcome to Revenex"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#102A4C] px-6"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <BrandLogo tone="light" size="lg" stacked full />
        <p className="mt-7 text-[11px] tracking-[.22em] text-[#C0E8F0]/75">
          Build <span className="mx-3 text-[#D8B65B]">•</span> Innovate{" "}
          <span className="mx-3 text-[#D8B65B]">•</span> Grow
        </p>
        <div
          className="mt-8 h-px w-28 overflow-hidden bg-white/15"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full bg-[#D8B65B]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              repeat: reduced ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
