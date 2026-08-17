import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaClock,
  FaWallet,
  FaHeadset,
  FaRoute,
  FaStar,
} from "react-icons/fa";
import { fetchFeatures } from "../api";
import { FEATURES } from "../data/siteData";
import SectionHeading from "./SectionHeading.jsx";

const ICONS = {
  shield: FaShieldAlt,
  clock: FaClock,
  wallet: FaWallet,
  headset: FaHeadset,
  route: FaRoute,
  star: FaStar,
};

export default function WhyChooseUs() {
  const [features, setFeatures] = useState(FEATURES);

  useEffect(() => {
    let alive = true;
    fetchFeatures().then((data) => alive && setFeatures(data));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="section bg-navy on-dark" style={{ overflow: "hidden", position: "relative" }}>
      <div className="hero-glow" style={{ opacity: 0.35 }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SectionHeading
          center
          onDark
          eyebrow="Why Choose Us"
          title="Travel with people who care"
          sub="From spotless vehicles to drivers who know every temple lane — here is what makes every journey with us worry-free."
        />

        <div className="feature-grid">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] || FaStar;
            return (
              <motion.div
                key={f.title}
                className="feature-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <div className="feature-icon">
                  <Icon />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
