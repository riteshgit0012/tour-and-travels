import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchStats } from "../api";
import { STATS } from "../data/siteData";

// Renders the stats row. Pass onDark for use on the indigo band.
export default function Stats({ onDark = false }) {
  const [stats, setStats] = useState(STATS);

  useEffect(() => {
    let alive = true;
    fetchStats().then((data) => alive && setStats(data));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="stats-row">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className={`stat ${onDark ? "on-dark" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
