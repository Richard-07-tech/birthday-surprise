import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Sparkles, Heart, X, RotateCcw } from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";
import { haptic, prefersReducedMotion } from "@/utils/feedback";

function SparkleStar({ delay = 0, style }) {
  return (
    <motion.span
      className="pointer-events-none absolute text-gold"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.2], y: -25 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      style={style}
    >
      ✦
    </motion.span>
  );
}

export default function MiruReveal() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const reducedMotion = prefersReducedMotion();

  const [activeStep, setActiveStep] = useState(reducedMotion ? 4 : -1);
  const [showConclusion, setShowConclusion] = useState(reducedMotion);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sparklingIndex, setSparklingIndex] = useState(null);

  const { acronym } = CONFIG;
  const letters = acronym?.letters || [
    { letter: "M", word: "Mine", note: "still how many days we have nu therla... but naa irrukeno illayo... you will always be my miru kutyy😋😋" },
    { letter: "I", word: "Independent uhh....", note: "na irrukeno illaya nee epayumee strong haaa mass haa gethu haa irrukanum, college hee NCC SW MIrudhula keela than😋" },
    { letter: "R", word: "Radiant uhhh", note: "ofcouse enna siripu enna alagu neega majja vaa irrupiga neega always, big fan uhh madom😋😋" },
    { letter: "U", word: "Unique", note: "nee always unique than seriya... nee un mela neriyaa kora irruku nu sollite irrupa, irrukatum... enaku athuvum pidikum unta seriyaaa" },
  ];

  // Start sequenced letter reveal
  const runSequence = () => {
    if (reducedMotion) {
      setActiveStep(4);
      setShowConclusion(true);
      return;
    }

    setActiveStep(-1);
    setShowConclusion(false);

    letters.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        setSparklingIndex(idx);
        haptic(35);
        setTimeout(() => setSparklingIndex(null), 800);
      }, idx * 600 + 200);
    });

    setTimeout(() => {
      setActiveStep(letters.length);
      setShowConclusion(true);
      haptic([30, 50, 80]);
    }, letters.length * 600 + 400);
  };

  useEffect(() => {
    if (isInView && activeStep === -1) {
      runSequence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  const handleCardClick = (item, index) => {
    haptic([25, 40, 25]);
    setSparklingIndex(index);
    setSelectedNote(item);
    setTimeout(() => setSparklingIndex(null), 900);
  };

  return (
    <section
      id="miru-reveal"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden px-4 py-20 sm:px-8 text-center"
      data-testid="miru-reveal-section"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.18)] blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-[rgba(233,180,76,0.16)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
        {/* Eyebrow */}
        <motion.p
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {acronym.eyebrow}
        </motion.p>

        {/* Section title */}
        <motion.h2
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl"
        >
          The Story In Your Name
        </motion.h2>

        <motion.p
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-3 max-w-md text-sm leading-relaxed text-inksoft sm:text-base"
        >
          {acronym.tagline}
          <span className="block text-xs text-inkmute mt-1">
            (tap any letter to open its secret note)
          </span>
        </motion.p>

        {/* 4 Letter Acronym Cards: 2x2 grid on mobile, 4-col on desktop */}
        <div className="mt-10 grid w-full max-w-sm grid-cols-2 gap-3.5 sm:max-w-md sm:gap-5 md:max-w-3xl md:grid-cols-4">
          {letters.map((item, index) => {
            const isLit = activeStep >= index;
            const isSparkling = sparklingIndex === index;

            return (
              <motion.button
                key={item.letter}
                type="button"
                data-testid={`acronym-letter-${item.letter}`}
                onClick={() => handleCardClick(item, index)}
                aria-label={`${item.letter} for ${item.word}. Tap to read note.`}
                initial={
                  reducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0.35, scale: 0.94 }
                }
                animate={
                  isLit
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: isSparkling ? -4 : 0,
                      }
                    : { opacity: 0.35, scale: 0.94, y: 0 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`glass-card group relative flex min-h-[148px] sm:min-h-[175px] flex-col items-center justify-center rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                  isLit
                    ? "ring-1 ring-petal/35 shadow-[0_12px_32px_rgba(244,114,182,0.18)] cursor-pointer hover:scale-[1.03]"
                    : "opacity-40 grayscale-[40%]"
                }`}
              >
                {/* Floating sparkles on activation or click */}
                {isSparkling && (
                  <>
                    <SparkleStar delay={0.05} style={{ top: "15%", left: "20%" }} />
                    <SparkleStar delay={0.15} style={{ top: "20%", right: "20%" }} />
                    <SparkleStar delay={0.25} style={{ bottom: "25%", left: "30%" }} />
                  </>
                )}

                {/* Giant Glowing Letter */}
                <span
                  className={`font-serif italic font-bold text-5xl sm:text-6xl md:text-7xl transition-all duration-500 ${
                    isLit
                      ? "bg-gradient-to-br from-petal via-rose-deep to-gold bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(244,114,182,0.55)]"
                      : "text-inkmute/50"
                  }`}
                >
                  {item.letter}
                </span>

                {/* Word that slides up & fades in */}
                <div className="mt-2 min-h-[28px] overflow-hidden">
                  <motion.p
                    initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    animate={
                      isLit
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="font-serif text-base font-semibold text-ink sm:text-lg tracking-wide"
                  >
                    {item.word}
                  </motion.p>
                </div>

                {/* Micro tap hint */}
                <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-rose-deep opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                  Read Note →
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Final Line: "girl 💫" with soft pulse & gentle burst */}
        <div className="mt-9 min-h-[60px] flex flex-col items-center justify-center">
          <AnimatePresence>
            {showConclusion && (
              <motion.div
                key="miru-conclusion"
                initial={
                  reducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.85, y: 16 }
                }
                animate={{
                  opacity: 1,
                  scale: [1, 1.05, 1],
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  scale: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center gap-2">
                  <p className="font-serif italic text-3xl font-semibold sm:text-5xl bg-gradient-to-r from-rose-deep via-petal to-gold bg-clip-text text-transparent">
                    {acronym.conclusion || "girl 💫"}
                  </p>
                </div>
                {acronym.conclusionSub && (
                  <p className="mt-1.5 font-hand text-base text-inksoft sm:text-lg">
                    {acronym.conclusionSub}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Replay action */}
        {showConclusion && (
          <motion.button
            type="button"
            onClick={runSequence}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-inkmute transition-colors hover:text-rose-deep active:scale-95"
            aria-label="Replay the letter acronym sequence"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Replay Reveal
          </motion.button>
        )}
      </div>

      {/* Note Modal when a letter is tapped */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.9, y: 16 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="glass-card relative w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button with >= 44px tap target */}
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="absolute right-4 top-4 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-inksoft hover:text-ink active:scale-90"
                aria-label="Close note"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-petal/20 to-gold/20 shadow-inner">
                <span className="font-serif italic text-4xl font-bold bg-gradient-to-br from-petal via-rose-deep to-gold bg-clip-text text-transparent">
                  {selectedNote.letter}
                </span>
              </div>

              <p className="mt-3 font-serif text-2xl font-semibold text-ink">
                {selectedNote.word}
              </p>

              <div className="my-4 mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-petal to-transparent" />

              <p className="font-hand text-xl leading-relaxed text-inksoft sm:text-2xl px-2">
                “{selectedNote.note}”
              </p>

              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-rose-deep px-6 py-2.5 font-sans text-xs font-semibold tracking-wider text-white shadow-md transition-transform active:scale-95"
              >
                Close Note
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
