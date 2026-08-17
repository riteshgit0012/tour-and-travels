import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaImage, FaSignOutAlt, FaUpload, FaLink, FaCar } from "react-icons/fa";
import { fetchGalleryImages, addGalleryImage, deleteGalleryImage } from "../api";

const CATEGORIES = ["Temples", "Rituals", "Fleet", "Nature", "General"];

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMode, setInputMode] = useState("url");
  const [form, setForm] = useState({ title: "", category: "Temples", image_url: "", file: null });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [deletingId, setDeletingId] = useState(null);

  // Token guard
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Initial load
  useEffect(() => {
    fetchGalleryImages().then((data) => {
      setImages(data);
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
    setForm({ title: "", category: "Temples", image_url: "", file: null });
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!form.title.trim()) {
      setMsg({ type: "error", text: "Title is required." });
      return;
    }
    if (inputMode === "url" && !form.image_url.trim()) {
      setMsg({ type: "error", text: "Image URL is required." });
      return;
    }
    if (inputMode === "file" && !form.file) {
      setMsg({ type: "error", text: "Please select a file." });
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("category", form.category);
    if (inputMode === "url") fd.append("image_url", form.image_url.trim());
    else fd.append("file", form.file);

    setSubmitting(true);
    const result = await addGalleryImage(fd);
    setSubmitting(false);

    if (!result.ok) {
      setMsg({ type: "error", text: result.message });
      return;
    }

    // Instantly prepend new image to gallery — no re-fetch needed
    setImages((prev) => [result.image, ...prev]);
    setMsg({ type: "success", text: "Image added to gallery!" });
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this image from the gallery?")) return;
    setDeletingId(id);
    const result = await deleteGalleryImage(id);
    setDeletingId(null);
    if (!result.ok) {
      setMsg({ type: "error", text: result.message });
      return;
    }
    setImages((imgs) => imgs.filter((i) => i.id !== id));
    setMsg({ type: "success", text: "Image deleted." });
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
            <FaImage />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.01em" }}>
            Sanatan Admin
          </span>
        </div>

        <nav className="admin-header-nav">
          <Link to="/admin" style={{
            color: "var(--c-marigold)", fontSize: "0.85rem", fontWeight: 700,
            textDecoration: "none", padding: "7px 14px", borderRadius: 8,
            background: "rgba(244,163,64,0.15)", border: "1px solid rgba(244,163,64,0.35)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <FaImage /> Gallery
          </Link>
          <Link to="/admin/add-car" style={{
            color: "var(--c-on-dark-soft)", fontSize: "0.85rem", fontWeight: 600,
            textDecoration: "none", padding: "7px 14px", borderRadius: 8,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <FaCar /> Add Car
          </Link>
        </nav>

        <div className="admin-header-actions">
          <Link to="/" target="_blank" rel="noreferrer" style={{
            color: "var(--c-on-dark-soft)", fontSize: "0.85rem", fontWeight: 600,
            textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
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
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="admin-main">

        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--c-ink)", margin: 0 }}>
            Gallery Management
          </h1>
          <p style={{ color: "var(--c-ink-soft)", marginTop: 6, fontSize: "0.92rem" }}>
            Upload new images or remove existing ones. Changes reflect on the public gallery instantly.
          </p>
        </div>

        {/* Feedback message */}
        {msg.text && (
          <div className={"form-note " + msg.type} style={{ marginBottom: 24, maxWidth: 520 }}>
            {msg.text}
          </div>
        )}

        <div className="admin-layout">

          {/* ── Upload Form ───────────────────────────────────────────── */}
          <div className="admin-sidebar">
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, color: "var(--c-ink)" }}>
              Add New Image
            </h2>
            <form
              className="form-card"
              onSubmit={handleSubmit}
              noValidate
              encType="multipart/form-data"
              style={{ padding: "24px 22px" }}
            >
              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="img-title">Image Title *</label>
                <input
                  className="field-input"
                  id="img-title"
                  type="text"
                  placeholder="e.g. Ram Ki Paidi Ghat"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label htmlFor="img-category">Category</label>
                <select
                  className="field-input"
                  id="img-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* URL / File toggle */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button
                  type="button"
                  className={"filter-btn" + (inputMode === "url" ? " active" : "")}
                  style={{ flex: 1, fontSize: "0.82rem" }}
                  onClick={() => { setInputMode("url"); resetForm(); }}
                >
                  <FaLink style={{ marginRight: 5 }} /> URL
                </button>
                <button
                  type="button"
                  className={"filter-btn" + (inputMode === "file" ? " active" : "")}
                  style={{ flex: 1, fontSize: "0.82rem" }}
                  onClick={() => { setInputMode("file"); resetForm(); }}
                >
                  <FaUpload style={{ marginRight: 5 }} /> Upload File
                </button>
              </div>

              {inputMode === "url" ? (
                <div className="field" style={{ marginBottom: 14 }}>
                  <label htmlFor="img-url">Image URL *</label>
                  <input
                    className="field-input"
                    id="img-url"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  />
                </div>
              ) : (
                <div className="field" style={{ marginBottom: 14 }}>
                  <label htmlFor="img-file">
                    Upload File * <small style={{ color: "var(--c-ink-faint)" }}>(JPG, PNG, WEBP)</small>
                  </label>
                  <input
                    className="field-input"
                    id="img-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    ref={fileRef}
                    onChange={handleFileChange}
                    style={{ padding: "10px 14px", cursor: "pointer" }}
                  />
                </div>
              )}

              {/* Live preview */}
              {(preview || (inputMode === "url" && form.image_url)) && (
                <div style={{
                  marginBottom: 14, borderRadius: "var(--radius)", overflow: "hidden",
                  border: "1px solid var(--c-line)", background: "#f0ece3", aspectRatio: "16/9",
                }}>
                  <img
                    src={preview || form.image_url}
                    alt="Preview"
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
                <FaPlus /> {submitting ? "Uploading..." : "Add to Gallery"}
              </button>
            </form>
          </div>

          {/* ── Gallery Grid ──────────────────────────────────────────── */}
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, color: "var(--c-ink)" }}>
              Current Gallery
              <span style={{
                marginLeft: 10, background: "var(--c-navy)", color: "#fff",
                borderRadius: 999, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 700,
              }}>
                {images.length}
              </span>
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--c-ink-faint)" }}>
                Loading images...
              </div>
            ) : images.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 0", color: "var(--c-ink-faint)",
                background: "var(--c-surface)", borderRadius: "var(--radius-lg)",
                border: "2px dashed var(--c-line)",
              }}>
                <FaImage style={{ fontSize: "3rem", marginBottom: 14, opacity: 0.25 }} />
                <p style={{ fontWeight: 600 }}>No images yet</p>
                <p style={{ fontSize: "0.88rem", marginTop: 4 }}>Add one using the form on the left.</p>
              </div>
            ) : (
              <motion.div
                layout
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}
              >
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
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
                      <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "#e8e0d4" }}>
                        <img
                          src={img.src}
                          alt={img.title}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>
                      <div style={{ padding: "10px 12px 12px" }}>
                        <span style={{
                          display: "inline-block", fontSize: "0.68rem", fontWeight: 800,
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          color: "var(--c-gold)", marginBottom: 4,
                        }}>
                          {img.category}
                        </span>
                        <p style={{
                          fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.3,
                          color: "var(--c-ink)", margin: 0,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {img.title}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(img.id)}
                        disabled={deletingId === img.id}
                        aria-label={"Delete " + img.title}
                        style={{
                          position: "absolute", top: 8, right: 8,
                          width: 30, height: 30, borderRadius: "50%",
                          border: "none", background: "rgba(139,47,58,0.9)",
                          color: "#fff", cursor: "pointer",
                          display: "grid", placeItems: "center", fontSize: "0.8rem",
                          opacity: deletingId === img.id ? 0.4 : 1,
                          transition: "opacity 0.2s, transform 0.15s",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        }}
                        onMouseOver={(e) => { if (deletingId !== img.id) e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
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
