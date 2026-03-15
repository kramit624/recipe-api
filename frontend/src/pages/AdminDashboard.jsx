import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChefHat,
  AlertTriangle,
  RefreshCw,
    X,  
} from "lucide-react";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [rejectNote, setRejectNote] = useState({});
  const [processing, setProcessing] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const API_V2 = API.replace("/v1", "/v2");


  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.email !== adminEmail) {
      navigate("/");
      return;
    } // redirect non-admins
    fetchRecipes();
  }, [user, authLoading, filter]);


  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_V2}/user-recipe/admin?status=${filter}&limit=50`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (data.success) setRecipes(data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    setProcessing(id);
    try {
      await fetch(`${API_V2}/user-recipe/admin/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      setRecipes((r) => r.filter((x) => x._id !== id));
    } finally {
      setProcessing("");
    }
  };

  const reject = async (id) => {
    setProcessing(id);
    try {
      await fetch(`${API_V2}/user-recipe/admin/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note: rejectNote[id] || "" }),
      });
      setRecipes((r) => r.filter((x) => x._id !== id));
    } finally {
      setProcessing("");
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center relative z-[2]">
        <Loader2 size={28} className="animate-spin text-orange-400" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-[2]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black tracking-tight">
                Admin Dashboard
              </h1>
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-sm text-[#64748b]">
              Review and approve community recipes
            </p>
          </div>
          <button
            onClick={fetchRecipes}
            className="flex items-center gap-1.5 bg-[#141b2d] border border-[#1e2a42] hover:border-orange-500 text-[#64748b] hover:text-[#e2e8f0] px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 animate-fade-up delay-100">
          {["pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-[#0e1420] border border-[#1e2a42] text-[#64748b] hover:border-orange-500 hover:text-[#e2e8f0]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-orange-400" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-[#0e1420] border border-[#1e2a42] rounded-2xl">
            <ChefHat
              size={36}
              className="mx-auto mb-3 text-[#64748b] opacity-40"
            />
            <p className="text-sm text-[#64748b]">No {filter} recipes.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-up delay-200">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl overflow-hidden"
              >
                {/* Recipe header */}
                <div className="p-5 border-b border-[#1e2a42]">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-bold text-base mb-1">
                        {recipe.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-[#64748b]">
                        <span>{recipe.category}</span>
                        <span>·</span>
                        <span>{recipe.difficulty}</span>
                        <span>·</span>
                        <span>{recipe.cookingTime} min</span>
                        <span>·</span>
                        <span>{recipe.servings} servings</span>
                        {recipe.city && (
                          <>
                            <span>·</span>
                            <span>
                              {recipe.city}, {recipe.country}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#64748b] flex-shrink-0">
                      <p className="font-semibold text-[#e2e8f0]">
                        {recipe.submitterName}
                      </p>
                      <p>{recipe.submitterEmail}</p>
                      <p className="mt-0.5">
                        {new Date(recipe.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>

                  {recipe.description && (
                    <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  )}
                  {recipe.image && (
                    <div className="px-5 pb-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        onClick={() => setPreviewImage(recipe.image)}
                        className="w-full h-40 object-cover rounded-xl border border-[#1e2a42] cursor-pointer hover:opacity-90 hover:border-orange-500/50 transition-all duration-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <p className="text-[10px] text-[#64748b] mt-1.5 text-center">
                        Click image to preview
                      </p>
                    </div>
                  )}

                  {previewImage && (
                    <div
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] px-4"
                      onClick={() => setPreviewImage(null)}
                    >
                      <div
                        className="relative max-w-3xl w-full animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close button */}
                        <button
                          onClick={() => setPreviewImage(null)}
                          className="absolute -top-4 -right-4 w-9 h-9 bg-[#0e1420] border border-[#1e2a42] hover:border-red-500 hover:text-red-400 text-[#64748b] rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-xl"
                        >
                          <X size={16} />
                        </button>

                        {/* Image */}
                        <img
                          src={previewImage}
                          alt="Recipe preview"
                          className="w-full max-h-[80vh] object-contain rounded-2xl border border-[#1e2a42] shadow-2xl"
                        />

                        {/* Click outside hint */}
                        <p className="text-center text-xs text-[#64748b] mt-3">
                          Click outside to close
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ingredients & Steps preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2a42]">
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2">
                      Ingredients ({recipe.ingredients.length})
                    </p>
                    <ul className="space-y-1">
                      {recipe.ingredients.slice(0, 5).map((ing, i) => (
                        <li
                          key={i}
                          className="text-xs text-[#e2e8f0] flex items-center gap-1.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                      {recipe.ingredients.length > 5 && (
                        <li className="text-xs text-[#64748b]">
                          +{recipe.ingredients.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2">
                      Steps ({recipe.steps.length})
                    </p>
                    <ol className="space-y-1">
                      {recipe.steps.slice(0, 3).map((step, i) => (
                        <li
                          key={i}
                          className="text-xs text-[#e2e8f0] flex gap-2"
                        >
                          <span className="text-orange-400 font-bold flex-shrink-0">
                            {step.stepNumber}.
                          </span>
                          <span className="line-clamp-1">
                            {step.instruction}
                          </span>
                        </li>
                      ))}
                      {recipe.steps.length > 3 && (
                        <li className="text-xs text-[#64748b]">
                          +{recipe.steps.length - 3} more steps
                        </li>
                      )}
                    </ol>
                  </div>
                </div>

                {/* Admin actions — only for pending */}
                {filter === "pending" && (
                  <div className="p-4 border-t border-[#1e2a42] bg-[#080b12]">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Rejection reason (optional)..."
                        value={rejectNote[recipe._id] || ""}
                        onChange={(e) =>
                          setRejectNote((n) => ({
                            ...n,
                            [recipe._id]: e.target.value,
                          }))
                        }
                        className="flex-1 bg-[#0e1420] border border-[#1e2a42] focus:border-red-500 text-[#e2e8f0] placeholder-[#64748b] px-3 py-2 rounded-lg text-xs outline-none transition-all"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => reject(recipe._id)}
                          disabled={processing === recipe._id}
                          className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          {processing === recipe._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <XCircle size={12} />
                          )}
                          Reject
                        </button>
                        <button
                          onClick={() => approve(recipe._id)}
                          disabled={processing === recipe._id}
                          className="flex items-center gap-1.5 bg-green-400/10 hover:bg-green-400/20 border border-green-400/25 text-green-400 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          {processing === recipe._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle size={12} />
                          )}
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
