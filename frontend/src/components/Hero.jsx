import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";

const easeOut = [0.16, 1, 0.3, 1];

function MaskedLine({ children, delay, className }) {
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

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function getCounters(now) {
  const start = new Date(`${CONFIG.startDate}T00:00:00`);
  const diff = Math.max(0, now - start.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const b = new Date(`${CONFIG.birthday}T00:00:00`);
  const today = new Date();
  let next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  const msLeft = next - new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (msLeft < 0) next = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate());
  const daysUntil = Math.round((next - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  const isToday = daysUntil === 0;
  return { days, hours, mins, secs, daysUntil, isToday, startDate: start };
}

const pad = (n) => String(n).padStart(2, "0");

export default function Hero() {
  const now = useNow();
  const { days, hours, mins, secs, daysUntil, isToday, startDate } = getCounters(now);
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 800], [0, 140]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const dateLabel = startDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      ref={ref}
      className="full-vh relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pb-16 pt-20 sm:px-8"
      data-testid="hero-section"
    >
      {/* parallax glows */}
      <motion.div style={{ y: glowY }} className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[rgba(244,114,182,0.18)] blur-3xl" />
        <div className="absolute -right-16 bottom-24 h-80 w-80 rounded-full bg-[rgba(201,151,43,0.15)] blur-3xl" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative mx-auto w-full max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {CONFIG.hero.eyebrow}
        </motion.p>

        <h1
          className="font-serif font-semibold leading-[1.05] text-ink"
          data-testid="hero-headline"
        >
          <span className="text-4xl sm:text-6xl lg:text-7xl">
            <MaskedLine delay={0.25}>Happy</MaskedLine>
            <MaskedLine delay={0.4}>Birthday,</MaskedLine>
          </span>
          <span className="mt-2 block text-5xl italic sm:text-7xl lg:text-8xl">
            <MaskedLine
              delay={0.6}
              className="bg-gradient-to-r from-petal via-rose-deep to-gold bg-clip-text text-transparent"
            >
              {CONFIG.herName}
            </MaskedLine>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: easeOut }}
          className="mt-6 max-w-md text-base leading-relaxed text-inksoft sm:text-lg"
        >
          {CONFIG.hero.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: easeOut }}
          className="mt-9 grid grid-cols-2 gap-3 sm:mt-10 sm:max-w-md"
        >
          <div
            className="glass-card rounded-2xl p-4 text-center sm:p-5"
            data-testid="days-together-counter"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-inkmute sm:text-[11px]">
              {CONFIG.hero.togetherLabel}
            </p>
            <p className="mt-1 font-serif text-3xl font-semibold text-rose-deep tabular-nums sm:text-4xl">
              {days.toLocaleString()}
              <span className="ml-1 font-sans text-xs font-medium text-inksoft">days</span>
            </p>
            <p className="mt-0.5 text-[11px] tabular-nums text-inksoft sm:text-xs">
              {pad(hours)}:{pad(mins)}:{pad(secs)} and counting
            </p>
          </div>
          <div
            className="glass-card rounded-2xl p-4 text-center sm:p-5"
            data-testid="birthday-countdown"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-inkmute sm:text-[11px]">
              {CONFIG.hero.untilLabel}
            </p>
            {isToday ? (
              <p className="mt-2 font-serif text-2xl font-semibold italic text-gold sm:text-3xl">
                {CONFIG.hero.todayLine}
              </p>
            ) : (
              <>
                <p className="mt-1 font-serif text-3xl font-semibold text-gold tabular-nums sm:text-4xl">
                  {daysUntil}
                  <span className="ml-1 font-sans text-xs font-medium text-inksoft">
                    {daysUntil === 1 ? "sleep" : "sleeps"}
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-inksoft sm:text-xs">
                  the countdown is on
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-11 w-11 items-center justify-center rounded-full glass-card"
        >
          <ChevronDown className="h-5 w-5 text-rose-deep" />
        </motion.div>
      </motion.div>
    </section>
  );
}
