import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-8 backdrop-blur-xl transition-all duration-300 ${scrolled ? "bg-[#080b12]/90 border-b border-[#1e2a42]" : "bg-[#080b12]/60 border-b border-transparent"}`}
    >
      <Link to="/" className="text-lg font-black tracking-tight text-gradient">
        🍽️ RecipeAPI
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
          { to: "/", label: "Home" },
          { to: "/docs", label: "Docs" },
          { to: "/submit-recipe", label: "Submit Recipe" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors duration-200 ${isActive(link.to) ? "text-[#e2e8f0]" : "text-[#64748b] hover:text-[#e2e8f0]"}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {!loading &&
          (user ? (
            <UserDropdown />
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#64748b] hover:text-[#e2e8f0] border border-[#1e2a42] hover:border-orange-500 px-4 py-2 rounded-xl transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30"
              >
                Sign up →
              </Link>
            </>
          ))}
      </div>
    </nav>
  );
}
