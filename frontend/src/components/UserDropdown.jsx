import { useState, useRef, useEffect } from "react";
import {
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  ChefHat,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const menuItems = [
    { icon: <User size={14} />, label: "Profile", path: "/profile" },
    {
      icon: <KeyRound size={14} />,
      label: "API Dashboard",
      path: "/api-dashboard",
    },
    { icon: <BarChart2 size={14} />, label: "Analytics", path: "/analytics" },
    { icon: <ChefHat size={14} />, label: "My Recipes", path: "/my-recipes" },
    ...(isAdmin
      ? [
          {
            icon: <ShieldCheck size={14} />,
            label: "Admin Dashboard",
            path: "/admin",
            admin: true,
          },
        ]
      : []),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#0e1420] border border-[#1e2a42] hover:border-orange-500 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-300 flex items-center justify-center">
          <User size={12} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="max-w-[80px] truncate">
          {user?.name?.split(" ")[0]}
        </span>
        <ChevronDown
          size={13}
          className={`text-[#64748b] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-56 bg-[#0e1420] border border-[#1e2a42] rounded-2xl overflow-hidden z-50 shadow-2xl animate-scale-in">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#1e2a42]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-300 flex items-center justify-center mb-2">
              <User size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-[#e2e8f0]">{user?.name}</p>
            <p className="text-xs text-[#64748b] mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {user?.tier || "free"} tier
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={9} strokeWidth={3} /> Admin
                </span>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  item.admin
                    ? "text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                    : "text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#141b2d]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-[#1e2a42]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all duration-150 text-left"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
