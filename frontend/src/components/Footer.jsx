import { Link } from "react-router-dom";
import "./footer.css";
import {
  FaArrowRight,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserShield,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { COMPANY, NAV_LINKS } from "../data/siteData";

const fleetLinks = [
  { label: "Ertiga & Dzire", to: "/" },
  { label: "Innova Crysta", to: "/" },
  { label: "Tempo Traveller", to: "/" },
  { label: "Group Tours", to: "/" },
];

function FooterLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`footer-link ${className}`.trim()}>
      <FaArrowRight aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}`;

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="container footer-container">
        <div className="footer-grid">
          <section className="footer-about" aria-labelledby="footer-about-title">
            <Link to="/" className="brand" aria-label="Sanatan Tour & Travels home">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 2c2.2 3 4 5 4 8a4 4 0 0 1-8 0c0-1.6.8-3 2-4.5C11 7 12 5 12 2z" />
                </svg>
              </span>
              <span className="brand-text">
                <strong id="footer-about-title">Sanatan</strong>
                <span>Tour &amp; Travels</span>
              </span>
            </Link>

            <p className="footer-description">
              Your trusted travel partner in Ayodhya. Comfortable, safe and
              affordable cab services for pilgrimages, family trips and group
              tours across Uttar Pradesh.
            </p>

            <div className="footer-social" aria-label="Social media links">
              <a href="#" aria-label="Facebook" onClick={(event) => event.preventDefault()}>
                <FaFacebookF aria-hidden="true" />
              </a>
              <a href="#" aria-label="Instagram" onClick={(event) => event.preventDefault()}>
                <FaInstagram aria-hidden="true" />
              </a>
              <a href="#" aria-label="YouTube" onClick={(event) => event.preventDefault()}>
                <FaYoutube aria-hidden="true" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
              >
                <FaWhatsapp aria-hidden="true" />
              </a>
            </div>
          </section>

          <nav className="footer-column" aria-labelledby="quick-links-title">
            <h2 id="quick-links-title">Quick Links</h2>
            <div className="footer-links">
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
              <Link to="/login" className="footer-link admin-link">
                <FaUserShield aria-hidden="true" style={{ fontSize: "0.75rem", marginTop: "0.28rem", flexShrink: 0 }} />
                <span>Admin Login</span>
              </Link>
            </div>
          </nav>

          <nav className="footer-column" aria-labelledby="fleet-title">
            <h2 id="fleet-title">Our Fleet</h2>
            <div className="footer-links">
              {fleetLinks.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </nav>

          <section className="footer-column" aria-labelledby="contact-title">
            <h2 id="contact-title">Get in Touch</h2>
            <div className="footer-contact">
              <a href={`tel:${COMPANY.phoneRaw}`}>
                <FaPhoneAlt aria-hidden="true" />
                <span>{COMPANY.phone}</span>
              </a>
              <a href={`mailto:${COMPANY.email}`}>
                <FaEnvelope aria-hidden="true" />
                <span>{COMPANY.email}</span>
              </a>
              <address>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>{COMPANY.address}</span>
              </address>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {year} {COMPANY.name}. All rights reserved.</p>
          <p>
            Made with care for Ayodhya&apos;s pilgrims <span aria-hidden="true">·</span>{" "}
            <a href={`tel:${COMPANY.phoneRaw}`}>Book now</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
