import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";

import SectionHeading from "../components/SectionHeading.jsx";
import { submitContact } from "../api";
import { COMPANY } from "../data/siteData";

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const EMPTY = { name: "", phone: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setStatus({ ok: false, message: "Please share your name, phone and a short message." });
      return;
    }
    setLoading(true);
    setStatus(null);
    const res = await submitContact(form);
    setStatus(res);
    setLoading(false);
    if (res.ok) setForm(EMPTY);
  };

  const cards = [
    {
      icon: <FaPhoneAlt />,
      label: "Phone",
      value: COMPANY.phone,
      href: `tel:${COMPANY.phoneRaw}`,
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      value: COMPANY.phone,
      href: `https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}`,
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
    },
    {
      icon: <FaClock />,
      label: "Hours",
      value: COMPANY.hours,
      href: null,
    },
  ];

  return (
    <motion.div {...pageMotion} className="page">
      {/* Banner */}
      <section className="page-hero">
        <div className="hero-glow" />
        <div className="container page-hero-inner">
          <h1>Contact Us</h1>
          <p>
            Have a question or ready to book? Call, WhatsApp or drop us a message
            — we&apos;ll get back to you as soon as possible.
          </p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Contact</span>
          </div>
        </div>
      </section>

      {/* Layout */}
      <section className="section bg-ivory">
        <div className="container contact-layout">
          {/* Left: info + map */}
          <div>
            <span className="eyebrow">Reach Us</span>
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Feel free to ask a question
            </h2>

            <div className="contact-info">
              {cards.map((c) => (
                <motion.div
                  key={c.label}
                  className="contact-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45 }}
                >
                  <span className="ci-icon">{c.icon}</span>
                  <div>
                    <h4>{c.label}</h4>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p>{c.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="contact-card">
                <span className="ci-icon">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <h4>Address</h4>
                  <p>{COMPANY.address}</p>
                </div>
              </div>
            </div>

            <div className="map-embed">
              <iframe
                title="Our location in Ayodhya"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  COMPANY.mapQuery
                )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="form-card">
              <div className="form-card-head">
                <h3>Get in touch</h3>
                <p>
                  Fill in the form below and we will contact you as soon as
                  possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="ct-name">Full Name</label>
                    <input
                      id="ct-name"
                      className="field-input"
                      name="name"
                      value={form.name}
                      onChange={update}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ct-phone">Phone</label>
                    <input
                      id="ct-phone"
                      className="field-input"
                      name="phone"
                      value={form.phone}
                      onChange={update}
                      placeholder="10-digit mobile"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="ct-email">Email (optional)</label>
                    <input
                      id="ct-email"
                      className="field-input"
                      name="email"
                      value={form.email}
                      onChange={update}
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="ct-subject">Subject</label>
                    <input
                      id="ct-subject"
                      className="field-input"
                      name="subject"
                      value={form.subject}
                      onChange={update}
                      placeholder="Booking / enquiry"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="ct-message">Message</label>
                  <textarea
                    id="ct-message"
                    className="field-input"
                    name="message"
                    value={form.message}
                    onChange={update}
                    placeholder="Tell us about your trip — dates, group size, destinations…"
                  />
                </div>

                <button
                  className="btn btn-primary btn-block btn-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send Message"} <FaArrowRight />
                </button>

                {status && (
                  <div className={`form-note ${status.ok ? "success" : "error"}`}>
                    {status.ok ? <FaCheckCircle /> : <FaExclamationCircle />}
                    <span>{status.message}</span>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
