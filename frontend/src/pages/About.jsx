import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaArrowRight,
  FaBullseye,
  FaGem,
  FaPhoneAlt,
} from "react-icons/fa";

import SectionHeading from "../components/SectionHeading.jsx";
import Stats from "../components/Stats.jsx";
import { COMPANY } from "../data/siteData";

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const VALUES = [
  { num: "01", title: "Trust", text: "Honest pricing and dependable service you can count on, every single trip." },
  { num: "02", title: "Comfort", text: "Clean, air-conditioned vehicles maintained to keep long journeys easy." },
  { num: "03", title: "Devotion", text: "We treat every pilgrimage with the respect and care it deserves." },
  { num: "04", title: "Safety", text: "Trained drivers and regular vehicle checks so you always travel secure." },
];

export default function About() {
  return (
    <motion.div {...pageMotion} className="page">
      {/* Banner */}
      <section className="page-hero">
        <div className="hero-glow" />
        <div className="container page-hero-inner">
          <h1>About Us</h1>
          <p>
            Your dependable travel companion in Ayodhya — blending comfort,
            safety and heartfelt hospitality on every journey.
          </p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">About Us</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-ivory">
        <div className="container intro-split">
          <motion.div
            className="intro-collage"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <img className="tall" src="https://picsum.photos/seed/ayodhya-story/500/700" alt="Ayodhya temple" loading="lazy" />
            <img className="short" src="https://picsum.photos/seed/ayodhya-fleet2/500/400" alt="Our fleet" loading="lazy" />
            <img className="short" src="https://picsum.photos/seed/ayodhya-driver/500/400" alt="Our driver" loading="lazy" />
            <div className="intro-badge">
              <b>10+</b>
              <span>Years</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Our Story</span>
            <h2 className="section-title">Serving pilgrims with pride</h2>
            <p className="lead">
              {COMPANY.name} began with a simple goal — to make travel in the
              holy city of Ayodhya easy, comfortable and worry-free. Over the
              years we have grown into a trusted travel agency, welcoming
              thousands of pilgrims and families from across India.
            </p>
            <p className="lead" style={{ marginTop: 14 }}>
              From a single cab to a full fleet of sedans, SUVs and tempo
              travellers, our promise has stayed the same: exceptional service,
              transparent rates and a journey you will cherish.
            </p>
            <ul className="checklist">
              <li>
                <FaCheckCircle /> Local expertise across every temple and ghat
              </li>
              <li>
                <FaCheckCircle /> A vehicle for every group size and budget
              </li>
              <li>
                <FaCheckCircle /> Round-the-clock booking and support
              </li>
            </ul>
            <Link to="/contact" className="btn btn-dark">
              Plan Your Trip <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-cream">
        <div className="container">
          <div className="mv-grid">
            <motion.div
              className="mv-card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className="feature-icon">
                <FaBullseye />
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide safe, reliable and affordable transportation that
                lets every traveller focus on their darshan and their family —
                while we take care of the road.
              </p>
            </motion.div>

            <motion.div
              className="mv-card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="feature-icon">
                <FaGem />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be Ayodhya&apos;s most loved travel partner — known for warm
                hospitality, spotless vehicles and a service that feels personal
                from the first call to the last mile.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-ivory">
        <div className="container">
          <SectionHeading
            center
            eyebrow="What Drives Us"
            title="Values behind every journey"
          />
          <div className="value-grid">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.num}
                className="value-card"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              >
                <div className="value-num">{v.num}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="section bg-navy on-dark">
        <div className="container">
          <SectionHeading
            center
            onDark
            eyebrow="By the Numbers"
            title="A decade of happy travellers"
          />
          <Stats onDark />
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight bg-ivory">
        <div className="container">
          <div className="cta-band">
            <div className="hero-glow" />
            <div className="cta-band-inner">
              <h2>Let us drive your next journey</h2>
              <p>
                Whether it is a quick temple visit or a multi-day yatra, we have
                the right vehicle and the right price for you.
              </p>
              <div className="cta-actions">
                <a href={`tel:${COMPANY.phoneRaw}`} className="btn btn-primary btn-lg">
                  <FaPhoneAlt /> Call {COMPANY.phone}
                </a>
                <Link to="/gallery" className="btn btn-ghost on-dark btn-lg">
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
