import { motion } from "framer-motion";

// Eyebrow + title + optional subtitle. Reused across sections.
export default function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
  onDark = false,
}) {
  return (
    <motion.div
      className={`section-head ${center ? "center" : ""} ${onDark ? "on-dark" : ""}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {eyebrow && (
        <span className={`eyebrow ${onDark ? "on-dark" : ""}`}>{eyebrow}</span>
      )}
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </motion.div>
  );
}
