import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import FloatingButtons from "./components/FloatingButtons.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminAddCar from "./pages/admin_addcar.jsx";

// Routes jahan site ka Navbar/Footer nahi dikhna chahiye
const ADMIN_ROUTES = ["/admin", "/admin/add-car", "/login"];

export default function App() {
  const location = useLocation();
  const isAdminRoute = ADMIN_ROUTES.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-car" element={<AdminAddCar />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingButtons />}
    </>
  );
}
