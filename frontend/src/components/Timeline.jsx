import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { CONFIG, LABELS } from "@/config/surpriseConfig";

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10 sm:mb-14"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-inksoft sm:text-base">
        {sub}
      </p>
    </motion.div>
  );
}

export default function Timeline() {
  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-24" data-testid="timeline-section">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow={LABELS.timelineEyebrow}
          title={LABELS.timelineTitle}
          sub={LABELS.timelineSub}
        />

        <div className="relative">
          <div className="absolute bottom-2 left-[13px] top-2 w-px bg-gradient-to-b from-transparent via-gold to-transparent sm:left-4" />

          <div className="space-y-12 sm:space-y-16">
            {CONFIG.timeline.map((m, i) => (
              <motion.article
                key={i}
                data-testid={`timeline-item-${i}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`relative pl-11 sm:pl-14 ${
                  m.photo ? "" : "flex items-start"
                }`}
              >
                <span className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-blush ring-1 ring-gold/40 sm:h-9 sm:w-9">
                  <Heart className="h-3 w-3 fill-rose-deep text-rose-deep sm:h-4 sm:w-4" />
                </span>

                <div
                  className={`rounded-2xl glass-card p-3 sm:p-4 ${
                    i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
                  } ${m.photo ? "" : "w-full py-4 sm:py-5"}`}
                >
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {m.date}
                  </p>
                  <h3 className="px-1 pt-1 font-serif text-xl font-semibold text-ink sm:text-2xl">
                    {m.title}
                  </h3>
                  {m.photo && (
                    <div className="mt-3 overflow-hidden rounded-xl">
                      <img
                        src={m.photo}
                        alt={m.title}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <p className="px-1 pt-2 text-sm leading-relaxed text-inksoft sm:text-[15px]">
                    {m.caption}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
