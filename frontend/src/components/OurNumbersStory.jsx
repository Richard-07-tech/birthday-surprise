import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  Heart,
  Sparkles,
  Flame,
} from "lucide-react";
import { getComputedTalkStats } from "@/config/surpriseConfig";
import { haptic, prefersReducedMotion } from "@/utils/feedback";
import HeroConfetti from "@/components/HeroConfetti";

// Web Audio synthesizer for gentle chime (zero external dependencies)
function playGentleChime(freq = 659.25) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch (e) {
    /* AudioContext blocked or not supported */
  }
}

// 24 Heart-shaped coordinates for Beat 5 (Streak)
const HEART_COORDS = [
  { x: 50, y: 22 },
  { x: 62, y: 15 },
  { x: 74, y: 14 },
  { x: 84, y: 20 },
  { x: 90, y: 30 },
  { x: 90, y: 42 },
  { x: 83, y: 54 },
  { x: 73, y: 65 },
  { x: 63, y: 75 },
  { x: 53, y: 84 },
  { x: 50, y: 88 },
  { x: 47, y: 84 },
  { x: 37, y: 75 },
  { x: 27, y: 65 },
  { x: 17, y: 54 },
  { x: 10, y: 42 },
  { x: 10, y: 30 },
  { x: 16, y: 20 },
  { x: 26, y: 14 },
  { x: 38, y: 15 },
  { x: 44, y: 20 },
  { x: 50, y: 35 },
  { x: 43, y: 48 },
  { x: 57, y: 48 },
];

export default function OurNumbersStory({ isOpen, onClose }) {
  const stats = getComputedTalkStats();
  const rm = prefersReducedMotion();

  const [currentBeat, setCurrentBeat] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [countUpNum, setCountUpNum] = useState(0);
  const [streakLitCount, setStreakLitCount] = useState(0);
  const [pulseHeart, setPulseHeart] = useState(false);

  const totalBeats = 8;
  const overlayRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

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

  // Play haptic & sound on beat change
  const triggerBeatFeedback = useCallback(
    (beatIndex) => {
      if (beatIndex === 5 || beatIndex === 7) {
        haptic([30, 45, 60]);
      } else {
        haptic(25);
      }
      if (soundEnabled) {
        const freqs = [440, 523.25, 587.33, 659.25, 698.46, 783.99, 880, 1046.5];
        playGentleChime(freqs[beatIndex] || 659.25);
      }
    },
    [soundEnabled]
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

  // Keyboard navigation & Focus Trap
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

  // Manual click / swipe only — no automatic advance timer
  // (User has full control to read at their own pace)

  // Count up animation for Beat 2 (days talked: 0 -> 310)
  useEffect(() => {
    if (!isOpen || currentBeat !== 1) return;
    if (rm) {
      setCountUpNum(stats.daysTalked);
      return;
    }

    setCountUpNum(0);
    const target = stats.daysTalked;
    const duration = 1800;
    const startTime = performance.now();

    let prevHundred = 0;
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      setCountUpNum(val);

      // Heart pulse when passing hundred
      const curHundred = Math.floor(val / 100);
      if (curHundred > prevHundred && curHundred > 0) {
        prevHundred = curHundred;
        setPulseHeart(true);
        haptic(20);
        setTimeout(() => setPulseHeart(false), 300);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isOpen, currentBeat, rm, stats.daysTalked]);

  // Glowing heart dots sequential light up for Beat 5 (Streak: 24 dots)
  useEffect(() => {
    if (!isOpen || currentBeat !== 4) return;
    if (rm) {
      setStreakLitCount(stats.longestStreakDays);
      return;
    }

    setStreakLitCount(0);
    const totalDots = stats.longestStreakDays;
    const interval = 75; // light up dot every 75ms

    const id = setInterval(() => {
      setStreakLitCount((prev) => {
        if (prev >= totalDots) {
          clearInterval(id);
          return totalDots;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(id);
  }, [isOpen, currentBeat, rm, stats.longestStreakDays]);

  // Count up animation for Beat 6 (The Big Reveal: 0 -> totalHours 372)
  useEffect(() => {
    if (!isOpen || currentBeat !== 5) return;
    if (rm) {
      setCountUpNum(stats.totalHours);
      return;
    }

    setCountUpNum(0);
    const target = stats.totalHours;
    const duration = 2000;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      setCountUpNum(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isOpen, currentBeat, rm, stats.totalHours]);

  // Reset when opened
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
    // Left 30% clicks go back, Right 70% clicks advance
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
        data-testid="our-numbers-overlay"
      >
        {/* Dreamy night sky ambient background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Deep rose to dark indigo gradient radiance */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a0820]/80 via-[#130716] to-[#08020a]" />
          <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.22)_0%,rgba(219,39,119,0.12)_45%,transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,180,76,0.18)_0%,transparent_70%)] blur-3xl" />

          {/* Twinkling ambient stars (lightweight, capped at 32 particles for 60fps) */}
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
                    animationDelay: (i * 0.2) + "s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Shooting star for Beat 4 */}
          {!rm && currentBeat === 3 && (
            <motion.div
              initial={{ x: "-20%", y: "15%", opacity: 0 }}
              animate={{ x: "120%", y: "65%", opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute h-[2px] w-36 bg-gradient-to-r from-transparent via-gold to-white shadow-[0_0_12px_#fff]"
              style={{ transform: "rotate(-25deg)" }}
            />
          )}
        </div>

        {/* Celebratory confetti on Beat 6 and Beat 8 */}
        <HeroConfetti trigger={currentBeat === 5 || currentBeat === 7} duration={3500} />

        {/* Top Header Controls (Close button & Mute toggle) */}
        <div
          className="relative z-20 flex w-full max-w-lg items-center justify-between pt-[max(0.5rem,env(safe-area-inset-top))]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-deep animate-ping" />
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/90">
              Our Numbers · Chapter {currentBeat + 1}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playGentleChime(783.99);
              }}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white active:scale-90"
              aria-label={soundEnabled ? "Mute audio" : "Enable sound chime"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-gold" />
              ) : (
                <VolumeX className="h-4 w-4 text-white/50" />
              )}
            </button>

            {/* Close Button (>= 44px tap target) */}
            <button
              type="button"
              onClick={onClose}
              data-testid="close-numbers-overlay"
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-90 cursor-pointer"
              aria-label="Close Our Numbers story"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Center Content: Animated Story Beats */}
        <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center justify-center text-center px-2 py-4">
          <AnimatePresence mode="wait">
            {/* BEAT 1: "Since the day we met…" */}
            {currentBeat === 0 && (
              <motion.div
                key="beat-0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-petal/30 bg-petal/10 shadow-[0_0_24px_rgba(244,114,182,0.2)]">
                  <Sparkles className="h-7 w-7 text-petal animate-pulse" />
                </div>
                <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white drop-shadow-md">
                  “Since the day we met…”
                </h2>
                <p className="mt-4 max-w-xs font-hand text-xl text-gold/90 sm:text-2xl">
                  Every single moment we spent together left a trace.
                </p>
                <span className="mt-8 text-xs text-white/40 tracking-wider">
                  (tap anywhere to continue)
                </span>
              </motion.div>
            )}

            {/* BEAT 2: 310 days talked */}
            {currentBeat === 1 && (
              <motion.div
                key="beat-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={pulseHeart ? { scale: [1, 1.35, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-deep/20 text-petal"
                >
                  <Heart className="h-7 w-7 fill-rose-deep text-rose-deep" />
                </motion.div>
                <div className="font-serif italic text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-petal via-rose-300 to-gold bg-clip-text text-transparent tabular-nums drop-shadow-[0_0_25px_rgba(244,114,182,0.5)]">
                  {countUpNum}
                </div>
                <p className="mt-3 font-serif text-2xl font-semibold text-white sm:text-3xl">
                  days we&apos;ve talked, and counting.
                </p>
                <p className="mt-2 font-hand text-lg text-white/70 sm:text-xl">
                  Not a single week passed without hearing your voice.
                </p>
              </motion.div>
            )}

            {/* BEAT 3: Average 1.2 hours a day with spinning clock to heart */}
            {currentBeat === 2 && (
              <motion.div
                key="beat-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {/* Clock that morphs into a glowing heart */}
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-gold/30 bg-gold/10 shadow-[0_0_28px_rgba(233,180,76,0.25)]"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 720 }}
                    transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <Clock className="h-10 w-10 text-gold" />
                  </motion.div>
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-semibold text-white">
                  On average,{" "}
                  <span className="italic text-gold underline decoration-petal/40 underline-offset-4">
                    {stats.avgHoursPerDay} hours
                  </span>{" "}
                  a day
                </div>
                <p className="mt-4 max-w-xs font-hand text-xl text-petal sm:text-2xl">
                  Stealing time between busy schedules just to be with you.
                </p>
              </motion.div>
            )}

            {/* BEAT 4: Longest day: 3 hours */}
            {currentBeat === 3 && (
              <motion.div
                key="beat-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                  <Sparkles className="h-7 w-7 text-gold" />
                </div>
                <h3 className="font-serif text-sm font-semibold uppercase tracking-[0.25em] text-gold/90">
                  Record Call
                </h3>
                <div className="mt-2 font-serif italic text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                  Our longest day:{" "}
                  <span className="bg-gradient-to-r from-gold via-petal to-rose-400 bg-clip-text text-transparent">
                    {stats.maxHoursInADay} hours
                  </span>
                </div>
                <p className="mt-4 font-hand text-2xl text-petal sm:text-3xl drop-shadow-md">
                  “…and still it felt too short.”
                </p>
              </motion.div>
            )}

            {/* BEAT 5: Longest streak: 24 days in a row */}
            {currentBeat === 4 && (
              <motion.div
                key="beat-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                {/* 24 glowing dots forming a heart */}
                <div className="relative mb-4 flex h-36 w-36 items-center justify-center">
                  {/* Subtle flame/spark background glow */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 to-gold/30 blur-xl"
                  />
                  <Flame className="absolute h-10 w-10 text-gold/60 animate-pulse" />

                  {/* 24 heart-shaped glowing dots */}
                  {HEART_COORDS.map((dot, idx) => {
                    const isLit = idx < streakLitCount;
                    return (
                      <span
                        key={idx}
                        className={`absolute h-2 w-2 rounded-full transition-all duration-300 ${
                          isLit
                            ? "bg-gold shadow-[0_0_8px_#fbbf24] scale-125"
                            : "bg-white/10 scale-75"
                        }`}
                        style={{
                          left: `${dot.x}%`,
                          top: `${dot.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Our longest streak:{" "}
                  <span className="text-gold">{stats.longestStreakDays} days</span> in a row
                </div>
                <p className="mt-4 max-w-xs font-hand text-xl text-[#FFF6E9] sm:text-2xl leading-relaxed">
                  “{stats.longestStreakDays} days without missing a single one of you.”
                </p>
              </motion.div>
            )}

            {/* BEAT 6: The Big Reveal: 372 hours of just us */}
            {currentBeat === 5 && (
              <motion.div
                key="beat-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.85, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-2 flex items-center justify-center">
                  {/* Ring pulse */}
                  <motion.div
                    className="absolute h-44 w-44 rounded-full border-2 border-gold/40"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <div className="font-serif italic text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-gold via-petal to-rose-400 bg-clip-text text-transparent tabular-nums drop-shadow-[0_0_35px_rgba(233,180,76,0.6)]">
                    {countUpNum}
                  </div>
                </div>

                <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
                  hours of just us
                </div>
                <p className="mt-3 font-hand text-xl text-gold/90 sm:text-2xl">
                  Every conversation, every late night whisper, every laugh.
                </p>
              </motion.div>
            )}

            {/* BEAT 7: Days & Minutes Conversion */}
            {currentBeat === 6 && (
              <motion.div
                key="beat-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="rounded-3xl border border-petal/30 bg-petal/10 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                  <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-relaxed text-white">
                    That&apos;s{" "}
                    <span className="italic text-gold">
                      {stats.continuousDays} days and {stats.remainingHours} hours
                    </span>{" "}
                    of nonstop talking.
                  </p>
                  <p className="mt-3 font-serif text-xl sm:text-2xl font-medium text-petal">
                    More than {stats.minutesFormatted} minutes of you and me. 💗
                  </p>
                </div>
              </motion.div>
            )}

            {/* BEAT 8 (FINALE): "And I'd still say I'm not done talking to you." */}
            {currentBeat === 7 && (
              <motion.div
                key="beat-7"
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
                  “{stats.closingLine}”
                </h2>

                <p className="mt-3 font-hand text-xl text-gold/90 sm:text-2xl">
                  Here&apos;s to a lifetime of talks ahead, MIRU.
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
