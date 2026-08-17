import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { COMPANY } from "../data/siteData";

// Persistent quick-contact buttons (bottom-right).
export default function FloatingButtons() {
  return (
    <div className="floating">
      <a
        className="float-btn whatsapp"
        href={`https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
      <a
        className="float-btn call"
        href={`tel:${COMPANY.phoneRaw}`}
        aria-label="Call us"
      >
        <FaPhoneAlt />
      </a>
    </div>
  );
}
