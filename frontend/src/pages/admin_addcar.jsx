import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaUpload,
  FaLink,
  FaCar,
  FaImage,
} from "react-icons/fa";
import {
  fetchFleetVehicles,
  addFleetVehicle,
  deleteFleetVehicle,
} from "../api";

const CATEGORIES = [
  "Popular Sedan",
  "Luxury SUV",
  "Group Travel",
  "Premium",
  "Most Affordable",
  "Family Favourite",
  "Budget Pick",
];

const API_BASE = import.meta.env.VITE_API_URL || '';

function resolveImageUrl(path) {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed === '') return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${API_BASE}${normalizedPath}`;
}

const EMPTY_FORM = {
  name: "",
  vtype: "",
  seats: 4,
  price_per_km: "",
  tag: "Popular Sedan",
  description: "",
  features: "",
  image_url: "",
  file: null,
};

export default function AdminAddCar() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMode, setInputMode] = useState("file");
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetchFleetVehicles().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, file }));
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!form.name.trim()) {
      setMsg({ type: "error", text: "Car name is required." });
      return;
    }
    if (!form.vtype.trim()) {
      setMsg({ type: "error", text: "Car type is required (e.g. 5 Seater Sedan)." });
      return;
    }
    if (!form.price_per_km || Number(form.price_per_km) <= 0) {
      setMsg({ type: "error", text: "Valid price per km is required." });
      return;
    }
    if (!form.description.trim()) {
      setMsg({ type: "error", text: "Description is required." });
      return;
    }
    if (inputMode === "url" && !form.image_url.trim()) {
      setMsg({ type: "error", text: "Car image URL is required." });
      return;
    }
    if (inputMode === "file" && !form.file) {
      setMsg({ type: "error", text: "Please upload a car image." });
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("vtype", form.vtype.trim());
    fd.append("seats", String(form.seats));
    fd.append("price_per_km", String(form.price_per_km));
    fd.append("tag", form.tag);
    fd.append("description", form.description.trim());
    fd.append("features", form.features.trim());
    if (inputMode === "url") fd.append("image_url", form.image_url.trim());
    else fd.append("file", form.file);

    setSubmitting(true);
    const result = await addFleetVehicle(fd);
    setSubmitting(false);

    if (!result.ok) {
      setMsg({ type: "error", text: result.message });
      return;
    }

    setVehicles((prev) => [...prev, result.vehicle]);
    setMsg({ type: "success", text: "Car added! It will appear on the Home page instantly." });
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this car from the fleet?")) return;
    setDeletingId(id);
    const result = await deleteFleetVehicle(id);
    setDeletingId(null);
    if (!result.ok) {
      setMsg({ type: "error", text: result.message });
      return;
    }
    setVehicles((v) => v.filter((car) => car.id !== id));
    setMsg({ type: "success", text: "Car removed." });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-bg)", display: "flex", flexDirection: "column" }}>

      {/* ── Admin Top Bar ─────────────────────────────────────────────── */}
      <header className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--c-marigold), var(--c-marigold-2))",
            display: "grid", placeItems: "center", color: "#3a1e02", fontSize: "0.9rem",
          }}>
            <FaCar />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.01em" }}>
            Sanatan Admin
          </span>
        </div>

        <nav className="admin-header-nav">
          <Link to="/admin" style={{
            color: "var(--c-on-dark-soft)", fontSize: "0.85rem", fontWeight: 600,
            textDecoration: "none", padding: "7px 14px", borderRadius: 8,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <FaImage /> Gallery
          </Link>
          <Link to="/admin/add-car" style={{
            color: "var(--c-marigold)", fontSize: "0.85rem", fontWeight: 700,
            textDecoration: "none", padding: "7px 14px", borderRadius: 8,
            background: "rgba(244,163,64,0.15)", border: "1px solid rgba(244,163,64,0.35)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <FaCar /> Add Car
          </Link>
        </nav>

        <div className="admin-header-actions">
          <Link to="/" target="_blank" rel="noreferrer" style={{
            color: "var(--c-on-dark-soft)", fontSize: "0.85rem", fontWeight: 600,
            textDecoration: "none",
          }}>
            View Site ↗
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--c-on-dark)", borderRadius: 8, padding: "7px 16px",
              cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="admin-main">

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--c-ink)", margin: 0 }}>
            Fleet Management
          </h1>
          <p style={{ color: "var(--c-ink-soft)", marginTop: 6, fontSize: "0.92rem" }}>
            Add cars with photos, pricing and features. They appear on the Home page &quot;Book your ride today&quot; section.
          </p>
        </div>

        {msg.text && (
          <div className={"form-note " + msg.type} style={{ marginBottom: 24, maxWidth: 520 }}>
            {msg.text}
          </div>
        )}

        <div className="admin-layout">

          {/* Add Car Form */}
          <div className="admin-sidebar">
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, color: "var(--c-ink)" }}>
              Add New Car
            </h2>
            <form
              className="form-card"
              onSubmit={handleSubmit}
              noValidate
              encType="multipart/form-data"
              style={{ padding: "24px 22px" }}
            >
              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="car-name">Car Name *</label>
                <input
                  className="field-input"
                  id="car-name"
                  type="text"
                  placeholder="e.g. Maruti Suzuki Dzire"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="car-type">Car Type *</label>
                <input
                  className="field-input"
                  id="car-type"
                  type="text"
                  placeholder="e.g. 5 Seater Sedan"
                  value={form.vtype}
                  onChange={(e) => setForm((f) => ({ ...f, vtype: e.target.value }))}
                  required
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="car-category">Category</label>
                <select
                  className="field-input"
                  id="car-category"
                  value={form.tag}
                  onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div className="field">
                  <label htmlFor="car-price">Price / km (₹) *</label>
                  <input
                    className="field-input"
                    id="car-price"
                    type="number"
                    min="1"
                    placeholder="11"
                    value={form.price_per_km}
                    onChange={(e) => setForm((f) => ({ ...f, price_per_km: e.target.value }))}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="car-seats">Seats</label>
                  <input
                    className="field-input"
                    id="car-seats"
                    type="number"
                    min="1"
                    max="50"
                    value={form.seats}
                    onChange={(e) => setForm((f) => ({ ...f, seats: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="car-desc">Description *</label>
                <textarea
                  className="field-input"
                  id="car-desc"
                  rows={3}
                  placeholder="A reliable sedan with generous boot space..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ resize: "vertical", minHeight: 72 }}
                  required
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="car-features">
                  Features <small style={{ color: "var(--c-ink-faint)" }}>(comma separated)</small>
                </label>
                <input
                  className="field-input"
                  id="car-features"
                  type="text"
                  placeholder="4 Seats, AC, Boot Space, City & Highway"
                  value={form.features}
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                />
              </div>

              {/* Image upload toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button
                  type="button"
                  className={"filter-btn" + (inputMode === "file" ? " active" : "")}
                  style={{ flex: 1, fontSize: "0.82rem" }}
                  onClick={() => { setInputMode("file"); setPreview(null); setForm((f) => ({ ...f, file: null, image_url: "" })); }}
                >
                  <FaUpload style={{ marginRight: 5 }} /> Upload Image
                </button>
                <button
                  type="button"
                  className={"filter-btn" + (inputMode === "url" ? " active" : "")}
                  style={{ flex: 1, fontSize: "0.82rem" }}
                  onClick={() => { setInputMode("url"); setPreview(null); setForm((f) => ({ ...f, file: null })); if (fileRef.current) fileRef.current.value = ""; }}
                >
                  <FaLink style={{ marginRight: 5 }} /> Image URL
                </button>
              </div>

              {inputMode === "url" ? (
                <div className="field" style={{ marginBottom: 14 }}>
                  <label htmlFor="car-url">Car Image URL *</label>
                  <input
                    className="field-input"
                    id="car-url"
                    type="url"
                    placeholder="https://example.com/car.jpg"
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="field" style={{ marginBottom: 14 }}>
                  <label htmlFor="car-file">
                    Car Photo * <small style={{ color: "var(--c-ink-faint)" }}>(JPG, PNG, WEBP)</small>
                  </label>
                  <input
                    className="field-input"
                    id="car-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={fileRef}
                    onChange={handleFileChange}
                    style={{ padding: "10px 14px", cursor: "pointer" }}
                  />
                </div>
              )}

              {(preview || (inputMode === "url" && form.image_url)) && (
                <div style={{
                  marginBottom: 14, borderRadius: "var(--radius)", overflow: "hidden",
                  border: "1px solid var(--c-line)", background: "#f0ece3", aspectRatio: "16/9",
                }}>
                  <img
                    src={preview || form.image_url}
                    alt="Car preview"
                    onError={(e) => { e.target.style.display = "none"; }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
                style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <FaPlus /> {submitting ? "Adding..." : "Add Car"}
              </button>
            </form>
          </div>

          {/* Current Fleet Grid */}
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, color: "var(--c-ink)" }}>
              Current Fleet
              <span style={{
                marginLeft: 10, background: "var(--c-navy)", color: "#fff",
                borderRadius: 999, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 700,
              }}>
                {vehicles.length}
              </span>
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--c-ink-faint)" }}>
                Loading fleet...
              </div>
            ) : vehicles.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 0", color: "var(--c-ink-faint)",
                background: "var(--c-surface)", borderRadius: "var(--radius-lg)",
                border: "2px dashed var(--c-line)",
              }}>
                <FaCar style={{ fontSize: "3rem", marginBottom: 14, opacity: 0.25 }} />
                <p style={{ fontWeight: 600 }}>No cars yet</p>
                <p style={{ fontSize: "0.88rem", marginTop: 4 }}>Add your first car using the form on the left.</p>
              </div>
            ) : (
              <motion.div
                layout
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}
              >
                <AnimatePresence>
                  {vehicles.map((car) => (
                    <motion.div
                      key={car.id}
                      layout
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.28 }}
                      style={{
                        position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden",
                        border: "1px solid var(--c-line)", background: "var(--c-surface)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "var(--c-navy)" }}>
                        {car.image_url ? (
                          <img
                            src={resolveImageUrl(car.image_url)}
                            alt={car.name}
                            loading="lazy"
                            onError={(e) => { e.target.style.opacity = "0.2"; }}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--c-marigold)", fontSize: "2.5rem" }}>
                            <FaCar />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "12px 14px 14px" }}>
                        {car.tag && (
                          <span style={{
                            display: "inline-block", fontSize: "0.68rem", fontWeight: 800,
                            letterSpacing: "0.06em", textTransform: "uppercase",
                            color: "var(--c-gold)", marginBottom: 4,
                          }}>
                            {car.tag}
                          </span>
                        )}
                        <p style={{
                          fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3,
                          color: "var(--c-ink)", margin: "0 0 2px",
                        }}>
                          {car.name}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--c-ink-soft)", margin: "0 0 6px" }}>
                          {car.type}
                        </p>
                        <p style={{ fontWeight: 800, color: "var(--c-marigold-2)", fontSize: "0.9rem", margin: 0 }}>
                          ₹{car.price_per_km}/km
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(car.id)}
                        disabled={deletingId === car.id}
                        aria-label={"Delete " + car.name}
                        style={{
                          position: "absolute", top: 8, right: 8,
                          width: 30, height: 30, borderRadius: "50%",
                          border: "none", background: "rgba(139,47,58,0.9)",
                          color: "#fff", cursor: "pointer",
                          display: "grid", placeItems: "center", fontSize: "0.8rem",
                          opacity: deletingId === car.id ? 0.4 : 1,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        <FaTrash />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}