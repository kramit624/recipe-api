import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Lunch/Dinner",
  "Street Food",
  "Dessert",
  "Festival",
  "Healthy",
];
const FESTIVALS = [
  "None",
  "Diwali",
  "Holi",
  "Eid",
  "Navratri",
  "Christmas",
  "Ramadan",
  "Pongal",
  "Baisakhi",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function NotRegisteredPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
      <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-8 max-w-sm w-full relative animate-scale-in">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-t-2xl" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748b] hover:text-[#e2e8f0] transition-colors"
        >
          <X size={16} />
        </button>
        <div className="text-3xl mb-4">🍽️</div>
        <h3 className="text-lg font-black tracking-tight mb-2">
          Account Required
        </h3>
        <p className="text-sm text-[#64748b] leading-relaxed mb-6">
          You need a RecipeAPI account to submit recipes. Create a free account
          to get started.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#1e2a42] hover:border-orange-500 text-[#64748b] hover:text-[#e2e8f0] py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            OK
          </button>
          <Link
            to="/signup"
            className="flex-1 text-center bg-orange-500 hover:bg-orange-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            Sign Up →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubmitRecipe() {
  const { user } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const API_KEY = localStorage.getItem("userApiKey") || "";

  const [form, setForm] = useState({
    submitterEmail: user?.email || "",
    submitterName: user?.name || "",
    title: "",
    baseDish: "",
    description: "",
    category: "",
    festival: "None",
    country: "India",
    city: "",
    cuisine: "Indian",
    cookingTime: "",
    servings: "",
    difficulty: "Medium",
    tags: "",
    image: "",
    ingredients: [""],
    steps: [{ stepNumber: 1, instruction: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const addIngredient = () => set("ingredients", [...form.ingredients, ""]);
  const removeIngredient = (i) =>
    set(
      "ingredients",
      form.ingredients.filter((_, idx) => idx !== i),
    );
  const updateIngredient = (i, val) => {
    const updated = [...form.ingredients];
    updated[i] = val;
    set("ingredients", updated);
  };

  const addStep = () =>
    set("steps", [
      ...form.steps,
      { stepNumber: form.steps.length + 1, instruction: "" },
    ]);
  const removeStep = (i) => {
    const updated = form.steps
      .filter((_, idx) => idx !== i)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    set("steps", updated);
  };
  const updateStep = (i, val) => {
    const updated = [...form.steps];
    updated[i] = { ...updated[i], instruction: val };
    set("steps", updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const key = apiKeyInput || API_KEY;
    if (!key) {
      setError("API key is required to submit a recipe.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/v2/user-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          cookingTime: Number(form.cookingTime),
          servings: Number(form.servings),
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          ingredients: form.ingredients.filter(Boolean),
          steps: form.steps.filter((s) => s.instruction.trim()),
        }),
      });

      const data = await res.json();

      if (data.error === "NOT_REGISTERED") {
        setShowPopup(true);
        return;
      }

      if (!data.success) throw new Error(data.error);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-[2]">
        <div className="text-center bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-10 max-w-md w-full">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-black tracking-tight mb-2">
            Recipe Submitted!
          </h2>
          <p className="text-sm text-[#64748b] leading-relaxed mb-6">
            Your recipe is now pending review. We'll approve it shortly. Check
            your submission history to track its status.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/my-recipes"
              className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              View My Recipes
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setForm((f) => ({
                  ...f,
                  title: "",
                  baseDish: "",
                  description: "",
                  ingredients: [""],
                  steps: [{ stepNumber: 1, instruction: "" }],
                }));
              }}
              className="border border-[#1e2a42] hover:border-orange-500 text-[#64748b] hover:text-[#e2e8f0] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-[2]">
      {showPopup && <NotRegisteredPopup onClose={() => setShowPopup(false)} />}

      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-black tracking-tight mb-1">
            Submit a Recipe
          </h1>
          <p className="text-sm text-[#64748b]">
            Share your recipe with the community. Reviewed and approved by our
            team.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
            <AlertTriangle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key — if not stored */}
          <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-5">
            <p className="font-bold text-sm mb-1">Your API Key</p>
            <p className="text-xs text-[#64748b] mb-3">
              Required to submit.{" "}
              <Link
                to="/api-dashboard"
                className="text-orange-400 hover:text-orange-300"
              >
                Get yours here.
              </Link>
            </p>
            <input
              type="text"
              placeholder="ra_your_api_key_here"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-[#e2e8f0] placeholder-[#64748b] px-4 py-3 rounded-xl text-sm outline-none transition-all font-mono"
            />
          </div>

          {/* Submitter info */}
          <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-5 space-y-4">
            <p className="font-bold text-sm border-b border-[#1e2a42] pb-3">
              Your Info
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Amit Kumar"
                  value={form.submitterName}
                  onChange={(e) => set("submitterName", e.target.value)}
                  required
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.submitterEmail}
                  onChange={(e) => set("submitterEmail", e.target.value)}
                  required
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-5 space-y-4">
            <p className="font-bold text-sm border-b border-[#1e2a42] pb-3">
              Recipe Info
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Recipe Title
                </label>
                <input
                  type="text"
                  placeholder="Hyderabadi Chicken Biryani"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Base Dish
                </label>
                <input
                  type="text"
                  placeholder="biryani"
                  value={form.baseDish}
                  onChange={(e) => set("baseDish", e.target.value)}
                  required
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                Description
              </label>
              <textarea
                placeholder="A brief description of your recipe..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) => set("difficulty", e.target.value)}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Festival
                </label>
                <select
                  value={form.festival}
                  onChange={(e) => set("festival", e.target.value)}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                >
                  {FESTIVALS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Cook Time (min)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={form.cookingTime}
                  onChange={(e) => set("cookingTime", e.target.value)}
                  required
                  min={1}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Servings
                </label>
                <input
                  type="number"
                  placeholder="4"
                  value={form.servings}
                  onChange={(e) => set("servings", e.target.value)}
                  required
                  min={1}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Hyderabad"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="India"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Cuisine
                </label>
                <input
                  type="text"
                  placeholder="Indian"
                  value={form.cuisine}
                  onChange={(e) => set("cuisine", e.target.value)}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="spicy, rice, chicken"
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                className="w-full bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-[#1e2a42] pb-3">
              <p className="font-bold text-sm">Ingredients</p>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-500/20 transition-all"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ingredient ${i + 1}`}
                    value={ing}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                    className="flex-1 bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  />
                  {form.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="text-[#64748b] hover:text-red-400 transition-colors p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-[#1e2a42] pb-3">
              <p className="font-bold text-sm">Steps</p>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-500/20 transition-all"
              >
                <Plus size={12} /> Add Step
              </button>
            </div>
            <div className="space-y-3">
              {form.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-2.5">
                    {step.stepNumber}
                  </div>
                  <textarea
                    placeholder={`Step ${step.stepNumber} instruction...`}
                    value={step.instruction}
                    onChange={(e) => updateStep(i, e.target.value)}
                    rows={2}
                    className="flex-1 bg-[#080b12] border border-[#1e2a42] focus:border-orange-500 text-[#e2e8f0] placeholder-[#64748b] px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
                  />
                  {form.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="text-[#64748b] hover:text-red-400 transition-colors p-2 mt-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl text-sm transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Recipe →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
