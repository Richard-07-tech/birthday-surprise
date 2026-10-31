import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Sparkles, ArrowRight, Heart } from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";
import { haptic, prefersReducedMotion } from "@/utils/feedback";
import HeroConfetti from "@/components/HeroConfetti";

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

    const starCount = 70;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.3 ? "#fff0f5" : "#fcd34d",
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

// Cute 360-degree floating hearts burst
function HeartBurstEffect() {
  const rm = prefersReducedMotion();
  const hearts = [
    { emoji: "💖", angle: 0, dist: 130, delay: 0 },
    { emoji: "✨", angle: 45, dist: 160, delay: 0.05 },
    { emoji: "💕", angle: 90, dist: 140, delay: 0.02 },
    { emoji: "🌸", angle: 135, dist: 170, delay: 0.08 },
    { emoji: "💗", angle: 180, dist: 130, delay: 0.03 },
    { emoji: "💫", angle: 225, dist: 160, delay: 0.06 },
    { emoji: "💖", angle: 270, dist: 140, delay: 0.04 },
    { emoji: "🥰", angle: 315, dist: 170, delay: 0.07 },
    { emoji: "✨", angle: 25, dist: 210, delay: 0.1 },
    { emoji: "💕", angle: 155, dist: 200, delay: 0.12 },
    { emoji: "💗", angle: 205, dist: 220, delay: 0.11 },
    { emoji: "🌸", angle: 335, dist: 205, delay: 0.13 },
  ];

  if (rm) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible">
      {hearts.map((h, i) => {
        const rad = (h.angle * Math.PI) / 180;
        const x = Math.cos(rad) * h.dist;
        const y = Math.sin(rad) * h.dist;

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1.35, 1],
              opacity: [0, 1, 0],
              x,
              y: y - 25, // gentle float upward
              rotate: [0, (i % 2 === 0 ? 30 : -30)],
            }}
            transition={{
              duration: 1.25,
              delay: h.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute text-2xl sm:text-3xl select-none drop-shadow-[0_4px_12px_rgba(244,114,182,0.8)]"
          >
            {h.emoji}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function LockPage({ onUnlock }) {
  const [wiggling, setWiggling] = useState(false);
  const [tapMessage, setTapMessage] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [unlocking, setUnlocking] = useState(false);

  const rm = prefersReducedMotion();
  const { lock } = CONFIG;

  // Tap-the-lock interaction
  const handleLockTap = () => {
    if (unlocking) return;
    haptic([20, 35, 20]);
    setWiggling(true);
    setTimeout(() => setWiggling(false), 500);

    const msgs = lock.tapMessages || [
      "Hey birthday girl 😏",
      "Ready for your surprise? ✨",
      "Tap the cute button below! 💖",
      "Something magical is waiting for you 💫",
    ];
    setTapMessage(msgs[tapCount % msgs.length]);
    setTapCount((prev) => prev + 1);

    setTimeout(() => setTapMessage(null), 3200);
  };

  // Dramatic, cinematic and cute transition trigger
  const handleGoTo = () => {
    if (unlocking) return;
    setUnlocking(true);
    haptic([40, 60, 40, 90, 160]);

    // Give time for the cinematic lock burst, confetti, soundwave ripple & bloom
    setTimeout(() => {
      onUnlock();
    }, rm ? 400 : 1350);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
      className="fixed inset-0 z-50 flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#0d070d] px-4 py-8 text-center text-white"
      data-testid="lock-page"
    >
      {/* Twinkling star field */}
      <TwinklingStars />

      {/* Confetti celebration burst during unlock */}
      <HeroConfetti trigger={unlocking} duration={3500} />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            unlocking
              ? { scale: [1, 2.5], opacity: [0.2, 0.65] }
              : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }
          }
          transition={{ duration: unlocking ? 1.2 : 5, repeat: unlocking ? 0 : Infinity }}
          className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.22)] blur-3xl sm:h-96 sm:w-96"
        />
        <motion.div
          animate={
            unlocking
              ? { scale: [1, 2.2], opacity: [0.15, 0.5] }
              : { scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }
          }
          transition={{ duration: unlocking ? 1.2 : 6, repeat: unlocking ? 0 : Infinity }}
          className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-[rgba(233,180,76,0.18)] blur-3xl"
        />
      </div>

      {/* Dreamy full-screen cinematic light bloom upon transition */}
      <AnimatePresence>
        {unlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-b from-white/30 via-petal/25 to-gold/20 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center justify-center">
        {/* Softly glowing interactive padlock with heart & ripple burst */}
        <div className="relative mb-6 flex items-center justify-center">
          {unlocking && <HeartBurstEffect />}

          {/* Golden shockwave ripple rings on unlock */}
          {unlocking && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-petal/70"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 1.3, delay: 0.15, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-gold/70"
              />
            </>
          )}

          <motion.button
            type="button"
            onClick={unlocking ? undefined : handleLockTap}
            aria-label="Interactive lock"
            data-testid="lock-icon-button"
            animate={
              unlocking
                ? {
                    scale: [1, 1.25, 1.12],
                    rotate: [0, -8, 8, 0],
                    boxShadow: "0 0 70px rgba(244,114,182,0.85)",
                  }
                : wiggling
                ? { rotate: [-10, 10, -8, 8, -4, 4, 0], scale: [1, 1.1, 1] }
                : { y: [0, -6, 0] }
            }
            transition={
              unlocking
                ? { duration: 0.7, ease: "easeOut" }
                : wiggling
                ? { duration: 0.5, ease: "easeInOut" }
                : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            }
            className="group relative flex h-24 w-24 min-h-[48px] min-w-[48px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(244,114,182,0.25)] backdrop-blur-md cursor-pointer transition-all active:scale-95"
          >
            {/* Outer halo glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-petal/25 to-gold/30 opacity-70 blur-md transition-opacity group-hover:opacity-100" />

            {unlocking ? (
              <Unlock className="relative z-10 h-10 w-10 text-gold drop-shadow-[0_0_18px_rgba(233,180,76,1)] transition-transform animate-bounce" />
            ) : (
              <Lock className="relative z-10 h-10 w-10 text-petal drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
            )}

            {/* Little heart badge with gentle pulse */}
            <motion.span
              animate={unlocking ? { scale: [1, 1.5, 1.2], rotate: [0, 20, 0] } : { scale: [1, 1.12, 1] }}
              transition={{ duration: unlocking ? 0.6 : 2.2, repeat: unlocking ? 0 : Infinity }}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md"
            >
              <Heart className="h-3 w-3 fill-current text-white" />
            </motion.span>
          </motion.button>

          {/* Sparkles around lock */}
          <Sparkles className="pointer-events-none absolute -top-2 -right-2 h-5 w-5 text-gold animate-pulse" />
        </div>

        {/* Playful tap response message */}
        <div className="min-h-[30px] flex items-center justify-center">
          <AnimatePresence>
            {tapMessage && !unlocking && (
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

        {/* Title & subtitle */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl"
        >
          {unlocking ? "Opening your surprise... ✨" : lock.title}
        </motion.h1>

        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold/90 sm:text-sm">
          {unlocking ? "Hold on to your heart 💖" : lock.subtitle}
        </p>

        {/* Cute Go-To Button with dramatic state change on click */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center w-full"
        >
          <motion.button
            type="button"
            disabled={unlocking}
            onClick={handleGoTo}
            data-testid="open-surprise-button"
            whileHover={unlocking ? {} : { scale: 1.05, boxShadow: "0 0 40px rgba(244,114,182,0.65)" }}
            whileTap={unlocking ? {} : { scale: 0.95 }}
            animate={
              unlocking
                ? {
                    scale: [1, 1.08, 1.04],
                    boxShadow: "0 0 50px rgba(233,180,76,0.9)",
                  }
                : {}
            }
            className="group relative flex min-h-[56px] w-full max-w-xs items-center justify-center gap-3 rounded-full bg-gradient-to-r from-petal via-rose-500 to-gold px-8 py-3.5 font-sans text-base font-semibold tracking-wide text-white shadow-[0_10px_35px_rgba(244,114,182,0.45)] cursor-pointer overflow-hidden transition-all"
          >
            {/* Shimmer light sweep */}
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

            {unlocking ? (
              <>
                <Sparkles className="h-5 w-5 text-gold animate-spin" />
                <span className="font-semibold tracking-wider">Unlocking with love... 💖</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-gold animate-bounce" />
                <span>{lock.gotoButton || "Go to Surprise ✨"}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </>
            )}
          </motion.button>

          <p className="mt-3 font-hand text-base text-white/70 sm:text-lg">
            {unlocking ? "✨ Step inside MIRU ✨" : lock.teaser || "Tap anytime to step inside 💖"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
