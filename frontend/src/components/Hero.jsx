import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { CONFIG, getComputedTalkStats } from "@/config/surpriseConfig";
import {
  getSinceMetCounter,
  getMiruBirthdayStatus,
} from "@/utils/dateUtils";
import { prefersReducedMotion } from "@/utils/feedback";
import HeroConfetti from "@/components/HeroConfetti";
import OurNumbersStory from "@/components/OurNumbersStory";
import SinceWeMetStory from "@/components/SinceWeMetStory";

const easeOut = [0.16, 1, 0.3, 1];

function MaskedLine({ children, delay, className }) {
  const rm = prefersReducedMotion();
  if (rm) {
    return <span className={`block pb-1 ${className || ""}`}>{children}</span>;
  }
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className={`block ${className || ""}`}
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: easeOut, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const pad = (n) => String(n).padStart(2, "0");

export default function Hero() {
  const [, setTick] = useState(0);
  const [showTalkStory, setShowTalkStory] = useState(false);
  const [showSinceMetStory, setShowSinceMetStory] = useState(false);

  const talkCardRef = useRef(null);
  const sinceMetCardRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, mins, secs } = getSinceMetCounter(CONFIG.metOn);
  const { isBirthdayToday } = getMiruBirthdayStatus(
    CONFIG.birthday,
    CONFIG.unlockAt
  );
  const talkStats = getComputedTalkStats();

  const [fireConfetti, setFireConfetti] = useState(isBirthdayToday);

  useEffect(() => {
    if (isBirthdayToday) {
      setFireConfetti(true);
    }
  }, [isBirthdayToday]);

  const ref = useRef(null);
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 800], [0, 140]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const scrollToReveal = () => {
    const el = document.getElementById("miru-reveal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden px-4 pb-20 pt-safe sm:px-8 text-center"
      data-testid="hero-section"
    >
      {/* Confetti burst if today is her birthday */}
      <HeroConfetti trigger={fireConfetti} />

      {/* Full-screen romantic "Since We Met" story overlay */}
      <SinceWeMetStory
        isOpen={showSinceMetStory}
        onClose={() => {
          setShowSinceMetStory(false);
          sinceMetCardRef.current?.focus();
        }}
      />

      {/* Full-screen romantic "Our Numbers" story overlay */}
      <OurNumbersStory
        isOpen={showTalkStory}
        onClose={() => {
          setShowTalkStory(false);
          talkCardRef.current?.focus();
        }}
      />

      {/* Balanced parallax ambient glow blobs on both sides */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Left glow blob */}
        <div className="absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-[rgba(244,114,182,0.22)] blur-3xl sm:h-96 sm:w-96 sm:-left-24" />
        {/* Right glow blob */}
        <div className="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-[rgba(201,151,43,0.18)] blur-3xl sm:h-96 sm:w-96 sm:-right-24" />
        {/* Top center soft radiance */}
        <div className="absolute left-1/2 -top-28 h-64 w-80 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.14)] blur-3xl sm:w-[500px]" />
      </motion.div>

      {/* Hero content centered horizontally and vertically, max-w about 720px */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-[720px] flex-col items-center justify-center text-center"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-4 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {CONFIG.hero.eyebrow}
        </motion.p>

        {/* Serif Heading with Fluid Typography clamp */}
        <h1
          className="font-serif font-semibold leading-[1.05] text-ink text-center"
          data-testid="hero-headline"
        >
          <span className="block text-[clamp(2.1rem,6vw+0.5rem,4.25rem)]">
            <MaskedLine delay={0.25}>Happy</MaskedLine>
            <MaskedLine delay={0.4}>Birthday,</MaskedLine>
          </span>
          <span className="mt-2 block italic text-[clamp(3rem,9.5vw+0.5rem,6.5rem)]">
            <MaskedLine
              delay={0.6}
              className="bg-gradient-to-r from-petal via-rose-deep to-gold bg-clip-text text-transparent drop-shadow-sm"
            >
              {CONFIG.herName}
            </MaskedLine>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: easeOut }}
          className="mt-6 max-w-lg text-base leading-relaxed text-inksoft sm:text-lg text-center mx-auto"
        >
          {CONFIG.hero.subline}
        </motion.p>

        {/* One-time special line on her birthday */}
        {isBirthdayToday && CONFIG.hero.birthdaySpecialLine && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-4 mx-auto max-w-md rounded-2xl border border-petal/30 bg-petal/10 px-4 py-2.5 backdrop-blur-sm"
          >
            <p className="font-hand text-lg text-rose-deep sm:text-xl">
              “{CONFIG.hero.birthdaySpecialLine}”
            </p>
          </motion.div>
        )}

        {/* Two Info Cards: side-by-side on desktop, stacked on mobile with generous spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: easeOut }}
          className="mt-8 grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mx-auto"
        >
          {/* Card 1: Since We Met (triggers full-screen romantic popup) */}
          <button
            type="button"
            ref={sinceMetCardRef}
            onClick={() => setShowSinceMetStory(true)}
            className="glass-card group relative flex min-h-[110px] flex-col items-center justify-center rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-[0_12px_32px_rgba(244,114,182,0.25)] sm:p-6 cursor-pointer active:scale-[0.98] ring-1 ring-petal/30 hover:ring-petal/60"
            data-testid="since-we-met-counter"
            aria-label={`Since we met: ${days} days. Tap to see us.`}
          >
            {/* Gentle pulsing ambient glow halo */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-petal/10 via-rose-500/10 to-gold/10 opacity-60 blur-md transition-opacity group-hover:opacity-100 animate-pulse" />

            {/* Tiny floating sparkle */}
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [0, 15, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2.5 right-3 text-petal/80"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>

            <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-inkmute sm:text-[11px]">
              {CONFIG.hero.sinceMetLabel || "Since we met"}
            </p>
            <p className="relative z-10 mt-1.5 font-serif text-3xl font-semibold text-rose-deep tabular-nums sm:text-4xl">
              {days.toLocaleString()}
              <span className="ml-1.5 font-sans text-xs font-medium text-inksoft">
                days
              </span>
            </p>
            <p className="relative z-10 mt-0.5 text-[11px] tabular-nums text-inksoft sm:text-xs">
              {pad(hours)}:{pad(mins)}:{pad(secs)} together
            </p>
            <p className="relative z-10 mt-1 text-[11px] font-medium text-rose-deep transition-colors group-hover:text-gold sm:text-xs">
              {CONFIG.hero.sinceMetCaption || "tap to see us ✨"}
            </p>
          </button>

          {/* Card 2: OUR TALK TIME (triggers full-screen Our Numbers story) */}
          <button
            type="button"
            ref={talkCardRef}
            onClick={() => setShowTalkStory(true)}
            className="glass-card group relative flex min-h-[110px] flex-col items-center justify-center rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-[0_12px_32px_rgba(201,151,43,0.25)] sm:p-6 cursor-pointer active:scale-[0.98] ring-1 ring-gold/30 hover:ring-gold/60"
            data-testid="our-talk-time-card"
            aria-label={`Our Talk Time: ${talkStats.totalHours} hours of just us talking. Tap to open story.`}
          >
            {/* Gentle pulsing ambient glow halo */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-gold/10 via-petal/15 to-gold/10 opacity-60 blur-md transition-opacity group-hover:opacity-100 animate-pulse" />

            {/* Tiny floating sparkle */}
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [0, 15, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2.5 right-3 text-gold/80"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>

            <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-inkmute sm:text-[11px]">
              {CONFIG.hero.talkTimeLabel || "OUR TALK TIME"}
            </p>

            <p className="relative z-10 mt-1.5 font-serif text-3xl font-bold text-gold tabular-nums sm:text-4xl drop-shadow-[0_0_12px_rgba(201,151,43,0.35)]">
              {talkStats.totalHours} hrs
            </p>

            <p className="relative z-10 mt-1 text-[11px] text-inksoft transition-colors group-hover:text-gold sm:text-xs">
              {CONFIG.hero.talkTimeCaption || "of just us talking · tap ✨"}
            </p>
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Arrow with >= 44px tap target */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          type="button"
          onClick={scrollToReveal}
          aria-label="Scroll down to the MIRU full-form reveal"
          className="flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full glass-card cursor-pointer transition-transform hover:scale-110 active:scale-90"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-rose-deep" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
