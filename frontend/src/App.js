import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";
import { haptic, prefersReducedMotion } from "@/utils/feedback";
import {
  checkIsUnlocked,
  syncServerTime,
} from "@/utils/dateUtils";
import Experience from "@/components/Experience";
import ThemeToggle from "@/components/ThemeToggle";
import LockPage from "@/components/LockPage";

export default function App() {
  // Check for private preview bypass key in query string: ?preview=[key]
  const [previewBypassed, setPreviewBypassed] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const key = params.get("preview");
      if (CONFIG.previewEnabled && key && key === CONFIG.previewKey) {
        sessionStorage.setItem("previewBypass", "1");
        return true;
      }
      return sessionStorage.getItem("previewBypass") === "1";
    }
    return false;
  });

  const [lockPassed, setLockPassed] = useState(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("previewBypass") === "1") return true;
      if (sessionStorage.getItem("lockPassed") === "1") return true;
      if (checkIsUnlocked(CONFIG.unlockAt)) return true;
      return false;
    }
    return false;
  });

  const [revealed, setRevealed] = useState(false);
  const [gateGone, setGateGone] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("gatePassed") === "1"
  );

  // Sync server time on initial load
  useEffect(() => {
    syncServerTime().then(() => {
      if (checkIsUnlocked(CONFIG.unlockAt)) {
        setLockPassed(true);
      }
    });
  }, []);

  useEffect(() => {
    if (gateGone) sessionStorage.setItem("gatePassed", "1");
  }, [gateGone]);

  useEffect(() => {
    if (lockPassed) sessionStorage.setItem("lockPassed", "1");
  }, [lockPassed]);

  // STAGE 1: LOCK PAGE -> STAGE 2: PASSWORD GATE -> STAGE 3: SURPRISE EXPERIENCE
  return (
    <AnimatePresence mode="wait">
      {!lockPassed && !previewBypassed ? (
        <LockPage
          key="lock-landing-page"
          onUnlock={() => {
            setLockPassed(true);
            sessionStorage.setItem("lockPassed", "1");
          }}
        />
      ) : (
        <motion.main
          key="surprise-app-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="full-vh relative min-h-screen w-full overflow-x-clip bg-blush font-sans text-ink antialiased"
          data-testid="app-root"
        >
          {/* Experience rendered only after passing password gate */}
          {revealed && (
            <>
              <ThemeToggle />
              <Experience />
            </>
          )}

          {/* Password Gate */}
          {!gateGone && (
            <Gate
              onReveal={() => setRevealed(true)}
              onDone={() => setGateGone(true)}
            />
          )}
        </motion.main>
      )}
    </AnimatePresence>
  );
}

function Gate({ onReveal, onDone }) {
  const [word, setWord] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const { gate } = CONFIG;
  const hint =
    attempts > 0
      ? gate.hints[Math.min(attempts - 1, gate.hints.length - 1)]
      : null;
  const stuck = attempts >= 4;

  const submit = (e) => {
    e.preventDefault();
    if (bursting) return;
    if (word.trim().toLowerCase() === gate.secretWord.toLowerCase()) {
      haptic([30, 50, 30, 50, 120]);
      setBursting(true);
      const rm = prefersReducedMotion();
      setTimeout(onReveal, rm ? 300 : 1400);
      setTimeout(() => setLeaving(true), rm ? 300 : 1500);
      setTimeout(onDone, rm ? 700 : 2450);
    } else {
      haptic(60);
      setAttempts((a) => a + 1);
      setWrong(true);
      setTimeout(() => setWrong(false), 650);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-blush px-6"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-102%" } : { y: 0 }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      data-testid="secret-gate"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.22)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[rgba(201,151,43,0.16)] blur-3xl" />

      {bursting && <SparkleBurst />}

      <motion.div
        className="relative z-10 w-full max-w-xs text-center"
        animate={
          wrong && !bursting ? { x: [0, -12, 12, -7, 7, 0] } : { x: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center"
        >
          <HeartLock />
        </motion.div>

        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          For {CONFIG.herName} only
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-snug text-ink sm:text-4xl">
          {gate.teaser}
        </h1>
        <p className="mt-2 text-sm text-inksoft">{gate.teaserSub}</p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <input
            data-testid="secret-gate-input"
            aria-label={gate.inputLabel}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder={gate.inputLabel}
            autoComplete="off"
            autoCapitalize="none"
            disabled={bursting}
            className="glass-card h-12 min-h-[48px] w-full rounded-full px-5 text-center font-serif text-lg text-ink outline-none placeholder:font-sans placeholder:text-sm placeholder:text-inkmute focus-visible:ring-2 focus-visible:ring-petal shadow-sm"
          />
          <button
            type="submit"
            data-testid="secret-gate-submit"
            disabled={bursting}
            className="group flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-rosedeep font-sans text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(219,39,119,0.35)] transition-transform active:scale-[0.97] cursor-pointer sm:text-base"
          >
            {bursting ? gate.unlockedLine : gate.button}
            {!bursting && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <div className="min-h-16" data-testid="secret-gate-hint">
          {hint && !bursting && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-sm italic leading-relaxed text-rose-deep"
            >
              {hint}
            </motion.p>
          )}
          {stuck && !bursting && (
            <p className="mt-2 text-xs text-inkmute">{gate.stillStuck}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeartLock() {
  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-0 rounded-full bg-[rgba(244,114,182,0.25)] blur-xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 64 64" className="relative h-full w-full drop-shadow-[0_8px_24px_rgba(219,39,119,0.35)]">
        <defs>
          <linearGradient id="lockgold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="55%" stopColor="#E86FA4" />
            <stop offset="100%" stopColor="#C9972B" />
          </linearGradient>
        </defs>
        <path
          d="M32 54 C 12 42, 4 30, 8 19 C 11 10, 24 8, 32 17 C 40 8, 53 10, 56 19 C 60 30, 52 42, 32 54 Z"
          fill="url(#lockgold)"
        />
        <circle cx="32" cy="27" r="6" fill="#FFF9FB" />
        <rect x="29.5" y="30" width="5" height="9" rx="2.5" fill="#FFF9FB" />
      </svg>
    </div>
  );
}

function SparkleBurst() {
  const rm = prefersReducedMotion();
  const parts = Array.from({ length: rm ? 0 : 56 }, (_, i) => {
    const angle = (i / 56) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 90 + Math.random() * 220;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 3 + Math.random() * 7,
      delay: Math.random() * 0.25,
      gold: Math.random() < 0.45,
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <motion.div
        className="absolute h-40 w-40 rounded-full bg-white blur-2xl"
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className={p.gold ? "bg-gold" : "bg-petal"}
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.gold ? "50%" : "60% 40% 60% 40%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4, rotate: 120 }}
          transition={{ duration: 1.3, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
