import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Sparkles, ArrowRight, Heart } from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";
import { haptic, prefersReducedMotion } from "@/utils/feedback";
import { getLockCountdown, syncServerTime } from "@/utils/dateUtils";
import HeroConfetti from "@/components/HeroConfetti";

// ─── Twinkling Stars Canvas (capped at ~35 on mobile, ~70 on desktop) ─────────
function TwinklingStars() {
  const canvasRef = useRef(null);
  const rm = prefersReducedMotion();

  useEffect(() => {
    if (rm) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 35 : 70;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.25,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.35 ? "#fff0f5" : "#fcd34d",
    }));

    function render() {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        const opacity =
          star.baseAlpha + Math.sin(star.alpha) * (1 - star.baseAlpha);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, opacity));
        ctx.shadowBlur = star.size * 3;
        ctx.shadowColor = star.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
    };
  }, [rm]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

// ─── Drifting Petals Overlay ──────────────────────────────────────────────────
const PETALS_DATA = [
  { left: "10%", delay: 0, duration: 9, size: "1rem" },
  { left: "25%", delay: 3, duration: 11, size: "1.25rem" },
  { left: "42%", delay: 1.5, duration: 10, size: "0.9rem" },
  { left: "60%", delay: 4.5, duration: 12, size: "1.1rem" },
  { left: "78%", delay: 2, duration: 9.5, size: "1.2rem" },
  { left: "90%", delay: 5, duration: 10.5, size: "0.85rem" },
];

function DriftingPetals() {
  const rm = prefersReducedMotion();
  if (rm) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {PETALS_DATA.map((p, idx) => (
        <motion.span
          key={idx}
          className="absolute select-none opacity-40 filter drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]"
          style={{ left: p.left, top: "-5%", fontSize: p.size }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, 20, -15, 10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          🌸
        </motion.span>
      ))}
    </div>
  );
}

// ─── Sparkle / Heart Burst Effect upon Unlock ─────────────────────────────────
function UnlockBurstEffect() {
  const rm = prefersReducedMotion();
  if (rm) return null;

  const items = [
    { emoji: "✨", angle: 0, dist: 140, delay: 0 },
    { emoji: "💖", angle: 30, dist: 160, delay: 0.04 },
    { emoji: "🌸", angle: 60, dist: 130, delay: 0.02 },
    { emoji: "💫", angle: 90, dist: 170, delay: 0.06 },
    { emoji: "💕", angle: 120, dist: 150, delay: 0.03 },
    { emoji: "✨", angle: 150, dist: 160, delay: 0.05 },
    { emoji: "💗", angle: 180, dist: 140, delay: 0.01 },
    { emoji: "🌸", angle: 210, dist: 170, delay: 0.07 },
    { emoji: "💖", angle: 240, dist: 150, delay: 0.03 },
    { emoji: "💫", angle: 270, dist: 140, delay: 0.05 },
    { emoji: "✨", angle: 300, dist: 165, delay: 0.02 },
    { emoji: "💕", angle: 330, dist: 155, delay: 0.08 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible">
      {items.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180;
        const x = Math.cos(rad) * item.dist;
        const y = Math.sin(rad) * item.dist;

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1.35, 1],
              opacity: [0, 1, 0],
              x,
              y: y - 20,
              rotate: [0, i % 2 === 0 ? 35 : -35],
            }}
            transition={{
              duration: 1.4,
              delay: item.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute text-2xl sm:text-3xl select-none drop-shadow-[0_4px_16px_rgba(244,114,182,0.85)]"
          >
            {item.emoji}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Countdown Digit Box with subtle tick flip/fade ───────────────────────────
function CountdownBox({ value, label }) {
  const rm = prefersReducedMotion();

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-14 sm:h-20 min-w-[2.75ch] sm:min-w-[3ch] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] px-2 sm:px-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={rm ? {} : { y: -14, opacity: 0 }}
            animate={rm ? {} : { y: 0, opacity: 1 }}
            exit={rm ? {} : { y: 14, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-serif text-[clamp(1.75rem,7vw,3.5rem)] font-bold tracking-tight bg-gradient-to-r from-gold via-petal to-gold-soft bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(233,180,76,0.45)] select-none"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/60 select-none">
        {label}
      </span>
    </div>
  );
}

// ─── Main LockPage Component ──────────────────────────────────────────────────
export default function LockPage({ onUnlock }) {
  const rm = prefersReducedMotion();
  const { lock } = CONFIG;

  const [countdown, setCountdown] = useState(() =>
    getLockCountdown(CONFIG.unlockAt)
  );
  const [wiggling, setWiggling] = useState(false);
  const [tapMessage, setTapMessage] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [unlockTransition, setUnlockTransition] = useState(false);

  // Sync server time and run live countdown interval
  useEffect(() => {
    syncServerTime().then(() => {
      setCountdown(getLockCountdown(CONFIG.unlockAt));
    });

    const interval = setInterval(() => {
      const next = getLockCountdown(CONFIG.unlockAt);
      setCountdown((prev) => {
        // Trigger unlock celebration when countdown transitions from locked to unlocked
        if (!prev.isUnlocked && next.isUnlocked) {
          setJustUnlocked(true);
          haptic([40, 60, 40, 90, 160]);
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([50, 50, 150, 50, 200]);
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isUnlocked = countdown.isUnlocked || justUnlocked;

  // Tap-the-lock interaction
  const handleLockTap = () => {
    if (isUnlocked || unlockTransition) return;
    haptic([25, 40, 25]);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 40, 30]);
    }
    setWiggling(true);
    setTimeout(() => setWiggling(false), 500);

    const msgs = lock.tapMessages || [
      lock.lockedTapMessage || "Not yet, birthday girl 😏",
      "Almost there! ✨",
      "Patience is cute on you 💖",
      "Something magical is waiting for you 💫",
    ];
    setTapMessage(msgs[tapCount % msgs.length]);
    setTapCount((prev) => prev + 1);

    setTimeout(() => setTapMessage(null), 3000);
  };

  // Open surprise button handler
  const handleOpenSurprise = () => {
    if (unlockTransition) return;
    setUnlockTransition(true);
    haptic([40, 60, 40, 90, 160]);
    setTimeout(() => {
      onUnlock();
    }, rm ? 300 : 1200);
  };

  const daysStr = String(countdown.days).padStart(2, "0");
  const hoursStr = String(countdown.hours).padStart(2, "0");
  const minsStr = String(countdown.mins).padStart(2, "0");
  const secsStr = String(countdown.secs).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: "blur(18px)",
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      className="fixed inset-0 z-50 flex min-h-[100dvh] w-full flex-col items-center justify-between overflow-x-hidden bg-gradient-to-b from-[#0b0512] via-[#150a1e] to-[#0d0717] px-4 py-8 text-center text-white pt-safe pb-safe"
      data-testid="lock-page"
    >
      {/* Background ambient stars & petals */}
      <TwinklingStars />
      <DriftingPetals />

      {/* Confetti celebration burst upon unlocking */}
      <HeroConfetti trigger={isUnlocked || unlockTransition} duration={3500} />

      {/* Ambient glowing orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.18)] blur-3xl sm:h-96 sm:w-96"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-[rgba(233,180,76,0.14)] blur-3xl"
        />
      </div>

      {/* Dreamy light bloom upon unlocking transition */}
      <AnimatePresence>
        {unlockTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-b from-white/30 via-petal/25 to-gold/20 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Top spacer */}
      <div className="h-2 sm:h-6" />

      {/* Main center content */}
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center justify-center">
        {/* Softly glowing padlock */}
        <div className="relative mb-5 flex items-center justify-center">
          {isUnlocked && <UnlockBurstEffect />}

          <motion.button
            type="button"
            onClick={handleLockTap}
            aria-label={isUnlocked ? "Unlocked padlock" : "Locked padlock, tap to check"}
            data-testid="lock-icon-button"
            animate={
              isUnlocked
                ? {
                    scale: [1, 1.15, 1.08],
                    boxShadow: "0 0 60px rgba(233,180,76,0.85)",
                  }
                : wiggling
                ? { rotate: [-12, 12, -8, 8, -4, 4, 0], scale: [1, 1.08, 1] }
                : { y: [0, -5, 0] }
            }
            transition={
              isUnlocked
                ? { duration: 0.8, ease: "easeOut" }
                : wiggling
                ? { duration: 0.5, ease: "easeInOut" }
                : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            }
            className="group relative flex h-20 w-20 sm:h-24 sm:w-24 min-h-[48px] min-w-[48px] items-center justify-center rounded-3xl border border-white/15 bg-white/[0.06] shadow-[0_0_36px_rgba(244,114,182,0.3)] backdrop-blur-md cursor-pointer transition-all active:scale-95"
          >
            {/* Outer halo glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-petal/25 to-gold/30 opacity-70 blur-md transition-opacity group-hover:opacity-100" />

            {isUnlocked ? (
              <Unlock className="relative z-10 h-9 w-9 sm:h-11 sm:w-11 text-gold drop-shadow-[0_0_18px_rgba(233,180,76,1)] animate-bounce" />
            ) : (
              <Lock className="relative z-10 h-9 w-9 sm:h-11 sm:w-11 text-petal drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
            )}

            {/* Little heart badge */}
            <motion.span
              animate={isUnlocked ? { scale: [1, 1.4, 1.15] } : { scale: [1, 1.1, 1] }}
              transition={{ duration: isUnlocked ? 0.6 : 2.4, repeat: isUnlocked ? 0 : Infinity }}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md"
            >
              <Heart className="h-3 w-3 fill-current text-white" />
            </motion.span>
          </motion.button>

          <Sparkles className="pointer-events-none absolute -top-2 -right-2 h-5 w-5 text-gold animate-pulse" />
        </div>

        {/* Playful tap response message */}
        <div className="min-h-[28px] flex items-center justify-center">
          <AnimatePresence>
            {tapMessage && !isUnlocked && (
              <motion.p
                key={tapMessage}
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="font-hand text-lg text-gold drop-shadow-md sm:text-xl"
              >
                {tapMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-3 font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl max-w-md px-2"
        >
          {isUnlocked
            ? lock.unlockedHeading || "Your surprise is unlocked! ✨"
            : lock.title}
        </motion.h1>

        {/* Subtitle */}
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gold/90 sm:text-sm">
          {isUnlocked
            ? lock.unlockedSub || "Step inside, birthday girl 🌸"
            : lock.countdownLabel || lock.subtitle || "Opens at midnight on 3 November"}
        </p>

        {/* Countdown OR Unlocked Action Button */}
        {!isUnlocked ? (
          <div className="mt-8 w-full">
            {/* Live Countdown digits on a single line */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-full max-w-sm sm:max-w-md mx-auto">
              {countdown.days > 0 && (
                <>
                  <CountdownBox value={daysStr} label="Days" />
                  <span className="font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-light text-petal/60 pb-6 select-none">
                    :
                  </span>
                </>
              )}
              <CountdownBox value={hoursStr} label="Hours" />
              <span className="font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-light text-petal/60 pb-6 select-none">
                :
              </span>
              <CountdownBox value={minsStr} label="Mins" />
              <span className="font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-light text-petal/60 pb-6 select-none">
                :
              </span>
              <CountdownBox value={secsStr} label="Secs" />
            </div>

            {/* Teaser text */}
            <p className="mt-6 font-hand text-base text-white/70 sm:text-lg">
              {lock.teaser || "Come back on your birthday 🎂"}
            </p>
          </div>
        ) : (
          /* Unlocked: Dramatic "Open your surprise ✨" button */
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center justify-center w-full"
          >
            <motion.button
              type="button"
              disabled={unlockTransition}
              onClick={handleOpenSurprise}
              data-testid="open-surprise-button"
              whileHover={{ scale: 1.05, boxShadow: "0 0 45px rgba(244,114,182,0.7)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex min-h-[56px] w-full max-w-xs items-center justify-center gap-3 rounded-full bg-gradient-to-r from-petal via-rose-500 to-gold px-8 py-3.5 font-sans text-base font-semibold tracking-wide text-white shadow-[0_10px_35px_rgba(244,114,182,0.5)] cursor-pointer overflow-hidden transition-all"
            >
              <Sparkles className="h-5 w-5 text-gold animate-bounce" />
              <span>{lock.unlockedButton || "Open your surprise ✨"}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </motion.button>

            <p className="mt-3 font-hand text-base text-gold/90 sm:text-lg">
              Tap to enter your world 💖
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom hint / tiny copy */}
      <div className="relative z-10 text-xs text-white/40">
        {!isUnlocked && "3 November 2026 · Asia/Kolkata"}
      </div>
    </motion.div>
  );
}
