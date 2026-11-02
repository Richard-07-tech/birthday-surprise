import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "@/config/surpriseConfig";
import { haptic, prefersReducedMotion } from "@/utils/feedback";

// Native emoji font stack for high-quality cross-platform rendering (iOS, Android, Windows)
const EMOJI_FONT =
  "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', sans-serif";

export default function SmirkBurst({ trigger, onComplete }) {
  const rm = prefersReducedMotion();
  const cfg = CONFIG.wishEasterEgg || CONFIG.finale?.wishEasterEgg || {
    emoji: "😏",
    caption: "I know exactly what you wished for 😏",
    mobileParticleCount: 35,
    desktopParticleCount: 55,
    cooldownMs: 3000,
  };

  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState("idle"); // "idle" | "anticipate" | "boom" | "caption"
  const [particles, setParticles] = useState([]);
  const [wave2Particles, setWave2Particles] = useState([]);
  const [miniBonusParticles, setMiniBonusParticles] = useState([]);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);

  const prevTriggerRef = useRef(0);
  const timerRefs = useRef([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  // Trigger burst whenever `trigger` prop changes and > 0
  useEffect(() => {
    if (!trigger || trigger === prevTriggerRef.current) return;
    prevTriggerRef.current = trigger;

    clearAllTimers();
    setBonusTriggered(false);
    setMiniBonusParticles([]);
    setActive(true);

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const count = isMobile
      ? cfg.mobileParticleCount || 35
      : cfg.desktopParticleCount || 55;

    // Vary the launch angle and speed slightly on repeats
    const currentRepeat = repeatCount;
    setRepeatCount((r) => r + 1);
    const angleOffset = (currentRepeat * 37) % 360;

    // Generate Wave 1: 30-40+ varied 😏 emojis
    const newParticles = Array.from({ length: count }, (_, i) => {
      const baseAngle = (i / count) * 360 + angleOffset;
      const angle = (baseAngle + (Math.random() - 0.5) * 24) * (Math.PI / 180);
      const dist = isMobile
        ? 120 + Math.random() * 210
        : 160 + Math.random() * 340;
      const size = Math.floor(24 + Math.random() * 56); // 24px to 80px
      const rot = (Math.random() - 0.5) * 540;
      const gravity = 25 + Math.random() * 45; // slight gravity drop
      const duration = 1.3 + Math.random() * 0.45;

      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + gravity,
        size,
        rot,
        duration,
        scale: 0.8 + Math.random() * 0.5,
      };
    });
    setParticles(newParticles);

    // Generate Wave 2: tiny sparkles and confetti petals (150ms later)
    const wave2Items = ["✨", "🌸", "💖", "💫", "✨"];
    const wave2 = Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
      const dist = isMobile
        ? 90 + Math.random() * 160
        : 130 + Math.random() * 260;
      return {
        id: i,
        char: wave2Items[i % wave2Items.length],
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 20,
        size: 14 + (i % 3) * 6,
        delay: 0.15 + Math.random() * 0.1,
      };
    });
    setWave2Particles(wave2);

    if (rm) {
      // Reduced motion: gentle single fade-in
      setPhase("caption");
      const tEnd = setTimeout(() => {
        setActive(false);
        setPhase("idle");
        if (onComplete) onComplete();
      }, 2600);
      timerRefs.current.push(tEnd);
      return;
    }

    // Step a: Anticipation beat (~250ms)
    setPhase("anticipate");

    // Step b: BOOM (~250ms)
    const tBoom = setTimeout(() => {
      setPhase("boom");
      haptic([30, 40, 80]);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([30, 40, 80]);
      }
    }, 250);
    timerRefs.current.push(tBoom);

    // Step f: Caption appears (~1100ms)
    const tCaption = setTimeout(() => {
      setPhase("caption");
    }, 1100);
    timerRefs.current.push(tCaption);

    // End & cleanup (~2800ms)
    const tEnd = setTimeout(() => {
      setActive(false);
      setPhase("idle");
      if (onComplete) onComplete();
    }, 2800);
    timerRefs.current.push(tEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Hidden bonus: tap the big central 😏 while on screen
  const handleCentralTap = (e) => {
    e.stopPropagation();
    if (bonusTriggered) return;
    setBonusTriggered(true);
    haptic([40, 60]);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 60]);
    }

    // Spawn 14 mini emojis bursting out
    const bonus = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const dist = 70 + Math.random() * 90;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 15,
        size: 26 + (i % 3) * 6,
      };
    });
    setMiniBonusParticles(bonus);
    setTimeout(() => setMiniBonusParticles([]), 1000);
  };

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none"
      style={{ fontFamily: EMOJI_FONT }}
      aria-hidden="true"
    >
      {/* Dimmed backdrop anticipation beat */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "anticipate" ? 0.22 : phase === "boom" ? 0.12 : 0,
        }}
        transition={{ duration: 0.25 }}
      />

      {/* Screen shake container */}
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={
          phase === "boom" && !rm
            ? {
                x: [0, -6, 6, -4, 4, -2, 2, 0],
                y: [0, 3, -3, 2, -2, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        {/* White-gold flash upon BOOM */}
        <AnimatePresence>
          {phase === "boom" && !rm && (
            <motion.div
              key="flash"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 bg-radial from-white via-[#ffe696]/60 to-transparent"
            />
          )}
        </AnimatePresence>

        {/* Expanding shockwave ring */}
        <AnimatePresence>
          {phase === "boom" && !rm && (
            <motion.div
              key="shockwave"
              initial={{ scale: 0.1, opacity: 0.95 }}
              animate={{ scale: 3.6, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-56 w-56 rounded-full border-4 border-petal shadow-[0_0_50px_rgba(201,151,43,0.85)]"
            />
          )}
        </AnimatePresence>

        {/* Wave 1: 30-40+ exploding 😏 emojis */}
        {phase !== "anticipate" &&
          !rm &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, p.scale, 0.4],
                opacity: [0, 1, 1, 0],
                rotate: p.rot,
              }}
              transition={{
                duration: p.duration,
                ease: [0.12, 1, 0.24, 1],
              }}
              style={{
                fontSize: `${p.size}px`,
                filter:
                  "drop-shadow(0 0 14px rgba(244,114,182,0.75)) drop-shadow(0 0 22px rgba(201,151,43,0.65))",
              }}
              className="absolute select-none pointer-events-none will-change-transform"
            >
              {cfg.emoji || "😏"}
            </motion.div>
          ))}

        {/* Wave 2: Tiny sparkles and confetti petals */}
        {phase !== "anticipate" &&
          !rm &&
          wave2Particles.map((s) => (
            <motion.div
              key={`w2-${s.id}`}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: s.x,
                y: s.y,
                scale: [0, 1.2, 0.3],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.1,
                delay: s.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ fontSize: `${s.size}px` }}
              className="absolute select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,230,150,0.8)]"
            >
              {s.char}
            </motion.div>
          ))}

        {/* Hidden bonus mini-burst if big 😏 is tapped */}
        {miniBonusParticles.map((b) => (
          <motion.div
            key={`mini-${b.id}`}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
            animate={{
              x: b.x,
              y: b.y,
              scale: [0.4, 1.1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ fontSize: `${b.size}px` }}
            className="absolute select-none pointer-events-none drop-shadow-[0_0_15px_rgba(244,114,182,0.9)]"
          >
            {cfg.emoji || "😏"}
          </motion.div>
        ))}

        {/* Big central 😏 with interactive bonus tap */}
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              key="central-emoji"
              onClick={handleCentralTap}
              initial={
                rm
                  ? { opacity: 0, scale: 1 }
                  : phase === "anticipate"
                  ? { scale: 0.96, opacity: 0.7 }
                  : { scale: 0, opacity: 1, rotate: -25 }
              }
              animate={
                rm
                  ? { opacity: [0, 1, 1, 0], scale: 1 }
                  : phase === "anticipate"
                  ? { scale: 0.94, opacity: 0.85 }
                  : phase === "boom"
                  ? {
                      scale: [0, 2.7, 2.35, 2.5],
                      opacity: 1,
                      rotate: [-20, 8, -4, 0],
                      filter: [
                        "drop-shadow(0 0 25px rgba(244,114,182,0.9))",
                        "drop-shadow(0 0 50px rgba(201,151,43,0.95))",
                        "drop-shadow(0 0 30px rgba(244,114,182,0.8))",
                      ],
                    }
                  : {
                      scale: [2.5, 2.3, 2.4, 2.1],
                      opacity: [1, 1, 0.4, 0],
                      transition: { duration: 1.3, ease: "easeInOut" },
                    }
              }
              transition={
                phase === "boom"
                  ? { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.3 }
              }
              className="relative flex items-center justify-center p-3 pointer-events-auto cursor-pointer min-h-[48px] min-w-[48px] select-none"
              style={{
                fontSize: "clamp(4.5rem, 16vw, 7.5rem)",
                lineHeight: 1,
              }}
              title="Tap for secret mini-burst!"
            >
              {cfg.emoji || "😏"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Caption that fades in and out */}
        <AnimatePresence>
          {(phase === "caption" || rm) && (
            <motion.div
              key="caption"
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute bottom-[24vh] z-30 mx-auto max-w-xs px-5 py-2.5 rounded-full border border-gold/40 bg-black/60 shadow-[0_4px_24px_rgba(201,151,43,0.35)] backdrop-blur-md pointer-events-none"
            >
              <p className="font-hand text-lg sm:text-2xl font-bold tracking-wide text-center text-white drop-shadow-[0_2px_10px_rgba(244,114,182,0.8)]">
                {cfg.caption || "I know exactly what you wished for 😏"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
