import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Link } from "wouter"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Eyebrow, EASE } from "./ui"

export function ShowcaseShell({
  section,
  label,
  title,
  subtitle,
  accent = "#D49A58",
  children,
}: {
  section: string
  label: string
  title: ReactNode
  subtitle: string
  accent?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F9F6F0] text-[#221910]">
      {/* ── Bespoke back-to-home header ── */}
      <header className="sticky top-0 z-40 border-b border-[#E5DDD2] bg-[#F9F6F0]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="group">
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#E5DDD2] bg-white/70 px-3 py-2 text-xs font-semibold text-[#61544A] shadow-[0_8px_24px_rgba(212,154,88,0.10)] backdrop-blur-sm transition-all hover:border-[#D49A58]/50 hover:text-[#A34E17]">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </span>
            </Link>
            <img src="/logo.png" alt="REVENEX" className="h-7 w-auto object-contain opacity-90" />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs font-medium text-[#8A7A6B] md:inline-flex">
              {section}
              <span className="text-[#D8CDBC]">/</span>
              <span className="font-bold" style={{ color: accent }}>
                {label}
              </span>
            </span>
            <Link href="/book-demo">
              <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#D49A58] px-4 py-2 text-xs font-bold text-[#221910] transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_18px_rgba(212,154,88,0.45)]">
                Book a Demo <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page morph container (AnimatePresence-aware) ── */}
      <motion.main
        initial={{ opacity: 0, y: 32, scale: 0.97, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(6px)" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* ── Hero heading block ── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% -12%, rgba(212,154,88,0.16), transparent 70%), radial-gradient(ellipse 45% 35% at 85% 8%, rgba(163,78,23,0.07), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
            <Eyebrow icon={Sparkles} accent={accent}>
              {label}
            </Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              className="mt-6 max-w-3xl font-display text-4xl font-black leading-[1.08] tracking-tight text-[#221910] sm:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-[#61544A] sm:text-lg"
            >
              {subtitle}
            </motion.p>
          </div>
        </section>

        {children}
      </motion.main>

      <Footer />
    </div>
  )
}
