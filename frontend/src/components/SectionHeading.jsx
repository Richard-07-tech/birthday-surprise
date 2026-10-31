import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, sub }) {
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
      {sub && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-inksoft sm:text-base">
          {sub}
        </p>
      )}
    </motion.div>
  );
}
