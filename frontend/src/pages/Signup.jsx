import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength =
    form.password.length >= 8
      ? "strong"
      : form.password.length >= 6
        ? "medium"
        : form.password.length > 0
          ? "weak"
          : "";
  const strengthColor = {
    strong: "bg-green-400",
    medium: "bg-yellow-400",
    weak: "bg-red-400",
  };
  const strengthText = {
    strong: "text-green-400",
    medium: "text-yellow-400",
    weak: "text-red-400",
  };
  const strengthLabel = {
    strong: "Strong password",
    medium: "Medium strength",
    weak: "Too short",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/api-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-8 relative z-[2]">
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <div className="w-full max-w-md bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-10 relative overflow-hidden animate-fade-up">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🍽️</div>
          <h1 className="text-2xl font-black tracking-tight mb-1">
            Create an account
          </h1>
          <p className="text-sm text-[#64748b]">
            Free forever. No credit card required.
          </p>
        </div>

        <div className="bg-green-400/5 border border-green-400/15 rounded-xl px-4 py-3 mb-6 space-y-2">
          {[
            "Free API key on signup",
            "10 requests / minute",
            "600+ recipes access",
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-green-400"
            >
              <Check size={12} strokeWidth={3} />
              {p}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Amit Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-[#0e1420] border border-[#1e2a42] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-[#e2e8f0] placeholder-[#64748b] px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-[#0e1420] border border-[#1e2a42] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-[#e2e8f0] placeholder-[#64748b] px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-[#0e1420] border border-[#1e2a42] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-[#e2e8f0] placeholder-[#64748b] px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#e2e8f0] transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {["weak", "medium", "strong"].map((s, i) => (
                    <div
                      key={s}
                      className={`flex-1 h-0.5 rounded transition-all duration-300 ${
                        (strength === "weak" && i === 0) ||
                        (strength === "medium" && i <= 1) ||
                        strength === "strong"
                          ? strengthColor[strength]
                          : "bg-[#1e2a42]"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs ${strengthText[strength]}`}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-70 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Creating
                account...
              </>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
