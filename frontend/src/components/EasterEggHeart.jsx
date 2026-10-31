import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { CONFIG } from "@/config/surpriseConfig";
import { haptic } from "@/utils/feedback";

export default function EasterEggHeart() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        data-testid="easter-egg-heart"
        aria-label="A hidden heart"
        onClick={() => {
          haptic([15, 40, 15]);
          setOpen(true);
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="glass-card fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full"
      >
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-5 w-5 fill-rose-deep text-rose-deep" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(20,8,16,0.45)] px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            data-testid="easter-egg-modal"
          >
            <motion.div
              initial={{ scale: 0.85, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs rounded-3xl bg-blush p-7 text-center shadow-2xl"
            >
              <button
                type="button"
                data-testid="easter-egg-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-inkmute transition-colors hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
              <Heart className="mx-auto h-10 w-10 fill-rose-deep text-rose-deep" />
              <p className="mt-4 font-hand text-2xl leading-snug text-ink">
                {CONFIG.easterEgg.message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
