import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Feature {
  step: string;
  title: string;
  content: string;
  image: string;
  imageAlt: string;
  caption: string;
}
interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  autoPlayInterval?: number;
  language?: "en" | "hi";
}

export function FeatureSteps({
  features,
  className,
  autoPlayInterval = 2000,
  language = "en",
}: FeatureStepsProps) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { amount: 0.25 });
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [revision, setRevision] = useState(0);
  const isHindi = language === "hi";
  const playing =
    visible &&
    !paused &&
    !focused &&
    !hidden &&
    !reduced &&
    features.length > 1;
  const active = features[current];

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setCurrent((value) => (value + 1) % features.length);
    }, autoPlayInterval);
    return () => window.clearTimeout(timer);
  }, [current, playing, features.length, autoPlayInterval, revision]);

  const select = (index: number) => {
    setCurrent(index);
    setRevision((value) => value + 1);
  };
  if (!active) return null;

  return (
    <div
      ref={root}
      className={cn(
        "grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14",
        className,
      )}
      onFocusCapture={(event) =>
        setFocused(
          Boolean(
            (event.target as HTMLElement).closest("[data-step-selector]"),
          ),
        )
      }
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div
        className="relative order-2 space-y-2 sm:space-y-3 lg:order-1"
        aria-label={
          isHindi ? "शुरू करने के चार चरण" : "Four steps to get started"
        }
      >
        <div
          aria-hidden="true"
          className="absolute bottom-12 left-[33px] top-12 w-px bg-[#DFD1BE] sm:left-[37px]"
        />
        {features.map((feature, index) => {
          const selected = current === index;
          return (
            <button
              data-step-selector
              key={feature.step}
              type="button"
              onClick={() => select(index)}
              aria-pressed={selected}
              aria-controls="onboarding-visual"
              id={`onboarding-step-${index}`}
              className={cn(
                "group relative grid w-full grid-cols-[38px_1fr] gap-4 rounded-2xl border px-3.5 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B4513] focus-visible:ring-offset-4 sm:grid-cols-[42px_1fr] sm:gap-5 sm:px-4 sm:py-5",
                selected
                  ? "border-[#D8BC98] bg-[#FFFDFA] shadow-[0_12px_40px_-24px_rgba(91,53,21,0.4)]"
                  : "border-transparent hover:border-[#E7DDCF] hover:bg-white/40",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex h-[38px] w-[38px] items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300 sm:h-[42px] sm:w-[42px]",
                  selected
                    ? "border-[#8B4513] bg-[#8B4513] text-white shadow-[0_4px_12px_rgba(139,69,19,0.16)]"
                    : "border-[#DBCEBB] bg-[#F5F0E8] text-[#8B7866]",
                )}
              >
                {index < current ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  feature.step
                )}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-base font-bold tracking-[-0.025em] sm:text-xl",
                    selected ? "text-[#2A1D13]" : "text-[#716458]",
                  )}
                >
                  {feature.title}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block text-[13px] leading-relaxed sm:text-sm",
                    selected ? "text-[#6B5D52]" : "text-[#85796C]",
                  )}
                >
                  {feature.content}
                </span>
                {selected && (
                  <span
                    className="mt-3 block h-[2px] overflow-hidden rounded-full bg-[#EDE3D5]"
                    aria-hidden="true"
                  >
                    <motion.span
                      key={`${current}-${revision}-${playing}`}
                      className="block h-full origin-left bg-[#B58447]"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: playing ? autoPlayInterval / 1000 : 0,
                        ease: "linear",
                      }}
                    />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="order-1 min-w-0 lg:order-2">
        <div
          id="onboarding-visual"
          role="region"
          aria-labelledby={`onboarding-step-${current}`}
          className="relative isolate overflow-hidden rounded-[1.75rem] border border-[#E2D4C1] bg-[#EEE4D5] shadow-[0_24px_64px_-38px_rgba(83,48,20,0.4)] sm:rounded-[2rem]"
        >
          <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/80 bg-[#FFFDFA]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#7C512A] backdrop-blur sm:left-6 sm:top-6 sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A67135]" />
            {isHindi ? `चरण ${active.step} / 04` : `STEP ${active.step} / 04`}
          </div>
          <div className="relative aspect-[4/3]">
            <AnimatePresence initial={false}>
              <motion.img
                key={active.image}
                src={active.image}
                alt={active.imageAlt}
                width={1200}
                height={900}
                initial={
                  reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 1.035 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduced ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="relative border-t border-[#E2D4C1] bg-[#FFFDFA] px-5 py-5 sm:px-7 sm:py-6">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9A713F]">
              {isHindi ? "आपके संस्थान के लिए" : "BUILT AROUND YOUR SCHOOL"}
            </p>
            <p className="mt-2 text-base font-semibold leading-relaxed tracking-[-.02em] text-[#3D2817] sm:text-lg">
              {active.caption}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 px-1">
          <div className="flex gap-1.5" aria-hidden="true">
            {features.map((feature, index) => (
              <span
                key={feature.step}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  current === index ? "w-6 bg-[#8B4513]" : "w-1.5 bg-[#D9CCB9]",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                select((current - 1 + features.length) % features.length)
              }
              aria-label={isHindi ? "पिछला चरण" : "Previous step"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#795B3D] hover:bg-[#EDE3D5] focus-visible:outline-[#8B4513]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={
                  paused ? "Play automatic steps" : "Pause automatic steps"
                }
                aria-pressed={paused}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDCEB9] text-[#795B3D] hover:bg-[#EDE3D5] focus-visible:outline-[#8B4513]"
              >
                {paused ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => select((current + 1) % features.length)}
              aria-label={isHindi ? "अगला चरण" : "Next step"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#795B3D] hover:bg-[#EDE3D5] focus-visible:outline-[#8B4513]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
