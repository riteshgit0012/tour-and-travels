import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginAdmin } from "../api";

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    const result = await loginAdmin(form.username.trim(), form.password);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    localStorage.setItem("admin_token", result.token);
    navigate("/admin");
  };

  return (
    <motion.div {...pageMotion} className="page">
      <section className="page-hero">
        <div className="hero-glow" />
        <div className="container page-hero-inner">
          <h1>Admin Login</h1>
          <p>Sign in to manage gallery images and site content.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Admin</span>
          </div>
        </div>
      </section>

      <section className="section bg-ivory" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div className="container" style={{ maxWidth: 460 }}>
          <form className="form-card" onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--c-marigold),var(--c-marigold-2))", display: "grid", placeItems: "center", fontSize: "1.4rem", color: "#3a1e02", margin: "0 auto 16px" }}>
                <FaLock />
              </div>
              <h2 style={{ textAlign: "center", fontSize: "1.6rem" }}>Welcome Back</h2>
              <p style={{ textAlign: "center", color: "var(--c-ink-soft)", marginTop: 6, fontSize: "0.95rem" }}>
                Enter your admin credentials to continue.
              </p>
            </div>

            {error && <div className="form-note error" style={{ marginBottom: 20 }}>{error}</div>}

            <div className="field" style={{ marginBottom: 18 }}>
              <label htmlFor="login-username">Username</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--c-ink-faint)", pointerEvents: "none" }}><FaUser /></span>
                <input className="field-input" id="login-username" name="username" type="text" autoComplete="username" placeholder="admin" value={form.username} onChange={handleChange} style={{ paddingLeft: 40 }} required />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 26 }}>
              <label htmlFor="login-password">Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--c-ink-faint)", pointerEvents: "none" }}><FaLock /></span>
                <input className="field-input" id="login-password" name="password" type={showPwd ? "text" : "password"} autoComplete="current-password" placeholder="Your password" value={form.password} onChange={handleChange} style={{ paddingLeft: 40, paddingRight: 44 }} required />
                <button type="button" onClick={() => setShowPwd((v) => !v)} aria-label={showPwd ? "Hide password" : "Show password"} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--c-ink-faint)", padding: 4 }}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </motion.div>
  );
}
