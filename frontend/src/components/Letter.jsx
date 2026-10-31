import { useEffect, useRef, useState } from "react";
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
import { haptic } from "@/utils/feedback";

function RevealLine({ progress, index, total, className, children }) {
  const start = (index / total) * 0.72;
  const end = start + 0.16;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [26, 0]);
  const blur = useTransform(progress, [start, end], ["blur(5px)", "blur(0px)"]);
  return (
    <motion.p style={{ opacity, y, filter: blur }} className={className}>
      {children}
    </motion.p>
  );
}

function WishLantern() {
  const [wishing, setWishing] = useState(false);
  const launch = () => {
    if (wishing) return;
    haptic([20, 30, 60]);
    setWishing(true);
    setTimeout(() => setWishing(false), 5200);
  };

  return (
    <div className="relative mt-10 flex h-56 flex-col items-center justify-end sm:h-64">
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
    offset: ["start 0.85", "end 0.45"],
  });
  const finaleInView = useInView(finaleRef, { once: true, margin: "-15% 0px" });

  const lines = CONFIG.letter.lines;
  const total = lines.length + 1; // + opening

  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-24" data-testid="letter-section">
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
            {CONFIG.letter.opening} {CONFIG.herName},
          </RevealLine>

          <div className="mt-5 space-y-4">
            {lines.map((line, i) => (
              <RevealLine
                key={i}
                progress={scrollYProgress}
                index={i + 1}
                total={total}
                className="text-[15px] leading-8 text-inksoft sm:text-base"
              >
                {line}
              </RevealLine>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-right"
            data-testid="finale-sign-off"
          >
            <p className="text-sm italic text-inkmute">{CONFIG.letter.signOff}</p>
            <p className="bg-gradient-to-r from-rose-deep to-gold bg-clip-text font-hand text-4xl font-semibold text-transparent sm:text-5xl">
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
