import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Clock, XCircle, ChefHat, Loader2 } from "lucide-react";

const statusConfig = {
  approved: {
    icon: <CheckCircle size={13} />,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    label: "Approved",
  },
  pending: {
    icon: <Clock size={13} />,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    label: "Pending Review",
  },
  rejected: {
    icon: <XCircle size={13} />,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    label: "Rejected",
  },
};

export default function MyRecipes() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyRecipes();
  }, [user, authLoading]);

  const fetchMyRecipes = async () => {
    try {
      const res = await fetch(`${API.replace("/v1", "/v2")}/user-recipe/my`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setRecipes(data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "all" ? recipes : recipes.filter((r) => r.status === filter);

  if (authLoading || loading)
    return (
      <div className="min-h-screen flex items-center justify-center relative z-[2]">
        <Loader2 size={28} className="animate-spin text-orange-400" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-[2]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="text-2xl font-black tracking-tight mb-1">
              My Recipes
            </h1>
            <p className="text-sm text-[#64748b]">
              Track all your submitted recipes
            </p>
          </div>
          <Link
            to="/submit-recipe"
            className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-px"
          >
            + Submit New
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 animate-fade-up delay-100">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-[#0e1420] border border-[#1e2a42] text-[#64748b] hover:text-[#e2e8f0] hover:border-orange-500"
              }`}
            >
              {f}{" "}
              {f === "all"
                ? `(${recipes.length})`
                : `(${recipes.filter((r) => r.status === f).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#0e1420] border border-[#1e2a42] rounded-2xl animate-fade-up delay-200">
            <ChefHat
              size={36}
              className="mx-auto mb-3 text-[#64748b] opacity-40"
            />
            <p className="text-sm text-[#64748b]">No recipes found.</p>
            <Link
              to="/submit-recipe"
              className="text-orange-400 text-sm font-semibold hover:text-orange-300 mt-2 inline-block transition-colors"
            >
              Submit your first recipe →
            </Link>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-up delay-200">
            {filtered.map((recipe) => {
              const s = statusConfig[recipe.status];
              return (
                <div
                  key={recipe._id}
                  className="bg-[#0e1420] border border-[#1e2a42] hover:border-orange-500/25 rounded-2xl p-5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-sm">{recipe.title}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.bg} ${s.color}`}
                        >
                          {s.icon} {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b]">
                        {recipe.category} · {recipe.difficulty} ·{" "}
                        {recipe.cookingTime} min · {recipe.servings} servings
                      </p>
                      {recipe.status === "rejected" && recipe.adminNote && (
                        <div className="mt-2 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2 text-xs text-red-400">
                          <span className="font-semibold">Reason: </span>
                          {recipe.adminNote}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-[#64748b]">
                        {new Date(recipe.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
