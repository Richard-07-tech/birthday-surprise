import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { CONFIG } from "@/config/surpriseConfig";
import SectionHeading from "@/components/SectionHeading";
import Fireworks from "@/components/Fireworks";
import SmirkBurst from "@/components/SmirkBurst";
import { haptic, prefersReducedMotion } from "@/utils/feedback";

function RevealLine({ progress, index, total, className, children }) {
  const rm = prefersReducedMotion();
  const start = Math.min(0.55, (index / total) * 0.52);
  const end = Math.min(0.8, start + 0.12);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [20, 0]);
  const blur = useTransform(progress, [start, end], ["blur(4px)", "blur(0px)"]);

  return (
    <motion.p
      style={rm ? {} : { opacity, y, filter: blur }}
      whileInView={rm ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

function SpecialRevealLine({ lineIndex, children }) {
  const rm = prefersReducedMotion();
  const [revealed, setRevealed] = useState(rm);
  const [tapped, setTapped] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    if (rm) {
      setRevealed(true);
      return;
    }
    // Safety fallback: if line hasn't revealed after 1.5s on screen, force it visible!
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 1500 + lineIndex * 300);

    return () => clearTimeout(timer);
  }, [rm, lineIndex]);

  const handleTap = () => {
    haptic(35);
    setTapped(true);
    setTimeout(() => setTapped(false), 900);
  };

  const delay = Math.max(0, lineIndex * 0.3); // Staggered by ~300ms

  return (
    <motion.div
      ref={domRef}
      initial={
        rm
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 22, scale: 0.94 }
      }
      animate={
        revealed
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: rm ? 0.1 : 0.65,
                delay: rm ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
              },
            }
          : rm
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 22, scale: 0.94 }
      }
      whileInView={rm ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      onViewportEnter={() => setRevealed(true)}
      whileHover={rm ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleTap}
      animate={
        tapped
          ? {
              scale: [1, 1.05, 1],
              boxShadow: "0 0 40px rgba(244,114,182,0.65)",
            }
          : {}
      }
      className="group relative my-5 sm:my-6 overflow-hidden rounded-2xl border border-[rgba(212,166,64,0.45)] bg-gradient-to-r from-[rgba(244,114,182,0.14)] via-[rgba(255,248,220,0.18)] to-[rgba(212,166,64,0.14)] px-5 py-4 text-center shadow-[0_8px_32px_rgba(244,114,182,0.22)] backdrop-blur-md cursor-pointer select-none transition-shadow hover:shadow-[0_12px_40px_rgba(212,166,64,0.32)]"
    >
      {/* Radiant ambient glow */}
      <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[rgba(244,114,182,0.25)] via-[rgba(212,166,64,0.3)] to-[rgba(244,114,182,0.25)] blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Floating sparkles badges */}
      <span className="pointer-events-none absolute top-2 right-3 text-xs sm:text-sm text-gold animate-pulse select-none">
        ✨
      </span>
      <span className="pointer-events-none absolute bottom-2 left-3 text-xs sm:text-sm text-petal animate-pulse select-none">
        💖
      </span>

      {/* Explicit hex gradient with rock-solid high-contrast fallback */}
      <p
        style={{
          color: "#f5d38a", // High-contrast solid fallback color (never invisible)
          backgroundImage:
            "linear-gradient(90deg, #e11d6a 0%, #f5a3c7 50%, #d4a640 100%)",
          WebkitBackgroundImage:
            "linear-gradient(90deg, #e11d6a 0%, #f5a3c7 50%, #d4a640 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 2px 14px rgba(245, 163, 199, 0.35)",
        }}
        className="relative z-10 font-serif text-xl sm:text-2xl md:text-3xl font-bold italic leading-relaxed"
      >
        {children}
      </p>
    </motion.div>
  );
}

function WishLantern() {
  const [wishing, setWishing] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const lastWishTime = useRef(0);

  const launch = () => {
    const now = Date.now();
    const cooldown = CONFIG.wishEasterEgg?.cooldownMs || 3000;
    if (now - lastWishTime.current < cooldown) return;
    lastWishTime.current = now;

    haptic([30, 40, 80]);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 40, 80]);
    }

    setWishing(true);
    setBurstTrigger((prev) => prev + 1);
    setTimeout(() => setWishing(false), 5200);
  };

  return (
    <div className="relative mt-10 flex h-56 flex-col items-center justify-end sm:h-64">
      {/* Easter egg smirk burst overlay */}
      <SmirkBurst trigger={burstTrigger} />

      <AnimatePresence>
        {wishing && (
          <motion.p
            key="wish"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 1.2 }}
            className="absolute top-2 mx-auto max-w-xs px-4 text-center font-hand text-xl leading-snug text-gold sm:text-2xl"
            data-testid="wish-message"
          >
            {CONFIG.finale.wishMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={launch}
        data-testid="make-a-wish-btn"
        aria-label={CONFIG.finale.wishButton}
        className="relative z-10 flex flex-col items-center gap-2 p-3"
        animate={wishing ? { y: -340, opacity: 0, scale: 0.75 } : { y: 0, opacity: 1, scale: 1 }}
        transition={wishing ? { duration: 2.6, ease: [0.3, 0, 0.2, 1] } : { duration: 0.6 }}
      >
        <motion.span
          className="block h-16 w-11 rounded-t-[999px] rounded-b-lg border border-gold/50 bg-gradient-to-b from-[#FFE9B8] via-[#F5C86A] to-[#E8A44D] shadow-[0_0_35px_rgba(245,190,90,0.55)]"
          animate={{ y: [0, -6, 0], rotate: [0, 1.5, -1.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="mx-auto mt-5 block h-3.5 w-3.5 rounded-full bg-[#FFF3D6] shadow-[0_0_14px_6px_rgba(255,220,140,0.9)]" />
        </motion.span>
        <span className="rounded-full glass-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
          {CONFIG.finale.wishButton}
        </span>
      </motion.button>
    </div>
  );
}

export default function Letter() {
  const ref = useRef(null);
  const finaleRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.95"],
  });
  const finaleInView = useInView(finaleRef, { once: true, margin: "-15% 0px" });

  const lines = CONFIG.letter.lines || [];
  const highlightIndices = CONFIG.letter.highlightLines || [];
  const total = lines.length + 1; // + opening

  const isHighlighted = (line, i) => {
    // 1. Matched by index in highlightIndices
    if (highlightIndices.includes(i)) return true;
    // 2. Always match the final 3 lines
    if (i >= lines.length - 3) return true;
    // 3. Matched by key romantic phrases
    if (typeof line === "string") {
      const lower = line.toLowerCase();
      if (
        lower.includes("miru kutty") ||
        lower.includes("greatest gift") ||
        lower.includes("thanks for being mine")
      ) {
        return true;
      }
    }
    return false;
  };

  // Count which highlighted line this is (0, 1, 2) for staggered pop
  let highlightCounter = 0;

  return (
    <section
      className="relative px-5 py-16 sm:px-8 sm:py-24"
      style={{
        paddingBottom: "max(140px, calc(120px + env(safe-area-inset-bottom)))",
      }}
      data-testid="letter-section"
    >
      <div className="mx-auto max-w-xl">
        <SectionHeading
          eyebrow="One last thing"
          title={CONFIG.letter.heading}
          sub="Read it slowly. Every line is for you."
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10"
          data-testid="letter-container"
        >
          <span className="pointer-events-none absolute -top-2 left-4 select-none font-serif text-8xl italic text-petal/25 sm:text-9xl">
            &ldquo;
          </span>

          <RevealLine
            progress={scrollYProgress}
            index={0}
            total={total}
            className="font-serif text-2xl font-semibold italic text-ink sm:text-3xl"
          >
            {CONFIG.letter.opening.endsWith(",") || CONFIG.letter.opening.includes(CONFIG.herName)
              ? CONFIG.letter.opening
              : `${CONFIG.letter.opening} ${CONFIG.herName},`}
          </RevealLine>

          <div className="mt-5 space-y-4">
            {lines.map((line, i) => {
              if (isHighlighted(line, i)) {
                const currentIdx = highlightCounter++;
                return (
                  <SpecialRevealLine
                    key={i}
                    lineIndex={currentIdx}
                  >
                    {line}
                  </SpecialRevealLine>
                );
              }
              return (
                <RevealLine
                  key={i}
                  progress={scrollYProgress}
                  index={i + 1}
                  total={total}
                  className="text-[15px] leading-8 text-inksoft sm:text-base"
                >
                  {line}
                </RevealLine>
              );
            })}
          </div>

          {/* Signature with right padding to clear the floating heart button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-right pr-14 sm:pr-4 pb-2"
            style={{ maxWidth: "100%", overflowWrap: "break-word" }}
            data-testid="finale-sign-off"
          >
            <p className="text-sm italic text-inkmute whitespace-normal select-none">
              {CONFIG.letter.signOff}
            </p>
            <p
              style={{
                color: "#c0912e",
                backgroundImage: "linear-gradient(90deg, #db2777, #c0912e)",
                WebkitBackgroundImage: "linear-gradient(90deg, #db2777, #c0912e)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="font-hand text-4xl font-semibold sm:text-5xl whitespace-normal"
            >
              {CONFIG.yourName}
            </p>
          </motion.div>
        </motion.div>

        {/* FINALE — fireworks + lanterns + make a wish */}
        <div
          ref={finaleRef}
          className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-b from-transparent via-[rgba(244,114,182,0.06)] to-[rgba(201,151,43,0.1)] pb-2 pt-4"
          data-testid="finale-scene"
        >
          {finaleInView && <Fireworks />}
          <WishLantern />
        </div>
      </div>
    </section>
  );
}
