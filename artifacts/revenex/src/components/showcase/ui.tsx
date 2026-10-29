import { useHindiText as useSiteText } from "@/lib/hindi-text";
import { motion, cubicBezier, animate, useMotionValue, useTransform } from "framer-motion"
import { useEffect } from "react"
import type { CSSProperties, ComponentType, ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "wouter"

export const GOLD = "#D49A58"
export const TERRACOTTA = "#A34E17"
export const CREAM = "#F9F6F0"
export const CHARCOAL = "#221910"
export const MUTED = "#61544A"
export const CARD_BORDER = "#E5DDD2"

export const EASE = cubicBezier(0.22, 1, 0.36, 1)
export const PAGE_EASE = cubicBezier(0.16, 1, 0.3, 1)

export function Eyebrow({
  icon: Icon,
  accent = GOLD,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  accent?: string
  children: ReactNode
}) {
  const siteText = useSiteText();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <span
        className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3.5 py-1.5 backdrop-blur-xl"
        style={{ borderColor: `${accent}40`, color: accent }}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-bold uppercase tracking-widest">{siteText(children)}</span>
      </span>
    </motion.div>
  )
}

export function GlassCard({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const siteText = useSiteText();
  return (
    <div className={`rounded-3xl border border-[#E5DDD2] bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(212,154,88,0.12)] ${className}`}>
      {siteText(children)}
    </div>
  )
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const siteText = useSiteText();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {siteText(children)}
    </motion.div>
  )
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  accent = GOLD,
  center = true,
}: {
  kicker: string
  title: ReactNode
  subtitle?: string
  accent?: string
  center?: boolean
}) {
  const siteText = useSiteText();
  return (
    <div className={center ? "flex flex-col items-center" : ""}>
      <span
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {siteText(kicker)}
      </span>
      <h2
        className={`mt-3 font-display text-3xl sm:text-4xl font-black tracking-tight text-[#221910] ${
          center ? "text-center" : ""
        }`}
      >
        {siteText(title)}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl leading-relaxed text-[#61544A] ${
            center ? "text-center" : ""
          }`}
        >
          {siteText(subtitle)}
        </p>
      )}
    </div>
  )
}

export function DemoButton({ label = "Book a Demo" }: { label?: string }) {
  const siteText = useSiteText();
  return (
    <Link href="/book-demo">
      <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#D49A58] px-7 py-3.5 text-sm font-bold text-[#221910] transition-all hover:bg-[#E0AA6E] hover:shadow-[0_0_24px_rgba(212,154,88,0.45)]">
        {siteText(label)} <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

export function StatPill({
  value,
  label,
  accent = GOLD,
}: {
  value: ReactNode
  label: string
  accent?: string
}) {
  const siteText = useSiteText();
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-[#E5DDD2] bg-white/70 px-5 py-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(212,154,88,0.10)]">
      <span
        className="counter-num text-2xl sm:text-3xl font-black tracking-tight"
        style={{ color: accent }}
      >
        {siteText(value)}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A7A6B]">
        {siteText(label)}
      </span>
    </div>
  )
}

export function CountUp({
  to,
  duration = 1.8,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  style,
}: {
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  style?: CSSProperties
}) {
  const siteText = useSiteText();
  const value = useMotionValue(0)
  const text = useTransform(value, (v) => v.toFixed(decimals))

  useEffect(() => {
    const controls = animate(value, to, {
      duration,
      ease: EASE,
    })
    return () => controls.stop()
  }, [value, to, duration])

  return (
    <motion.span className={className} style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {siteText(prefix)}<motion.span>{text}</motion.span>{siteText(suffix)}
    </motion.span>
  )
}
