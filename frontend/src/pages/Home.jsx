import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import BookingForm from "../components/BookingForm.jsx";
import FleetCard from "../components/FleetCard.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import Testimonials from "../components/Testimonials.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

import { fetchFleetVehicles } from "../api";
import { COMPANY } from "../data/siteData";

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};


/* Temple skyline silhouette anchored to the bottom of the hero */
function TempleSilhouette() {
  return (
    <svg
      className="hero-silhouette"
      viewBox="0 0 1440 150"
      preserveAspectRatio="xMidYMax meet"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="120" width="1440" height="30" />
      {/* left cluster */}
      <rect x="80" y="86" width="70" height="34" />
      <path d="M115 40c14 14 24 26 24 40H91c0-14 10-26 24-40z" />
      <rect x="112" y="26" width="6" height="16" />
      <circle cx="115" cy="24" r="5" />
      <path d="M180 120V92a30 30 0 0 1 60 0v28z" />
      {/* central grand temple */}
      <rect x="640" y="70" width="160" height="50" />
      <path d="M720 8c34 30 54 54 54 84 0 6-1 12-3 18H669c-2-6-3-12-3-18 0-30 20-54 54-84z" />
      <rect x="714" y="-14" width="12" height="24" />
      <circle cx="720" cy="-16" r="9" />
      <path d="M604 120V96a24 24 0 0 1 48 0v24z" />
      <path d="M788 120V96a24 24 0 0 1 48 0v24z" />
      {/* right cluster */}
      <rect x="1180" y="80" width="80" height="40" />
      <path d="M1220 34c16 16 28 30 28 46h-56c0-16 12-30 28-46z" />
      <rect x="1217" y="18" width="6" height="16" />
      <circle cx="1220" cy="16" r="5" />
      <path d="M1300 120V94a28 28 0 0 1 56 0v26z" />
      {/* small buildings */}
      <rect x="360" y="100" width="90" height="20" />
      <rect x="470" y="104" width="60" height="16" />
      <rect x="960" y="102" width="80" height="18" />
      <rect x="1060" y="98" width="70" height="22" />
    </svg>
  );
}

export default function Home() {
  const [fleet, setFleet] = useState([]);
  const [fleetLoading, setFleetLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchFleetVehicles().then((d) => {
      if (alive) {
        setFleet(d ?? []);
        setFleetLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <motion.div {...pageMotion}>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow two" />

        <div className="container hero-inner">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            
            <h1 className="hero-title">
              Sacred journeys, <em>comfortable</em> rides
            </h1>
            <p className="hero-sub">
              Explore Ayodhya and beyond with clean, well-maintained cabs and
              friendly local drivers. Transparent per-kilometre rates, available
              24×7 for pilgrimages, family trips and group tours.
            </p>

            <div className="hero-actions">
              <a href={`tel:${COMPANY.phoneRaw}`} className="btn btn-primary btn-lg">
                <FaPhoneAlt /> Call Now
              </a>
              <Link to="/gallery" className="btn btn-ghost on-dark btn-lg">
                View Gallery
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <div className="hero-trust-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p>
                  <b>4.9/5</b> from happy travellers
                </p>
              </div>
              <div className="hero-trust-divider" />
              <p>
                <b>10+ years</b>
                <br />
                serving Ayodhya
              </p>
              <div className="hero-trust-divider" />
              <p>
                <b>{fleet.length || "—"} vehicles</b>
                <br />
                from sedans to coaches
              </p>
            </div>
          </motion.div>

          <motion.div
            className="hero-form-wrap"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            {/* <span className="hero-form-badge">Instant Callbac</span> */}
            <BookingForm />
          </motion.div>
        </div>

        <TempleSilhouette />
      </section>

      {/* ===================== MARQUEE ===================== */}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div className="marquee-item" key={dup} aria-hidden={dup === 1}>
              <span>
                <i>◆</i> Ayodhya Darshan
              </span>
              <span>
                <i>◆</i> Airport &amp; Railway Pickup
              </span>
              <span>
                <i>◆</i> Outstation Trips
              </span>
              <span>
                <i>◆</i> 24×7 Availability
              </span>
              <span>
                <i>◆</i> Transparent Pricing
              </span>
              <span>
                <i>◆</i> Group &amp; Tempo Traveller
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== INTRO / ABOUT STRIP ===================== */}
      <section className="section bg-ivory">
        <div className="container intro-split">
          <motion.div
            className="intro-collage"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <img className="tall" src="https://www.thesmartshoppee.com/cdn/shop/articles/TSS_Blogs_2.png?v=1767871834" alt="Temple in Ayodhya" loading="lazy" />
            <img className="short" src="https://akm-img-a-in.tosshub.com/aajtak/images/story/202312/untitled-design-2023-12-21t220329.403-_1-sixteen_nine.jpg?size=948:533" alt="Our comfortable cab" loading="lazy" />
            <img className="short" src="https://bhaskarpthakur.wordpress.com/wp-content/uploads/2021/04/ayodhya-1.jpg?w=432" alt="Saryu ghat" loading="lazy" />
            <div className="intro-badge">
              <b>50k+</b>
              <span>Happy Trips</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Who We Are</span>
            <h2 className="section-title">
              A trusted name for travel in the holy city
            </h2>
            <p className="lead">
              At {COMPANY.name}, we are dedicated to giving you the ultimate
              transportation experience tailored to your needs. With a diverse
              fleet and a commitment to exceptional service, every journey with
              us is a memorable one.
            </p>
            <ul className="checklist">
              <li>
                <FaCheckCircle /> Well-maintained, sanitised vehicles for a safe ride
              </li>
              <li>
                <FaCheckCircle /> Courteous, verified drivers who know Ayodhya inside out
              </li>
              <li>
                <FaCheckCircle /> Clear per-km pricing with absolutely no hidden charges
              </li>
            </ul>
            <div className="hero-actions" style={{ marginTop: 0 }}>
              <Link to="/about" className="btn btn-dark">
                More About Us <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Get a Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== FLEET ===================== */}
      <section className="section bg-cream">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Our Fleet"
            title="Book your ride today"
            sub="Choose from a range of clean, comfortable vehicles — priced per kilometre with no surprises."
          />
          <div className="fleet-grid">
            {fleetLoading ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--c-ink-soft)", padding: "40px 0" }}>
                Loading fleet...
              </p>
            ) : fleet.length === 0 ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--c-ink-soft)", padding: "40px 0" }}>
                Fleet coming soon — check back shortly.
              </p>
            ) : (
              fleet.map((v, i) => (
                <FleetCard key={v.id} vehicle={v} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <WhyChooseUs />

      {/* ===================== OWNERS ===================== */}
      <section className="section bg-ivory">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Meet the Team"
            title="The people behind your journey"
            sub="Trusted, experienced and always at your service — the owners of Sanatan Tour and Travels."
          />
          <div className="owners-grid">
            {/* Owner 1 */}
            <motion.div
              className="owner-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="owner-avatar-wrap">
                <img
                  src="/owners/owner1.jpg"
                  alt="Owner 1"
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Owner+1&size=160&background=f4a340&color=fff&bold=true"; }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--c-ink)", margin: "0 0 4px" }}>Owner Name 1</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--c-ink-soft)" }}>Co-founder, Sanatan Tour and Travels</p>
              </div>
            </motion.div>

            {/* Owner 2 */}
            <motion.div
              className="owner-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <div className="owner-avatar-wrap">
                <img
                  src="/owners/owner2.jpg"
                  alt="Owner 2"
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Owner+2&size=160&background=c9a94e&color=fff&bold=true"; }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--c-ink)", margin: "0 0 4px" }}>Owner Name 2</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--c-ink-soft)" }}>Co-founder, Sanatan Tour and Travels</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <Testimonials />

      {/* ===================== CTA BAND ===================== */}
      <section className="section-tight bg-ivory">
        <div className="container">
          <div className="cta-band">
            <div className="hero-glow" />
            <div className="cta-band-inner">
              <h2>Ready to plan your Ayodhya yatra?</h2>
              <p>
                Call us now or drop your details — our team will help you pick
                the right vehicle and confirm your fare within minutes.
              </p>
              <div className="cta-actions">
                <a href={`tel:${COMPANY.phoneRaw}`} className="btn btn-primary btn-lg">
                  <FaPhoneAlt /> {COMPANY.phone}
                </a>
                <Link to="/contact" className="btn btn-ghost on-dark btn-lg">
                  Send an Enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
