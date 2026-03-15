import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Linkedin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
    const { user } = useAuth();
  return (
    <footer className="border-t border-[#1e2a42] bg-[#0e1420] px-8 pt-12 pb-8 relative z-[2]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="text-lg font-black tracking-tight text-gradient mb-3">
              🍽️ RecipeAPI
            </p>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-[240px]">
              600+ AI-generated Indian recipes. Free REST API for developers. No
              credit card required.
            </p>
            <div className="flex gap-2 mt-4">
              {[
                {
                  icon: <Github size={15} />,
                  href: "https://github.com/kramit624",
                },
                {
                  icon: <Linkedin size={15} />,
                  href: "https://www.linkedin.com/in/amit-raj-101204m",
                },
                {
                  icon: <Mail size={15} />,
                  href: "mailto:kumaramit17072004@gmail.com",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-8 h-8 flex items-center justify-center bg-[#141b2d] border border-[#1e2a42] hover:border-orange-500 hover:text-orange-400 rounded-lg text-[#64748b] transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-4">
              Product
            </p>
            {[
              { label: "Home", to: "/" },
              { label: "Documentation", to: "/docs" },
              { label: "API Dashboard", to: "/api-dashboard" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-sm text-[#64748b] hover:text-[#e2e8f0] mb-2.5 transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-4">
              Developers
            </p>
            {[
              { label: "Quick Start", to: "/docs" },
              { label: "Authentication", to: "/docs#authentication" },
              { label: "Rate Limits", to: "/docs#rate-limits" },
              { label: "Error Codes", to: "/docs#errors" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="block text-sm text-[#64748b] hover:text-[#e2e8f0] mb-2.5 transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-4">
              Account
            </p>
            {(user
              ? [
                  { label: "Dashboard", to: "/api-dashboard" },
                  { label: "Analytics", to: "/analytics" },
                  { label: "Profile", to: "/profile" },
                ]
              : [
                  { label: "Sign Up", to: "/signup" },
                  { label: "Login", to: "/login" },
                  { label: "Profile", to: "/profile" },
                ]
            ).map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="block text-sm text-[#64748b] hover:text-[#e2e8f0] mb-2.5 transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1e2a42] pt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#64748b]">
            © {new Date().getFullYear()} RecipeAPI. Built with ❤️ for
            developers.
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
            <span className="text-xs text-[#64748b]">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
