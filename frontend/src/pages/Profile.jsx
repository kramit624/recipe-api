import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center relative z-[2]">
        <div className="text-center">
          <div className="text-3xl mb-4">🔒</div>
          <p className="text-[#64748b] mb-4">You need to be logged in.</p>
          <button
            className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );

  const handleDelete = async () => {
    if (deleteInput !== user.email) {
      setError("Email doesn't match.");
      return;
    }
    setLoading(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-[2]">
      <div className="max-w-xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-black tracking-tight mb-1">Profile</h1>
          <p className="text-sm text-[#64748b]">Manage your account details</p>
        </div>

        <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-6 mb-3 flex items-center gap-5 flex-wrap animate-fade-up delay-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-300 flex items-center justify-center flex-shrink-0">
            <User size={28} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">{user.name}</p>
            <p className="text-sm text-[#64748b]">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Shield size={9} strokeWidth={3} /> {user.tier || "free"} tier
            </span>
          </div>
        </div>

        <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl overflow-hidden mb-3 animate-fade-up delay-200">
          <div className="px-5 py-4 border-b border-[#1e2a42]">
            <p className="font-bold text-sm">Account Details</p>
          </div>
          <div className="p-2">
            {[
              {
                icon: <User size={14} />,
                label: "Full Name",
                value: user.name,
              },
              {
                icon: <Mail size={14} />,
                label: "Email Address",
                value: user.email,
              },
              {
                icon: <Calendar size={14} />,
                label: "Member Since",
                value: joined,
              },
              {
                icon: <Shield size={14} />,
                label: "Account Tier",
                value:
                  (user.tier || "free").charAt(0).toUpperCase() +
                  (user.tier || "free").slice(1),
              },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#141b2d] transition-colors duration-150"
              >
                <div className="text-[#64748b] flex-shrink-0">{row.icon}</div>
                <div>
                  <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest mb-0.5">
                    {row.label}
                  </p>
                  <p className="text-sm font-medium">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-500/[0.04] border border-red-500/15 rounded-2xl overflow-hidden animate-fade-up delay-300">
          <div className="px-5 py-4 border-b border-red-500/15 flex items-center gap-2 text-red-400">
            <AlertTriangle size={15} />
            <p className="font-bold text-sm">Danger Zone</p>
          </div>
          <div className="p-5">
            {!confirmDelete ? (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-sm mb-1">Delete Account</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    Permanently delete your account and API key. Cannot be
                    undone.
                  </p>
                </div>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0"
                >
                  <Trash2 size={13} /> Delete Account
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-red-400 font-semibold mb-3">
                  ⚠️ Type your email to confirm:
                </p>
                <input
                  type="email"
                  placeholder={user.email}
                  value={deleteInput}
                  onChange={(e) => {
                    setDeleteInput(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-[#080b12] border border-red-500/30 focus:border-red-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-3 rounded-xl text-sm outline-none transition-all mb-3"
                />
                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setConfirmDelete(false);
                      setDeleteInput("");
                      setError("");
                    }}
                    className="flex-1 border border-[#1e2a42] hover:border-orange-500 text-[#64748b] hover:text-[#e2e8f0] py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    {loading ? "Deleting..." : "Delete My Account"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
