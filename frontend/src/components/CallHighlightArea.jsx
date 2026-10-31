import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PhoneCall, Heart, Sparkles } from "lucide-react";
import { haptic, prefersReducedMotion } from "@/utils/feedback";

export default function CallHighlightArea({ timeDisplay = "4:08 PM", timeSubtext = "28 December · the day my heart spoke first", note }) {
  const rm = prefersReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  const [currentMinute, setCurrentMinute] = useState(rm ? 8 : 0);
  const [poppedHeart, setPoppedHeart] = useState(rm);
  const [showNote, setShowNote] = useState(rm);

  // Animate minutes ticking from 0 to 8 when scrolled into view
  useEffect(() => {
    if (!isInView || rm) return;

    let minute = 0;
    const interval = setInterval(() => {
      minute += 1;
      setCurrentMinute(minute);

      if (minute >= 8) {
        clearInterval(interval);
        haptic([25, 40, 25]);
        setPoppedHeart(true);
        setTimeout(() => setShowNote(true), 350);
      }
    }, 110);

    return () => clearInterval(interval);
  }, [isInView, rm]);

  // Split note into sentences for soft line-by-line fade-in
  const sentences = [
    "I still remember it perfectly: 28 December, 4:08 in the afternoon, on a call with you.",
    "My heart was racing, my words were shaking, and I finally said what I'd been carrying for so long.",
    "I told you I liked you.",
    "Of everything I've ever done, that is the thing I'm happiest I did.",
    "Thank you for being the person I found the courage for. 💗",
  ];

  return (
    <div ref={ref} className="w-full" data-testid="call-highlight-area">
      {/* Soft rounded highlight panel in pink & gold palette */}
      <div className="relative my-4 overflow-hidden rounded-2xl border border-petal/30 bg-gradient-to-br from-petal/15 via-blush to-gold/15 p-5 sm:p-6 text-center shadow-[0_8px_30px_rgba(244,114,182,0.14)]">
        {/* Ambient background blur radiance */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-petal/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />

        {/* Phone icon with gentle, slowly pulsing sound-wave rings */}
        <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center">
          {/* Sound wave ring 1 */}
          <motion.div
            animate={
              rm
                ? {}
                : {
                    scale: [1, 1.55, 1.95],
                    opacity: [0.65, 0.25, 0],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border border-petal/60"
          />

          {/* Sound wave ring 2 */}
          <motion.div
            animate={
              rm
                ? {}
                : {
                    scale: [1, 1.45, 1.8],
                    opacity: [0.55, 0.2, 0],
                  }
            }
            transition={{
              duration: 2.4,
              delay: 0.9,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border border-gold/50"
          />

          {/* Phone call circular badge */}
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-rose-deep/20 via-petal/25 to-gold/25 shadow-md">
            <PhoneCall className="h-5 w-5 text-rose-deep animate-pulse" />
          </div>

          {/* Heart pop & sparkle above the phone/time */}
          {poppedHeart && (
            <motion.div
              initial={rm ? { opacity: 1 } : { scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: -22 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1"
            >
              <Heart className="h-4 w-4 fill-rose-deep text-rose-deep drop-shadow-sm" />
              <Sparkles className="h-3 w-3 text-gold animate-spin" />
            </motion.div>
          )}
        </div>

        {/* Big serif clock-style time "4:08 PM" with minutes counting up & shimmer */}
        <div className="relative z-10">
          <p className="font-serif text-3xl font-bold tracking-wide sm:text-4xl bg-gradient-to-r from-gold via-petal to-rose-500 bg-clip-text text-transparent tabular-nums drop-shadow-[0_0_15px_rgba(233,180,76,0.35)]">
            4:{String(currentMinute).padStart(2, "0")} PM
          </p>

          {/* Beneath it, small italic text */}
          <p className="mt-1 font-hand text-base text-inksoft sm:text-lg">
            “{timeSubtext}”
          </p>
        </div>
      </div>

      {/* Note text fading in line by line with soft fade effect */}
      <div className="px-1 pt-1 space-y-2 text-sm leading-relaxed text-inksoft sm:text-[15px]">
        {sentences.map((line, idx) => {
          const isCoreStatement = line.includes("I told you I liked you");
          return (
            <motion.p
              key={idx}
              initial={rm ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={showNote ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: rm ? 0 : idx * 0.45,
                ease: "easeOut",
              }}
              className={
                isCoreStatement
                  ? "font-serif text-base sm:text-lg font-semibold italic text-rose-deep py-0.5"
                  : ""
              }
            >
              {line}
            </motion.p>
          );
        })}
      </div>
    </div>
  );
}
