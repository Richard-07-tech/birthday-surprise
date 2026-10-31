import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCcw,
  Sun,
  Moon,
  Flower2,
  Leaf,
  Snowflake,
  Heart,
  Sparkles,
  Crown,
} from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";
import {
  getSinceMetCounter,
  getAuthoritativeTime,
} from "@/utils/dateUtils";
import { haptic, prefersReducedMotion } from "@/utils/feedback";
import HeroConfetti from "@/components/HeroConfetti";

const pad = (n) => String(n).padStart(2, "0");

export default function SinceWeMetStory({ isOpen, onClose }) {
  const rm = prefersReducedMotion();
  const [currentBeat, setCurrentBeat] = useState(0);
  const [countUpDays, setCountUpDays] = useState(0);
  const [seasonsLit, setSeasonsLit] = useState(0);

  // Live ticking state for Beat 3
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isOpen]);

  // Lock body scroll when overlay is open so parent page does not shift
  useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const { days, hours, mins, secs } = getSinceMetCounter(CONFIG.metOn);
  const nowMs = getAuthoritativeTime();
  const oneYearTimestamp = new Date("2026-11-03T00:00:00+05:30").getTime();
  const isOneYearOrMore = nowMs >= oneYearTimestamp;

  const totalBeats = 7;
  const overlayRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const { sinceMetStory } = CONFIG;

  const triggerBeatFeedback = useCallback(
    (beatIndex) => {
      if (beatIndex === 1 || beatIndex === 6) {
        haptic([30, 45, 60]);
      } else {
        haptic(25);
      }
    },
    []
  );

  const goToNextBeat = useCallback(() => {
    if (currentBeat < totalBeats - 1) {
      setCurrentBeat((prev) => {
        const next = prev + 1;
        triggerBeatFeedback(next);
        return next;
      });
    }
  }, [currentBeat, totalBeats, triggerBeatFeedback]);

  const goToPrevBeat = useCallback(() => {
    if (currentBeat > 0) {
      setCurrentBeat((prev) => {
        const next = prev - 1;
        triggerBeatFeedback(next);
        return next;
      });
    }
  }, [currentBeat, triggerBeatFeedback]);

  // Keyboard navigation & Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        goToNextBeat();
      } else if (e.key === "ArrowLeft") {
        goToPrevBeat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goToNextBeat, goToPrevBeat]);

  // Count up animation for Beat 2 (days count)
  useEffect(() => {
    if (!isOpen || currentBeat !== 1) return;
    if (rm || isOneYearOrMore) {
      setCountUpDays(days);
      return;
    }

    setCountUpDays(0);
    const target = days;
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      setCountUpDays(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isOpen, currentBeat, rm, days, isOneYearOrMore]);

  // Sequential seasons lighting for Beat 5
  useEffect(() => {
    if (!isOpen || currentBeat !== 4) return;
    if (rm) {
      setSeasonsLit(4);
      return;
    }

    setSeasonsLit(0);
    const interval = 450;
    const id = setInterval(() => {
      setSeasonsLit((prev) => {
        if (prev >= 4) {
          clearInterval(id);
          return 4;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(id);
  }, [isOpen, currentBeat, rm]);

  // Reset to Beat 1 on opening
  useEffect(() => {
    if (isOpen) {
      setCurrentBeat(0);
      triggerBeatFeedback(0);
    }
  }, [isOpen, triggerBeatFeedback]);

  // Touch Swipe Handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        goToNextBeat(); // swipe left -> next
      } else {
        goToPrevBeat(); // swipe right -> prev
      }
    }
  };

  const handleOverlayClick = (e) => {
    // Left 28% clicks go back, Right 72% clicks advance
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.28) {
      goToPrevBeat();
    } else {
      goToNextBeat();
    }
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-[9999] flex min-h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-[#0d040e]/95 px-5 py-6 text-white backdrop-blur-2xl select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleOverlayClick}
        data-testid="since-we-met-overlay"
      >
        {/* Dreamy night sky ambient background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Deep rose-to-indigo gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a0820]/80 via-[#130716] to-[#08020a]" />
          <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.22)_0%,rgba(219,39,119,0.12)_45%,transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,180,76,0.18)_0%,transparent_70%)] blur-3xl" />

          {/* Twinkling ambient stars (capped around 32 for smooth 60fps) */}
          {!rm && (
            <div className="absolute inset-0">
              {Array.from({ length: 32 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: (i % 3) + 1.2 + "px",
                    height: (i % 3) + 1.2 + "px",
                    top: (i * 19) % 95 + "%",
                    left: (i * 31) % 96 + "%",
                    opacity: 0.3 + (i % 5) * 0.14,
                    animationDuration: 2.2 + (i % 4) * 0.8 + "s",
                    animationDelay: i * 0.2 + "s",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Confetti burst on finale (Beat 7) */}
        <HeroConfetti trigger={currentBeat === 6} duration={4000} />

        {/* Top Header Controls */}
        <div
          className="relative z-20 flex w-full max-w-lg items-center justify-between pt-[max(0.5rem,env(safe-area-inset-top))]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-deep animate-ping" />
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/90">
              Since We Met · Chapter {currentBeat + 1}
            </p>
          </div>

          {/* Close Button (>= 44px tap target) */}
          <button
            type="button"
            onClick={onClose}
            data-testid="close-since-we-met-overlay"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-90 cursor-pointer"
            aria-label="Close Since We Met story"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Center Content: Animated Story Beats */}
        <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center justify-center text-center px-2 py-4">
          <AnimatePresence mode="wait">
            {/* BEAT 1: "3 November 2025… the day my life got a little brighter." */}
            {currentBeat === 0 && (
              <motion.div
                key="since-beat-0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-petal/30 bg-petal/10 shadow-[0_0_24px_rgba(244,114,182,0.2)]">
                  <Sparkles className="h-7 w-7 text-petal animate-pulse" />
                </div>
                <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-gold drop-shadow-md">
                  “{sinceMetStory.beat1Date || "3 November 2025…" }”
                </h2>
                <p className="mt-4 max-w-xs font-hand text-2xl text-white sm:text-3xl leading-snug">
                  {sinceMetStory.beat1Line || "the day my life got a little brighter."}
                </p>
                <span className="mt-8 text-xs text-white/40 tracking-wider">
                  (tap anywhere to continue)
                </span>
              </motion.div>
            )}

            {/* BEAT 2: Count up days / 1 year */}
            {currentBeat === 1 && (
              <motion.div
                key="since-beat-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {isOneYearOrMore ? (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="mb-2 flex items-center justify-center text-gold"
                    >
                      <Crown className="h-9 w-9 drop-shadow-[0_0_12px_#fbbf24] animate-bounce" />
                    </motion.div>
                    <div className="font-serif italic text-7xl sm:text-8xl font-bold bg-gradient-to-r from-gold via-petal to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(233,180,76,0.6)]">
                      1 year
                    </div>
                  </>
                ) : (
                  <div className="font-serif italic text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-petal via-rose-300 to-gold bg-clip-text text-transparent tabular-nums drop-shadow-[0_0_25px_rgba(244,114,182,0.5)]">
                    {countUpDays}
                  </div>
                )}
                <p className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
                  days of you
                </p>
                <p className="mt-2 font-hand text-lg text-white/70 sm:text-xl">
                  {isOneYearOrMore
                    ? "365 days of laughter, warmth, and growing together."
                    : "and each one has been a gift."}
                </p>
              </motion.div>
            )}

            {/* BEAT 3: Live ticking hours, minutes, seconds */}
            {currentBeat === 2 && (
              <motion.div
                key="since-beat-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-5">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md shadow-inner">
                    <span className="font-serif text-3xl font-bold tabular-nums text-petal sm:text-4xl">
                      {pad(hours)}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                      Hours
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md shadow-inner">
                    <span className="font-serif text-3xl font-bold tabular-nums text-gold sm:text-4xl">
                      {pad(mins)}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                      Mins
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md shadow-inner">
                    <span className="font-serif text-3xl font-bold tabular-nums text-rose-300 sm:text-4xl">
                      {pad(secs)}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
                      Secs
                    </span>
                  </div>
                </div>

                <h3 className="font-serif italic text-2xl sm:text-3xl font-semibold text-white">
                  “…and every second still counts.”
                </h3>
                <p className="mt-2 font-hand text-lg text-petal sm:text-xl">
                  Time never stops, and neither does my love.
                </p>
              </motion.div>
            )}

            {/* BEAT 4: Sun & Moon arcing across the sky */}
            {currentBeat === 3 && (
              <motion.div
                key="since-beat-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                {/* Sun & Moon Arcing Celestial Track */}
                <div className="relative mb-6 flex h-32 w-64 items-end justify-center overflow-hidden">
                  {/* Subtle celestial arc line */}
                  <div className="absolute inset-x-4 bottom-2 h-24 rounded-t-full border-t border-dashed border-white/20" />

                  {/* Sun arcing */}
                  <motion.div
                    initial={{ left: "10%", bottom: "10%", opacity: 0 }}
                    animate={{ left: "38%", bottom: "70%", opacity: 1 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    className="absolute flex items-center justify-center"
                  >
                    <Sun className="h-9 w-9 text-gold drop-shadow-[0_0_14px_rgba(233,180,76,0.8)]" />
                  </motion.div>

                  {/* Moon arcing */}
                  <motion.div
                    initial={{ right: "10%", bottom: "10%", opacity: 0 }}
                    animate={{ right: "38%", bottom: "70%", opacity: 1 }}
                    transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
                    className="absolute flex items-center justify-center"
                  >
                    <Moon className="h-8 w-8 text-petal drop-shadow-[0_0_14px_rgba(244,114,182,0.8)]" />
                  </motion.div>
                </div>

                <h3 className="font-serif italic text-3xl sm:text-4xl font-semibold text-white">
                  “Every sunrise, every sunset…”
                </h3>
                <p className="mt-3 font-hand text-2xl text-gold/90 sm:text-3xl">
                  we got to share the same sky.
                </p>
              </motion.div>
            )}

            {/* BEAT 5: Four Seasons lighting up one by one */}
            {currentBeat === 4 && (
              <motion.div
                key="since-beat-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                {/* Four Season Icons */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { label: "Spring", icon: Flower2, color: "text-petal", lit: seasonsLit >= 1 },
                    { label: "Summer", icon: Sun, color: "text-gold", lit: seasonsLit >= 2 },
                    { label: "Autumn", icon: Leaf, color: "text-rose-400", lit: seasonsLit >= 3 },
                    { label: "Winter", icon: Snowflake, color: "text-sky-300", lit: seasonsLit >= 4 },
                  ].map((s, idx) => {
                    const IconComp = s.icon;
                    return (
                      <div
                        key={s.label}
                        className={`flex flex-col items-center justify-center rounded-2xl p-3 sm:p-4 border transition-all duration-500 ${
                          s.lit
                            ? "border-petal/40 bg-white/10 shadow-[0_0_16px_rgba(244,114,182,0.3)] scale-105"
                            : "border-white/5 bg-white/[0.02] opacity-30"
                        }`}
                      >
                        <IconComp className={`h-8 w-8 ${s.lit ? s.color : "text-white/40"}`} />
                        <span className="mt-1.5 text-[11px] font-medium text-white/70">
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
                  Four seasons.
                </h3>
                <p className="mt-2 font-serif italic text-2xl sm:text-3xl text-gold">
                  All with you.
                </p>
                <p className="mt-2 font-hand text-lg text-white/70 sm:text-xl">
                  Through every weather, you remained my favorite feeling.
                </p>
              </motion.div>
            )}

            {/* BEAT 6: Glowing heart getting brighter and larger */}
            {currentBeat === 5 && (
              <motion.div
                key="since-beat-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {/* Slow glowing heart that gets brighter and larger */}
                <motion.div
                  className="relative mb-5 flex h-28 w-28 items-center justify-center"
                  animate={{ scale: [1, 1.25, 1.05] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/40 via-petal/40 to-gold/30 blur-2xl animate-pulse" />
                  <Heart className="relative z-10 h-16 w-16 fill-rose-500 text-rose-500 drop-shadow-[0_0_24px_rgba(244,114,182,0.9)]" />
                </motion.div>

                <h3 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl font-semibold text-white px-2 leading-relaxed">
                  “{sinceMetStory.beat6Line || "Most things don't last. Some things only grow stronger."}”
                </h3>
              </motion.div>
            )}

            {/* BEAT 7 (FINALE): "One year of you, MIRU. And I'd choose you again." */}
            {currentBeat === 6 && (
              <motion.div
                key="since-beat-6"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Calm breathing glowing heart */}
                <motion.div
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600/30 to-gold/30 shadow-[0_0_35px_rgba(244,114,182,0.45)]"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="h-10 w-10 fill-rose-500 text-rose-500 drop-shadow-[0_0_12px_rgba(219,39,119,0.9)]" />
                </motion.div>

                <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug text-white drop-shadow-lg">
                  “
                  {isOneYearOrMore
                    ? sinceMetStory.finaleBirthdayLine || "Happy 1 year, and happy 19th, MIRU 🎂"
                    : sinceMetStory.finaleLine || "One year of you, MIRU. And I'd choose you again."}
                  ”
                </h2>

                <p className="mt-3 font-hand text-xl text-gold/90 sm:text-2xl">
                  {isOneYearOrMore
                    ? "My whole heart, today and for all the years to come."
                    : "Every single day with you is my favourite."}
                </p>

                {/* Final Actions */}
                <div className="mt-8 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[46px] rounded-full bg-gradient-to-r from-rose-500 via-petal to-gold px-8 py-2.5 font-sans text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(219,39,119,0.45)] transition-transform active:scale-95 cursor-pointer"
                  >
                    Close & Keep Exploring
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentBeat(0);
                      triggerBeatFeedback(0);
                    }}
                    className="flex min-h-[44px] items-center gap-1.5 text-xs text-white/60 transition-colors hover:text-gold active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Replay ✨
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation & Progress Dots */}
        <div
          className="relative z-20 flex w-full max-w-sm flex-col items-center justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalBeats }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentBeat(i);
                  triggerBeatFeedback(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentBeat === i
                    ? "w-7 bg-gold shadow-[0_0_8px_#fbbf24]"
                    : i < currentBeat
                    ? "w-2 bg-petal/60"
                    : "w-2 bg-white/20"
                }`}
                aria-label={`Jump to beat ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between w-full text-[11px] text-white/50 tracking-wider">
            <button
              type="button"
              onClick={goToPrevBeat}
              disabled={currentBeat === 0}
              className="py-1 px-2.5 rounded-lg border border-white/10 bg-white/5 hover:text-white transition-opacity disabled:opacity-20 cursor-pointer"
            >
              ← Back
            </button>
            <span className="text-[10px] text-white/40">Tap anywhere to advance</span>
            <button
              type="button"
              onClick={goToNextBeat}
              disabled={currentBeat === totalBeats - 1}
              className="py-1 px-2.5 rounded-lg border border-gold/30 bg-gold/10 text-gold font-semibold transition-opacity disabled:opacity-20 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
