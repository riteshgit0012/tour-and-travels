import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function FleetCard({ vehicle, index = 0 }) {
  const imageSrc = vehicle.image_url || vehicle.image || '';
  const hasPhoto = imageSrc.trim() !== '';

  return (
    <motion.article
      className="fleet-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: 'easeOut',
      }}
    >
      <div className={'fleet-visual' + (hasPhoto ? ' has-photo' : '')}>
        {vehicle.tag && (
          <span className="fleet-tag">
            {vehicle.tag}
          </span>
        )}

        {hasPhoto && (
          <img
            src={imageSrc}
            alt={vehicle.name}
            loading="lazy"
            className="fleet-photo"
          />
        )}

        <span className="fleet-price">
          ₹{vehicle.price_per_km}
          <small>/km</small>
        </span>
      </div>

      <div className="fleet-body">
        <div>
          <h3 className="fleet-name">
            {vehicle.name}
          </h3>

          <div className="fleet-type">
            {vehicle.type}
          </div>
        </div>

        <p className="fleet-desc">
          {vehicle.description}
        </p>

        <ul className="fleet-features">
          {(vehicle.features || []).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <Link
          to="/contact"
          className="btn btn-dark btn-block"
        >
          Book This <FaArrowRight />
        </Link>
      </div>
    </motion.article>
  );
}
