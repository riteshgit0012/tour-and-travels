import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { fetchGalleryImages } from "../api";
import { GALLERY } from "../data/siteData";
import { resolveImageUrl } from "../utils/resolveImageUrl";

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function Gallery() {
  const [images, setImages] = useState(GALLERY);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null); // index into `filtered`

  useEffect(() => {
    let alive = true;
    fetchGalleryImages().then((d) => alive && d?.length && setImages(d));
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(images.map((i) => i.category)))],
    [images]
  );

  const filtered = useMemo(
    () => (filter === "All" ? images : images.filter((i) => i.category === filter)),
    [images, filter]
  );

  const close = useCallback(() => setLightbox(null), []);
  const move = useCallback(
    (dir) =>
      setLightbox((i) =>
        i === null ? i : (i + dir + filtered.length) % filtered.length
      ),
    [filtered.length]
  );

  // Keyboard controls for the lightbox.    
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, move]);

  return (
    <motion.div {...pageMotion} className="page">
      {/* Banner */}
      <section className="page-hero">
        <div className="hero-glow" />
        <div className="container page-hero-inner">
          <h1>Gallery</h1>
          <p>
            A glimpse of Ayodhya&apos;s temples, ghats and the comfortable
            vehicles that carry our travellers there.
          </p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Gallery</span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="gallery-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-btn ${filter === c ? "active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <motion.div layout className="gallery-grid">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.figure
                  layout
                  key={img.src}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={resolveImageUrl(img.src)}
                    alt={img.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <span className="gallery-plus">
                    <FaPlus />
                  </span>
                  <figcaption className="gallery-cap">
                    <span>{img.category}</span>
                    <b>{img.title}</b>
                  </figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <button className="lb-btn lb-close" onClick={close} aria-label="Close">
              <FaTimes />
            </button>
            <button
              className="lb-btn lb-prev"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              className="lb-btn lb-next"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{ textAlign: "center" }}
            >
              <img
                src={resolveImageUrl(filtered[lightbox].src)}
                alt={filtered[lightbox].title}
              />
              <div className="lightbox-cap">
                {filtered[lightbox].title} · {filtered[lightbox].category}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}