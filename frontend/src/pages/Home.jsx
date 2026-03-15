import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap, Shield, Code2, Globe, ChefHat, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const EXAMPLE = `{
  "success": true,
  "recipes": [
    {
      "title": "Hyderabadi Chicken Biryani",
      "slug": "hyderabadi-chicken-biryani",
      "baseDish": "biryani",
      "category": "Dinner",
      "festival": "Eid",
      "cuisine": "Indian",
      "city": "Hyderabad",
      "difficulty": "Medium",
      "cookingTime": 60,
      "servings": 4
    }
  ],
  "pagination": {
    "total": 600, "page": 1,
    "limit": 20, "totalPages": 30
  }
}`;

const features = [
  {
    icon: <Zap size={18} />,
    title: "Lightning Fast",
    desc: "Optimized MongoDB queries with proper indexing. Paginated responses keep payloads small.",
  },
  {
    icon: <Shield size={18} />,
    title: "Secure by Default",
    desc: "SHA-256 hashed API keys. HTTP-only cookies. Rate limiting per key.",
  },
  {
    icon: <Code2 size={18} />,
    title: "Developer First",
    desc: "RESTful design, consistent JSON responses, clear error codes and rate limit headers.",
  },
  {
    icon: <Globe size={18} />,
    title: "Rich Filters",
    desc: "Filter by cuisine, category, festival, country, and city. Full-text search included.",
  },
  {
    icon: <ChefHat size={18} />,
    title: "600+ Recipes",
    desc: "AI-generated Indian recipes spanning 9 categories and 8 major festivals.",
  },
  {
    icon: <Star size={18} />,
    title: "Free Forever",
    desc: "10 requests per minute on free tier. No credit card. No expiry.",
  },
];

const endpoints = [
  { method: "GET", path: "/recipes", desc: "All recipes paginated" },
  {
    method: "GET",
    path: "/recipes/search?q=biryani",
    desc: "Full-text search",
  },
  { method: "GET", path: "/recipes/random?count=5", desc: "Random recipes" },
  {
    method: "GET",
    path: "/recipes/category/Dinner",
    desc: "Filter by category",
  },
  {
    method: "GET",
    path: "/recipes/festival/Diwali",
    desc: "Filter by festival",
  },
  {
    method: "GET",
    path: "/recipes/country/India/cities",
    desc: "Get all cities",
  },
];

export default function Home() {
  const orb1 = useRef(null);
  const orb2 = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.005;
      if (orb1.current)
        orb1.current.style.transform = `translate(${Math.sin(t) * 30}px, ${Math.cos(t) * 20}px)`;
      if (orb2.current)
        orb2.current.style.transform = `translate(${Math.cos(t) * 25}px, ${Math.sin(t) * 15}px)`;
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative z-[2]">
      <div
        ref={orb1}
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -top-36 -right-36"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        ref={orb2}
        className="fixed w-80 h-80 rounded-full pointer-events-none z-0 -left-24"
        style={{
          background:
            "radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)",
          bottom: "20%",
        }}
      />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 relative z-[2]">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]" />
          v1.0 — Free Tier Available
        </div>

        <h1 className="animate-fade-up delay-100 font-black leading-[1.05] tracking-[-3px] mb-6 max-w-2xl text-[clamp(2.8rem,6vw,5rem)]">
          The <span className="text-gradient">Recipe API</span>
          <br />
          built for developers.
        </h1>

        <p className="animate-fade-up delay-200 text-base text-[#64748b] max-w-lg leading-relaxed mb-10">
          600+ AI-generated Indian recipes. Filter by festival, city, category,
          and cuisine. One API key. Zero setup. Free forever.
        </p>

        <div className="animate-fade-up delay-300 flex gap-3 flex-wrap justify-center">
          <Link
            to={user ? "/api-dashboard" : "/signup"}
            className="text-white bg-orange-500 hover:bg-orange-400 font-semibold px-7 py-3 rounded-xl text-sm transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30"
          >
            {user ? "Go to Dashboard →" : "Get API Key →"}
          </Link>
          <Link
            to="/docs"
            className="text-[#64748b] hover:text-[#e2e8f0] border border-[#1e2a42] hover:border-orange-500 font-semibold px-7 py-3 rounded-xl text-sm transition-all"
          >
            View Docs
          </Link>
        </div>

        <div className="animate-fade-up delay-400 flex gap-10 mt-16 flex-wrap justify-center">
          {[
            { n: "600+", l: "Recipes" },
            { n: "11", l: "Endpoints" },
            { n: "10/min", l: "Free Rate Limit" },
            { n: "0ms", l: "Setup Time" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-black tracking-[-1px]">{s.n}</p>
              <p className="text-xs text-[#64748b] font-medium mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section className="py-16 px-4 relative z-[2]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
              Quick Start
            </p>
            <h2 className="font-black tracking-tight text-[clamp(1.8rem,3vw,2.5rem)]">
              Up and running in 30 seconds
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#0a0f1a] border border-[#1e2a42] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#141b2d] border-b border-[#1e2a42]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                  Request
                </span>
                <div className="flex gap-1.5">
                  {["#f87171", "#fbbf24", "#4ade80"].map((c) => (
                    <div
                      key={c}
                      className="w-2.5 h-2.5 rounded-full opacity-70"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <pre className="p-6 font-mono text-xs text-[#94a3b8] leading-relaxed overflow-x-auto">{`fetch("https://api.recipeapi.dev/api/v1/recipes", {
  headers: {
    "x-api-key": "ra_your_key_here"
  }
})`}</pre>
            </div>
            <div className="bg-[#0a0f1a] border border-[#1e2a42] rounded-2xl overflow-hidden max-h-72">
              <div className="flex items-center justify-between px-4 py-3 bg-[#141b2d] border-b border-[#1e2a42]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
                  200 OK
                </span>
                <span className="text-[10px] text-[#64748b]">
                  application/json
                </span>
              </div>
              <pre className="p-6 font-mono text-xs text-[#94a3b8] leading-relaxed overflow-auto max-h-56">
                {EXAMPLE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 px-4 relative z-[2]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-black tracking-tight mb-3 text-[clamp(1.8rem,3vw,2.5rem)]">
              Everything you need
            </h2>
            <p className="text-sm text-[#64748b]">
              11 endpoints covering every use case
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="bg-[#0e1420] border border-[#1e2a42] hover:border-orange-500/30 rounded-xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="bg-green-400/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0">
                  {ep.method}
                </span>
                <div>
                  <code className="text-xs text-[#e2e8f0] font-mono block">
                    {ep.path}
                  </code>
                  <span className="text-[10px] text-[#64748b]">{ep.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/docs"
              className="text-orange-400 hover:text-orange-300 text-sm font-semibold inline-flex items-center gap-1.5 transition-all group"
            >
              View full documentation{" "}
              <span className="group-hover:translate-x-1 transition-transform inline-block">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 relative z-[2]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-black tracking-tight text-[clamp(1.8rem,3vw,2.5rem)]">
              Why RecipeAPI?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#0e1420] border border-[#1e2a42] hover:border-orange-500/25 rounded-2xl p-6 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(249,115,22,0.06)]"
              >
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-4">
                  {f.icon}
                </div>
                <p className="font-bold text-sm mb-2">{f.title}</p>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative z-[2]">
        <div className="max-w-2xl mx-auto text-center bg-[#0e1420] border border-[#1e2a42] rounded-2xl px-8 py-14 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 60%)",
            }}
          />
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="font-black tracking-tight mb-3 text-[clamp(1.6rem,3vw,2.2rem)]">
            Start building today
          </h2>
          <p className="text-sm text-[#64748b] mb-8 leading-relaxed">
            Free forever. No credit card required. Get your API key in 30
            seconds.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to={user ? "/api-dashboard" : "/signup"}
              className="text-white bg-orange-500 hover:bg-orange-400 font-semibold px-8 py-3 rounded-xl text-sm transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30"
            >
              Get Started Free →
            </Link>
            <Link
              to="/docs"
              className="text-[#64748b] hover:text-[#e2e8f0] border border-[#1e2a42] hover:border-orange-500 font-semibold px-8 py-3 rounded-xl text-sm transition-all"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
