/**
 * MemoryCards.jsx — "Things I like about you" — Cinematic Redesign
 *
 * Chapters: Smile → Hair → Personality → Loading Bar → "Everything." + Collage
 */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { CONFIG, LABELS } from "@/config/surpriseConfig";
import SectionHeading from "@/components/SectionHeading";
import { haptic, prefersReducedMotion } from "@/utils/feedback";

// ─── Placeholder: soft pink-gold gradient + heart ─────────────────────────────
const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFF0F5"/>
          <stop offset="50%" stop-color="#FFF8DC"/>
          <stop offset="100%" stop-color="#FFE4F0"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#pg)"/>
      <text x="200" y="265" font-size="96" text-anchor="middle">💗</text>
    </svg>`
  );

// ─── Helpers ─────────────────────────────────────────────────────────────────
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
function useRM() {
  return prefersReducedMotion();
}
function useParallaxY(ref, strength = 14) {
  const rm = useRM();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [-strength, strength]);
}

// ─── Smile sparkles ───────────────────────────────────────────────────────────
const SMILE_SPARKS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: `${8 + ((i * 37 + 11) % 84)}%`,
  y: `${5 + ((i * 43 + 7) % 88)}%`,
  size: 3 + (i % 3) * 2,
  delay: i * 0.33,
}));

function SmileSparkles({ active, burst }) {
  const rm = useRM();
  if (rm) return null;
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        overflow: "hidden", borderRadius: "inherit",
      }}
    >
      {active &&
        SMILE_SPARKS.map((s) => (
          <motion.span
            key={s.id}
            style={{
              position: "absolute", left: s.x, top: s.y,
              width: s.size, height: s.size, borderRadius: "50%",
              background: "white",
              boxShadow: "0 0 6px 2px rgba(255,240,200,0.9)",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}
      <AnimatePresence>
        {burst && (
          <motion.div
            key="burst"
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {Array.from({ length: 16 }, (_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  style={{
                    position: "absolute",
                    width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
                    borderRadius: "50%",
                    background: i % 2 === 0 ? "var(--petal)" : "var(--gold)",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * (55 + Math.random() * 30),
                    y: Math.sin(angle) * (55 + Math.random() * 30),
                    opacity: 0, scale: 0.3,
                  }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hair overlay: drifting petals + light sweep ──────────────────────────────
const HAIR_PETALS = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: `${8 + i * 13}%`,
  duration: 4.5 + i * 0.6,
  delay: i * 0.7,
  size: 12 + (i % 3) * 4,
}));

function HairOverlay({ entered }) {
  const rm = useRM();
  if (rm) return null;
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        overflow: "hidden", borderRadius: "inherit",
      }}
    >
      {HAIR_PETALS.map((p) => (
        <motion.span
          key={p.id}
          style={{ position: "absolute", left: p.x, top: "-10%", fontSize: p.size, opacity: 0.75 }}
          animate={{ y: ["0%", "115%"], x: [0, 18, -12, 14, 0], rotate: [0, 200, 360] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        >
          🌸
        </motion.span>
      ))}
      {entered && (
        <motion.div
          style={{
            position: "absolute", inset: 0,
            background:
              "linear-gradient(105deg, transparent 25%, rgba(255,244,214,0.6) 50%, transparent 75%)",
          }}
          initial={{ x: "-110%" }}
          animate={{ x: "110%" }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4 }}
        />
      )}
    </div>
  );
}

// ─── Personality word chips ────────────────────────────────────────────────────
const CHIP_POSITIONS = [
  { top: "5%",  left: "-11%" },
  { top: "22%", right: "-13%" },
  { top: "44%", left: "-15%" },
  { top: "62%", right: "-11%" },
  { top: "78%", left: "-7%"  },
  { top: "88%", right: "-9%" },
];

function ChipBubble({ chip, pos, delay }) {
  const rm = useRM();
  const [glowing, setGlowing] = useState(false);
  const handleTap = (e) => {
    e.stopPropagation();
    haptic(30);
    setGlowing(true);
    setTimeout(() => setGlowing(false), 900);
  };
  return (
    <motion.button
      onClick={handleTap}
      animate={rm ? {} : { y: [0, -7, 0] }}
      transition={{ duration: 3.2 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        position: "absolute", ...pos,
        zIndex: 10, pointerEvents: "auto",
        padding: "4px 11px", borderRadius: 999,
        fontSize: "0.68rem", fontWeight: 600, cursor: "pointer",
        border: glowing ? "1px solid transparent" : "1px solid rgba(244,114,182,0.4)",
        background: glowing
          ? "linear-gradient(135deg, var(--petal), var(--gold))"
          : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        color: glowing ? "#fff" : "var(--rose-deep)",
        boxShadow: glowing ? "0 0 18px rgba(244,114,182,0.65)" : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
        whiteSpace: "nowrap",
      }}
    >
      {chip}
    </motion.button>
  );
}

function PersonalityChips({ chips }) {
  return (
    <>
      {(chips || []).slice(0, CHIP_POSITIONS.length).map((chip, i) => (
        <ChipBubble key={i} chip={chip} pos={CHIP_POSITIONS[i]} delay={i * 0.4} />
      ))}
    </>
  );
}

// ─── Photo frame ──────────────────────────────────────────────────────────────
function PhotoFrame({ src, alt, focalPoint = "50% 50%", tiltDeg = -1.5, onClick, children }) {
  const [errored, setErrored] = useState(false);
  const ref = useRef(null);
  const y = useParallaxY(ref);
  const imgSrc = !src || errored ? PLACEHOLDER : src;
  return (
    <motion.div
      ref={ref}
      className="aspect-[4/5] sm:aspect-[3/2]"
      style={{
        y, rotate: tiltDeg,
        position: "relative", width: "100%",
        borderRadius: "1.5rem", overflow: "hidden",
        boxShadow: "0 16px 56px rgba(201,151,43,0.18), 0 4px 18px rgba(0,0,0,0.08)",
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0,
      }}
      whileHover={onClick ? { scale: 1.012 } : {}}
      onClick={onClick}
    >
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: focalPoint, display: "block",
        }}
      />
      {/* gold border ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        border: "1.5px solid rgba(201,151,43,0.22)", pointerEvents: "none",
      }} />
      {children}
    </motion.div>
  );
}

// ─── Chapter block ────────────────────────────────────────────────────────────
function ChapterBlock({ chapter, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rm = useRM();
  const isReversed = index % 2 === 1;
  const [smileBurst, setSmileBurst] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => { if (inView) setEntered(true); }, [inView]);

  const handlePhotoClick = () => {
    if (chapter.id === "smile") {
      haptic(25);
      setSmileBurst(true);
      setTimeout(() => setSmileBurst(false), 900);
    }
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-8 items-center ${isReversed ? "sm:flex-row-reverse" : "sm:flex-row"} sm:gap-14`}
    >
      {/* Photo column */}
      <motion.div
        className="w-full sm:w-1/2"
        style={{ position: "relative", flexShrink: 0 }}
        initial={rm ? { opacity: 0 } : { opacity: 0, y: 32, filter: "blur(10px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: rm ? 0.2 : 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <PhotoFrame
          src={chapter.photo}
          alt={chapter.photoAlt || chapter.title}
          focalPoint={chapter.focalPoint}
          tiltDeg={isReversed ? 1.5 : -1.5}
          onClick={handlePhotoClick}
        >
          {chapter.id === "smile" && (
            <SmileSparkles active={entered} burst={smileBurst} />
          )}
          {chapter.id === "hair" && <HairOverlay entered={entered} />}
        </PhotoFrame>

        {/* Personality chips — outside photo overflow */}
        {chapter.id === "personality" && chapter.chips && (
          <div style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
            <PersonalityChips chips={chapter.chips} />
          </div>
        )}
      </motion.div>

      {/* Text column */}
      <motion.div
        className="w-full sm:w-1/2 flex flex-col gap-4 sm:gap-5"
        initial={rm ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: rm ? 0.2 : 0.7, delay: rm ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3
          className="font-serif"
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            background: "linear-gradient(135deg, var(--gold), var(--petal))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontStyle: "italic", fontWeight: 600, lineHeight: 1.2,
          }}
        >
          {chapter.title}
        </h3>
        <p className="font-sans text-base leading-relaxed text-inksoft sm:text-lg">
          {chapter.note}
        </p>
      </motion.div>
    </div>
  );
}

// ─── Loading bar ──────────────────────────────────────────────────────────────
function LoadingBar({ onDone }) {
  const rm = useRM();
  const cfg = CONFIG.reasonsLoading || {};

  useEffect(() => {
    if (rm) { const t = setTimeout(onDone, 400); return () => clearTimeout(t); }
  }, [rm, onDone]);

  const [pct, setPct] = useState(0);
  const [caption, setCaption] = useState(cfg.cap0to30 || "");
  const [stalled, setStalled] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [burst, setBurst] = useState(false);
  const doneRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (burst) return;
    const c = CONFIG.reasonsLoading || {};
    if (pct < 30) setCaption(c.cap0to30 || "");
    else if (pct < 60) setCaption(c.cap30to60 || "");
    else if (pct < 90) setCaption(c.cap60to90 || "");
    else setCaption(c.cap99 || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct, burst]);

  useEffect(() => {
    if (rm) return;
    const PHASES = [
      { to: 30, dur: 1200 }, { to: 60, dur: 1400 },
      { to: 90, dur: 1600 }, { to: 99, dur: 2000 },
    ];
    let phaseIdx = 0, from = 0, phaseStart = null;

    const step = (ts) => {
      if (doneRef.current) return;
      if (!phaseStart) phaseStart = ts;
      const phase = PHASES[phaseIdx];
      if (!phase) return;
      const t = clamp((ts - phaseStart) / phase.dur, 0, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setPct(from + (phase.to - from) * e);
      if (t >= 1) {
        from = phase.to; phaseIdx++; phaseStart = null;
        if (phaseIdx >= PHASES.length) {
          setStalled(true);
          haptic([40, 100, 40]);
          setTimeout(() => {
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
            setTimeout(() => {
              setBurst(true); setPct(108);
              haptic([0, 50, 50, 50, 100]);
              setTimeout(() => { doneRef.current = true; onDone(); }, 900);
            }, 2200);
          }, 2000);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [rm, onDone]);

  const barPct = clamp(pct, 0, 108);
  const overflowing = barPct > 100;

  return (
    <motion.div
      initial={rm ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", overflow: "hidden" }}
      className="rounded-2xl glass-card p-6 sm:p-8"
      data-testid="loading-bar-panel"
    >
      <motion.div
        animate={shaking ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "relative", height: 14, borderRadius: 999, overflow: "hidden",
          background: "rgba(201,151,43,0.13)",
          boxShadow: overflowing ? "0 0 24px 8px rgba(201,151,43,0.55)" : "none",
          transition: "box-shadow 0.4s",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          width: `${clamp(barPct, 0, 100)}%`,
          background: "linear-gradient(90deg, var(--petal) 0%, var(--gold) 60%, #fff8e0 100%)",
          borderRadius: "inherit",
          boxShadow: "2px 0 12px rgba(244,114,182,0.6), 0 0 18px rgba(201,151,43,0.5)",
          transition: "width 0.05s linear",
        }} />
        {stalled && !burst && (
          <motion.div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 60%, rgba(255,240,160,0.7) 100%)",
            }}
            animate={{ opacity: [0, 0.5, 0, 0.8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.1, 0.4, 0.6, 1] }}
          />
        )}
      </motion.div>

      <p
        className="mt-3 font-serif text-3xl font-semibold"
        style={{
          background: "linear-gradient(90deg, var(--petal), var(--gold))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}
      >
        {overflowing ? "∞" : `${Math.floor(clamp(barPct, 0, 100))}%`}
      </p>

      <AnimatePresence mode="wait">
        <motion.p
          key={caption}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}
          className="mt-2 text-sm italic text-inksoft"
        >
          {caption}
        </motion.p>
      </AnimatePresence>

      {stalled && !burst && (
        <motion.div
          className="mx-auto mt-5 text-2xl w-fit"
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          💗
        </motion.div>
      )}
      {burst && (
        <motion.div
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,240,160,0.9) 0%, rgba(201,151,43,0.5) 40%, transparent 80%)",
          }}
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.9 }}
        />
      )}
    </motion.div>
  );
}

// ─── Finale particles ─────────────────────────────────────────────────────────
function ParticleBurst({ count }) {
  const items = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const dist = 100 + Math.random() * 220;
    const size = 4 + Math.random() * 8;
    const isGold = Math.random() < 0.45;
    return { angle, dist, size, isGold, delay: Math.random() * 0.3 };
  });
  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex",
      alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: 1,
    }}>
      {items.map((p, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            background: p.isGold ? "var(--gold)" : "var(--petal)",
            borderRadius: p.isGold ? "50%" : "60% 40% 60% 40%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0, scale: 0.3,
            rotate: 120 + Math.random() * 120,
          }}
          transition={{ duration: 1.5, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

// ─── Collage lightbox ─────────────────────────────────────────────────────────
function CollageViewer({ src, alt, onClose }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const lastDist = useRef(0);
  const dragging = useRef(false);
  const lastDragPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Non-passive touchmove to allow preventDefault on pinch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTm = (e) => { if (e.touches.length >= 2) e.preventDefault(); };
    el.addEventListener("touchmove", onTm, { passive: false });
    return () => el.removeEventListener("touchmove", onTm);
  }, []);

  // Wheel zoom (desktop)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onW = (e) => {
      e.preventDefault();
      setScale((s) => clamp(s * (e.deltaY < 0 ? 1.12 : 0.9), 1, 5));
    };
    el.addEventListener("wheel", onW, { passive: false });
    return () => el.removeEventListener("wheel", onW);
  }, []);

  function getTouchDist(t) {
    const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastDist.current = getTouchDist(e.touches);
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        if (scale > 1) { setScale(1); setPos({ x: 0, y: 0 }); }
        else setScale(2.5);
      }
      lastTap.current = now;
      if (scale > 1) {
        dragging.current = true;
        lastDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const d = getTouchDist(e.touches);
      const delta = d / (lastDist.current || d);
      lastDist.current = d;
      setScale((s) => clamp(s * delta, 1, 5));
    } else if (e.touches.length === 1 && dragging.current) {
      const dx = e.touches[0].clientX - lastDragPos.current.x;
      const dy = e.touches[0].clientY - lastDragPos.current.y;
      lastDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    if (scale <= 1.02) setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)", touchAction: "none" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 10,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
          color: "#fff", fontSize: "1.1rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", border: "none",
        }}
      >
        ✕
      </button>

      {/* Image */}
      <div
        ref={containerRef}
        style={{
          width: "min(92vw, 720px)", maxHeight: "80dvh", overflow: "hidden",
          borderRadius: "1.25rem",
          border: "1.5px solid rgba(201,151,43,0.3)",
          boxShadow: "0 0 60px rgba(201,151,43,0.25)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%", height: "auto", maxHeight: "80dvh",
            objectFit: "contain", display: "block",
            transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            transformOrigin: "center center",
            transition: "transform 0.15s ease",
            userSelect: "none", WebkitUserSelect: "none",
          }}
          draggable={false}
        />
      </div>

      {/* Download */}
      <a
        href={src}
        download="miru-collage.jpg"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, padding: "10px 20px", borderRadius: 999,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
          color: "#fff", fontSize: "0.875rem", textDecoration: "none",
          whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        Save this 💾
      </a>
    </motion.div>
  );
}

// ─── Finale ───────────────────────────────────────────────────────────────────
function Finale({ onReplay }) {
  const rm = useRM();
  const cfg = CONFIG.reasonsFinale || {};
  const collage = cfg.collage || {};

  const [showCollage, setShowCollage] = useState(rm);
  const [showBurst, setShowBurst] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [collageErrored, setCollageErrored] = useState(false);

  const collageSrc = !collage.path || collageErrored ? PLACEHOLDER : collage.path;

  useEffect(() => {
    haptic(50);
    if (rm) return;
    const t = setTimeout(() => {
      setShowCollage(true);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 2000);
    }, 2000);
    return () => clearTimeout(t);
  }, [rm]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="mt-10 flex flex-col items-center gap-6 text-center px-4 pb-12"
      data-testid="finale-panel"
    >
      {/* Particle burst */}
      {showBurst && !rm && <ParticleBurst count={40} />}

      {/* "Everything." */}
      <motion.h2
        className="font-serif"
        style={{
          fontSize: "clamp(3.5rem, 16vw, 7rem)",
          background: "linear-gradient(135deg, var(--gold) 0%, var(--petal) 55%, #fff 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontStyle: "italic", fontWeight: 700, lineHeight: 1,
        }}
        animate={rm ? {} : {
          y: showCollage ? -12 : 0,
          scale: showCollage ? 0.88 : 1,
          filter: [
            "drop-shadow(0 0 18px rgba(201,151,43,0.4))",
            "drop-shadow(0 0 44px rgba(201,151,43,0.85))",
            "drop-shadow(0 0 18px rgba(201,151,43,0.4))",
          ],
        }}
        transition={{
          y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {cfg.bigWord || "Everything."}
      </motion.h2>

      {/* Collage + sub + replay */}
      <AnimatePresence>
        {showCollage && (
          <motion.div
            key="collage-block"
            initial={rm ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: rm ? 0.3 : 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <motion.div
              style={{
                width: "min(92vw, 720px)",
                borderRadius: "1.5rem",
                border: "1.5px solid rgba(201,151,43,0.35)",
                boxShadow: "0 0 56px rgba(201,151,43,0.25), 0 12px 40px rgba(0,0,0,0.12)",
                overflow: "hidden", cursor: "pointer",
              }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setShowViewer(true)}
            >
              <img
                src={collageSrc}
                alt={collage.alt || "A photo of MIRU"}
                loading="lazy"
                decoding="async"
                onError={() => setCollageErrored(true)}
                style={{
                  width: "100%", height: "auto",
                  maxHeight: "80dvh", objectFit: "contain", display: "block",
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rm ? 0 : 0.5 }}
              className="font-sans text-base italic text-inksoft max-w-sm"
            >
              {cfg.sub || "I love everything about you, MIRU. 💗"}
            </motion.p>

            <motion.button
              onClick={onReplay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: rm ? 0 : 1.1 }}
              className="cursor-pointer font-sans text-sm text-inkmute underline underline-offset-4 hover:text-rose-deep transition-colors"
            >
              {cfg.replay || "Replay ✨"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewer && (
          <CollageViewer
            src={collageSrc}
            alt={collage.alt || "A photo of MIRU"}
            onClose={() => setShowViewer(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function MemoryCards() {
  const rm = useRM();
  const lastChapterRef = useRef(null);
  const lastChapterInView = useInView(lastChapterRef, { once: true, margin: "-80px" });

  const [loadingStarted, setLoadingStarted] = useState(false);
  const [stage, setStage] = useState("loading");
  const [replayKey, setReplayKey] = useState(0);

  const chapters = CONFIG.reasons || [];

  useEffect(() => {
    if (!lastChapterInView || loadingStarted) return;
    const t = setTimeout(() => setLoadingStarted(true), rm ? 300 : 1500);
    return () => clearTimeout(t);
  }, [lastChapterInView, loadingStarted, rm]);

  const handleReplay = () => {
    setStage("loading");
    setReplayKey((k) => k + 1);
  };

  return (
    <section
      className="relative px-5 py-16 sm:px-8 sm:py-24"
      data-testid="memory-cards-section"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow={LABELS.cardsEyebrow}
          title={LABELS.cardsTitle}
          sub={LABELS.cardsSub}
        />

        {/* Three cinematic chapters */}
        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {chapters.map((chapter, i) => (
            <div
              key={chapter.id || i}
              ref={i === chapters.length - 1 ? lastChapterRef : null}
            >
              <ChapterBlock chapter={chapter} index={i} />
            </div>
          ))}
        </div>

        {/* Loading sequence + Finale (auto-triggers after last chapter) */}
        {loadingStarted && (
          <div className="mt-20">
            <motion.p
              initial={rm ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: rm ? 0.2 : 0.7 }}
              className="mb-8 text-center font-serif italic text-lg text-inksoft"
            >
              {CONFIG.reasonsLoading?.transitionLine || "…and that's just the beginning."}
            </motion.p>

            {stage === "loading" && (
              <LoadingBar
                key={`lb-${replayKey}`}
                onDone={() => setStage("finale")}
              />
            )}
            {stage === "finale" && (
              <Finale key={`finale-${replayKey}`} onReplay={handleReplay} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
