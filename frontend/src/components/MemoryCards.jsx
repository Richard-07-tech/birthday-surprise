import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { CONFIG, LABELS } from "@/config/surpriseConfig";
import SectionHeading from "@/components/SectionHeading";
import { haptic, prefersReducedMotion } from "@/utils/feedback";

function MemoryCard({ card, index }) {
  const [flipped, setFlipped] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const tiltX = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const backRef = useRef(null);
  const backInView = useInView(backRef, { once: true });

  const flip = () => {
    haptic(25);
    setFlipped((f) => !f);
  };

  const onMove = (e) => {
    if (prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1200, rotateX: tiltX, rotateY: tiltY }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="h-60 sm:h-64"
      data-testid={`memory-card-${index}`}
    >
      <motion.button
        type="button"
        onClick={flip}
        aria-pressed={flipped}
        aria-label={`${card.title}${flipped ? " — tap to close" : " — tap to reveal"}`}
        className="relative block h-full w-full cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-petal"
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl glass-card p-4 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(244,114,182,0.14)]">
            <Sparkles className="h-5 w-5 text-rose-deep" />
          </span>
          <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-ink sm:text-xl">
            {card.title}
          </h3>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-inkmute">
            tap to reveal
          </p>
        </div>

        {/* BACK (flips up, rotateX 180) */}
        <div
          ref={backRef}
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-gold/30 bg-ink/5"
          style={{ transform: "rotateX(180deg)" }}
        >
          <img
            src={card.photo}
            alt={card.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-1000 ${
              loaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
          />
          {/* heavenly light */}
          {flipped && (
            <>
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0.35] }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(120% 70% at 50% 0%, rgba(255,244,214,0.85), rgba(255,209,220,0.25) 45%, transparent 75%)",
                }}
              />
              {backInView &&
                [0, 1, 2, 3].map((s) => (
                  <motion.span
                    key={s}
                    className="pointer-events-none absolute bg-white"
                    style={{
                      width: 4 + s,
                      height: 4 + s,
                      left: `${15 + s * 22}%`,
                      top: `${12 + (s % 2) * 18}%`,
                      borderRadius: "50%",
                      boxShadow: "0 0 8px 2px rgba(255,240,200,0.9)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0.4] }}
                    transition={{
                      duration: 1.6,
                      delay: 0.4 + s * 0.22,
                      ease: "easeOut",
                    }}
                  />
                ))}
            </>
          )}

          {/* note: side-by-side on wider cards, stacked strip on narrow */}
          <div className="absolute inset-x-0 bottom-0 sm:hidden">
            <div className="bg-gradient-to-t from-[rgba(20,8,16,0.85)] via-[rgba(20,8,16,0.55)] to-transparent p-3 pt-8">
              <p className="font-hand text-[15px] leading-tight text-[#FFF6E9]">
                {card.note}
              </p>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[52%] items-center p-3 sm:flex">
            <div className="w-full rounded-xl bg-[rgba(20,8,16,0.55)] p-3 backdrop-blur-md">
              <p className="font-hand text-base leading-snug text-[#FFF6E9]">
                {card.note}
              </p>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function MemoryCards() {
  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-24" data-testid="memory-cards-section">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow={LABELS.cardsEyebrow}
          title={LABELS.cardsTitle}
          sub={LABELS.cardsSub}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {CONFIG.cards.map((card, i) => (
            <MemoryCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
