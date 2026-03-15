import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
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
            Welcome back
          </h1>
          <p className="text-sm text-[#64748b]">
            Sign in to your RecipeAPI account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-70 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
