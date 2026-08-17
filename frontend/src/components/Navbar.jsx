import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaPhoneAlt, FaBars, FaTimes, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { COMPANY, NAV_LINKS } from "../data/siteData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const Brand = (
    <Link to="/" className="brand" onClick={() => setOpen(false)}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12 2c2.2 3 4 5 4 8a4 4 0 0 1-8 0c0-1.6.8-3 2-4.5C11 7 12 5 12 2z" />
        </svg>
      </span>
      <span className="brand-text">
        <b>Sanatan</b>
        <span>Tour &amp; Travels</span>
      </span>
    </Link>
  );

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {Brand}

          <nav className="nav-links">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-cta">
            <a className="nav-call" href={`tel:${COMPANY.phoneRaw}`}>
              <FaPhoneAlt /> {COMPANY.phone}
            </a>
            <Link to="/contact" className="btn btn-primary">
              Book a Cab
            </Link>
            <button
              className="nav-toggle"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
        <div className="mobile-panel">
          <div className="mobile-head">
            {Brand}
            <button
              className="mobile-close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <nav className="mobile-links">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mobile-contact">
            <a href={`tel:${COMPANY.phoneRaw}`}>
              <FaPhoneAlt /> {COMPANY.phone}
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> WhatsApp Us
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <FaMapMarkerAlt /> {COMPANY.address}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
