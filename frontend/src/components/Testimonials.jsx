import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import { fetchTestimonials } from "../api";
import { TESTIMONIALS } from "../data/siteData";
import SectionHeading from "./SectionHeading.jsx";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=0F1A3C&color=F4A340&size=120&font-size=0.4&bold=true`;

export default function Testimonials() {
  const [items, setItems] = useState(TESTIMONIALS);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchTestimonials().then((data) => {
      if (alive && data?.length) setItems(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length]
  );

  // Auto-advance every 6s.
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  const t = items[index];

  return (
    <section className="section bg-cream">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Testimonials"
          title="What our travellers say"
          sub="Real words from pilgrims and families who explored Ayodhya with us."
        />

        <div className="testi">
          <div className="testi-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="testi-card"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="testi-quote">
                  <FaQuoteLeft />
                </div>
                <div className="testi-stars">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-person">
                  <img
                    className="testi-avatar"
                    src={avatarUrl(t.name)}
                    alt={t.name}
                    loading="lazy"
                  />
                  <div>
                    <b>{t.name}</b>
                    <span>{t.location}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="testi-nav">
            <button className="testi-arrow" onClick={() => go(-1)} aria-label="Previous">
              <FaChevronLeft />
            </button>
            <div className="testi-dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`testi-dot ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button className="testi-arrow" onClick={() => go(1)} aria-label="Next">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
