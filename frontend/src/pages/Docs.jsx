import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, CheckCircle, ChevronDown } from "lucide-react";
import Footer from "../components/Footer";

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${copied ? "text-green-400" : "text-[#64748b] hover:text-orange-400"}`}
    >
      {copied ? (
        <><CheckCircle size={11} /> Copied</>
      ) : (
        <><Copy size={11} /> Copy</>
      )}
    </button>
  );
}

function CodeBlock({ lang, code }) {
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a42] rounded-xl overflow-hidden mt-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#141b2d] border-b border-[#1e2a42]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
          {lang}
        </span>
        <CopyBtn text={code} />
      </div>
      <pre className="px-5 py-4 text-xs text-[#94a3b8] font-mono leading-relaxed overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}

function Badge({ method }) {
  const styles = {
    GET: "bg-green-400/10 text-green-400",
    POST: "bg-blue-400/10 text-blue-400",
    DELETE: "bg-red-400/10 text-red-400",
    PATCH: "bg-yellow-400/10 text-yellow-400",
  };
  return (
    <span
      className={`${styles[method] || styles.GET} text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0`}
    >
      {method}
    </span>
  );
}

function ParamTable({ rows }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {["Param", "Type", "Required", "Description"].map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 bg-[#141b2d] text-[#64748b] text-[10px] font-bold uppercase tracking-widest"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="px-3 py-2.5 border-b border-[#1e2a42]">
                <code className="text-orange-300 bg-orange-500/5 px-1.5 py-0.5 rounded font-mono">
                  {r.name}
                </code>
              </td>
              <td className="px-3 py-2.5 border-b border-[#1e2a42] text-[#64748b]">
                {r.type}
              </td>
              <td className="px-3 py-2.5 border-b border-[#1e2a42]">
                <span
                  className={`text-[10px] font-semibold ${r.required ? "text-red-400" : "text-[#64748b]"}`}
                >
                  {r.required ? "required" : "optional"}
                </span>
              </td>
              <td className="px-3 py-2.5 border-b border-[#1e2a42] text-[#64748b]">
                {r.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Endpoint({ method, path, desc, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#0e1420] border border-[#1e2a42] hover:border-orange-500/25 rounded-2xl mb-3 overflow-hidden transition-colors duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left bg-transparent border-none"
      >
        <Badge method={method} />
        <code className="font-mono text-sm text-[#e2e8f0] flex-1">{path}</code>
        <span className="text-xs text-[#64748b] hidden sm:block mr-2">
          {desc}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#64748b] transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-[#1e2a42] px-5 py-5">{children}</div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-1 h-6 bg-orange-500 rounded flex-shrink-0" />
      <h2 className="text-xl font-black tracking-tight">{children}</h2>
    </div>
  );
}

const BASE = "https://api.recipeapi.dev/api/v1";
const BASE_V2 = "https://api.recipeapi.dev/api/v2";

const sidebar = [
  {
    label: "Getting Started",
    links: [
      { href: "#overview", label: "Overview" },
      { href: "#authentication", label: "Authentication" },
      { href: "#rate-limits", label: "Rate Limits" },
      { href: "#errors", label: "Error Codes" },
    ],
  },
  {
    label: "Recipe Endpoints",
    links: [
      { href: "#get-all", label: "All Recipes", method: "GET" },
      { href: "#search", label: "Search", method: "GET" },
      { href: "#random", label: "Random", method: "GET" },
      { href: "#by-id", label: "By ID", method: "GET" },
      { href: "#by-slug", label: "By Slug", method: "GET" },
      { href: "#by-base", label: "By Base Dish", method: "GET" },
      { href: "#by-category", label: "By Category", method: "GET" },
      { href: "#by-festival", label: "By Festival", method: "GET" },
      { href: "#by-country", label: "By Country", method: "GET" },
      { href: "#cities", label: "Cities by Country", method: "GET" },
      { href: "#by-city", label: "By City", method: "GET" },
    ],
  },
  {
    label: "Auth Endpoints",
    links: [
      { href: "#auth-register", label: "Register", method: "POST" },
      { href: "#auth-login", label: "Login", method: "POST" },
      { href: "#auth-refresh", label: "Refresh Token", method: "POST" },
      { href: "#auth-logout", label: "Logout", method: "POST" },
      { href: "#auth-me", label: "Get Me", method: "GET" },
      { href: "#create-key", label: "Create API Key", method: "POST" },
      { href: "#regen-key", label: "Regenerate Key", method: "POST" },
      { href: "#delete-account", label: "Delete Account", method: "DELETE" },
    ],
  },
  {
    label: "User Recipe API v2",
    links: [
      { href: "#v2-overview", label: "Overview" },
      { href: "#v2-submit", label: "Submit Recipe", method: "POST" },
      { href: "#v2-approved", label: "Approved Recipes", method: "GET" },
      { href: "#v2-my", label: "My Recipes", method: "GET" },
    ],
  },
];

export default function Docs() {
  return (
    <div className="relative z-[2]">
      <div className="flex min-h-screen pt-16">

        {/* Sidebar */}
        <aside
  className="hidden lg:block w-60 min-w-[240px] h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-[#1e2a42] py-8 bg-[#080b12]"
  style={{ scrollbarWidth: "none" }}
>
  {sidebar.map((s) => (
    <div key={s.label} className="mb-7 px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2.5">
        {s.label}
      </p>
      {s.links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#0e1420] text-xs font-medium mb-0.5 transition-all duration-150"
        >
          {l.method && <Badge method={l.method} />}
          {l.label}
        </a>
      ))}
    </div>
  ))}
</aside>

        {/* Main */}
        <main className="flex-1 px-6 lg:px-12 py-12 max-w-3xl">

          {/* ── Overview ── */}
          <section id="overview" className="mb-16">
            <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> v1.0 — Free Tier
            </span>
            <h1 className="font-black tracking-[-2px] mb-4 leading-tight text-[clamp(2rem,4vw,3rem)]">
              API <span className="text-gradient">Reference</span>
            </h1>
            <p className="text-sm text-[#64748b] leading-relaxed max-w-lg mb-8">
              Complete reference for RecipeAPI. All endpoints return JSON. Auth via API key header.
            </p>
            <div className="bg-[#0e1420] border border-[#1e2a42] rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1">
                  Base URL
                </p>
                <code className="font-mono text-sm text-orange-300">{BASE}</code>
              </div>
              <CopyBtn text={BASE} />
            </div>
            <div className="flex gap-8 flex-wrap">
              {[
                { n: "600+", l: "Recipes" },
                { n: "11", l: "Endpoints" },
                { n: "10/min", l: "Free Limit" },
                { n: "REST", l: "Protocol" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-black tracking-tight">{s.n}</p>
                  <p className="text-xs text-[#64748b] font-medium">{s.l}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Authentication ── */}
          <section id="authentication" className="mb-16">
            <SectionTitle>Authentication</SectionTitle>
            <p className="text-sm text-[#64748b] leading-relaxed mb-5">
              All recipe endpoints require{" "}
              <code className="text-orange-300 font-mono bg-orange-500/5 px-1.5 py-0.5 rounded">
                x-api-key
              </code>{" "}
              header. Auth endpoints use HTTP-only cookies.
            </p>
            <div className="bg-[#0e1420] border-l-[3px] border-l-orange-500 border border-[#1e2a42] rounded-xl p-5 mb-5">
              <p className="text-sm font-bold text-orange-400 mb-1.5">
                🔑 API Key Header
              </p>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Generate from{" "}
                <Link to="/api-dashboard" className="text-orange-400 font-semibold hover:text-orange-300">
                  API Dashboard
                </Link>
                . Shown once — store safely. Keys are SHA-256 hashed.
              </p>
            </div>
            <CodeBlock lang="cURL" code={`curl ${BASE}/recipes \\\n  -H "x-api-key: ra_your_api_key_here"`} />
            <CodeBlock lang="JavaScript" code={`const res = await fetch("${BASE}/recipes", {\n  headers: { "x-api-key": "ra_your_key_here" }\n});\nconst data = await res.json();`} />
            <CodeBlock lang="Python" code={`import requests\nr = requests.get("${BASE}/recipes",\n  headers={"x-api-key": "ra_your_key_here"})\ndata = r.json()`} />
          </section>

          {/* ── Rate Limits ── */}
          <section id="rate-limits" className="mb-16">
            <SectionTitle>Rate Limits</SectionTitle>
            <div className="bg-[#0e1420] border border-[#1e2a42] rounded-xl p-5 flex gap-6 flex-wrap items-center mb-5">
              {[
                { n: "10", l: "Requests / 60s" },
                { n: "Free", l: "Current Tier" },
              ].map((s) => (
                <div key={s.l} className="text-center min-w-[80px]">
                  <p className="text-3xl font-black tracking-tight text-orange-400">{s.n}</p>
                  <p className="text-xs text-[#64748b] font-medium">{s.l}</p>
                </div>
              ))}
              <div className="w-px h-12 bg-[#1e2a42]" />
              <p className="text-xs text-[#64748b] leading-relaxed flex-1 min-w-[180px]">
                Exceeding returns <code className="text-red-400 font-mono">429</code>. Check{" "}
                <code className="text-orange-300 font-mono">X-RateLimit-Reset</code> for seconds until reset.
              </p>
            </div>
            <CodeBlock lang="Response Headers" code={`X-RateLimit-Limit: 10\nX-RateLimit-Remaining: 7\nX-RateLimit-Reset: 43`} />
          </section>

          {/* ── Error Codes ── */}
          <section id="errors" className="mb-16">
            <SectionTitle>Error Codes</SectionTitle>
            <CodeBlock lang="Error Shape" code={`{\n  "success": false,\n  "error": "Human readable message"\n}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {[
                { code: "400", name: "Bad Request", desc: "Missing or invalid parameters.", color: "text-blue-400" },
                { code: "401", name: "Unauthorized", desc: "Missing or invalid API key / token.", color: "text-red-400" },
                { code: "403", name: "Forbidden", desc: "Account disabled or no access.", color: "text-purple-400" },
                { code: "404", name: "Not Found", desc: "Recipe or resource does not exist.", color: "text-orange-400" },
                { code: "429", name: "Too Many Requests", desc: "Rate limit exceeded.", color: "text-green-400" },
                { code: "500", name: "Server Error", desc: "Something went wrong on our end.", color: "text-[#64748b]" },
              ].map((e) => (
                <div key={e.code} className="bg-[#0e1420] border border-[#1e2a42] rounded-xl p-4">
                  <p className={`text-2xl font-black tracking-tight ${e.color} mb-0.5`}>{e.code}</p>
                  <p className="text-xs font-bold mb-1">{e.name}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recipe Endpoints ── */}
          <section className="mb-16">
            <SectionTitle>Recipe Endpoints</SectionTitle>
            <p className="text-sm text-[#64748b] mb-5">
              All require{" "}
              <code className="text-orange-300 font-mono bg-orange-500/5 px-1.5 py-0.5 rounded">x-api-key</code>{" "}
              header.
            </p>

            <div id="get-all">
              <Endpoint method="GET" path="/recipes" desc="All recipes paginated">
                <ParamTable rows={[
                  { name: "page", type: "number", required: false, desc: "Page number (default: 1)" },
                  { name: "limit", type: "number", required: false, desc: "Per page (default: 20)" },
                ]} />
                <CodeBlock lang="Response" code={`{\n  "success": true,\n  "recipes": [ ... ],\n  "pagination": { "total": 600, "page": 1, "limit": 20, "totalPages": 30 }\n}`} />
              </Endpoint>
            </div>

            <div id="search">
              <Endpoint method="GET" path="/recipes/search" desc="Full-text search">
                <ParamTable rows={[
                  { name: "q", type: "string", required: true, desc: "Search query" },
                  { name: "page", type: "number", required: false, desc: "" },
                  { name: "limit", type: "number", required: false, desc: "" },
                ]} />
                <CodeBlock lang="Example" code="GET /recipes/search?q=biryani&page=1&limit=10" />
              </Endpoint>
            </div>

            <div id="random">
              <Endpoint method="GET" path="/recipes/random" desc="Random recipes">
                <ParamTable rows={[
                  { name: "count", type: "number", required: false, desc: "Count (default: 5, max: 20)" },
                ]} />
                <CodeBlock lang="Example" code="GET /recipes/random?count=3" />
              </Endpoint>
            </div>

            <div id="by-id">
              <Endpoint method="GET" path="/recipes/:id" desc="By MongoDB ID">
                <ParamTable rows={[
                  { name: "id", type: "string", required: true, desc: "MongoDB ObjectId" },
                ]} />
                <CodeBlock lang="Example" code="GET /recipes/64f1a2b3c4d5e6f7a8b9c0d1" />
              </Endpoint>
            </div>

            <div id="by-slug">
              <Endpoint method="GET" path="/recipes/slug/:slug" desc="By slug">
                <CodeBlock lang="Example" code="GET /recipes/slug/hyderabadi-chicken-biryani" />
              </Endpoint>
            </div>

            <div id="by-base">
              <Endpoint method="GET" path="/recipes/base/:dish" desc="All variants of a base dish">
                <CodeBlock lang="Example" code="GET /recipes/base/biryani" />
              </Endpoint>
            </div>

            <div id="by-category">
              <Endpoint method="GET" path="/recipes/category/:category" desc="Filter by category">
                <p className="text-xs text-[#64748b] mb-3">
                  Valid: Breakfast | Lunch | Dinner | Snack | Lunch/Dinner | Street Food | Dessert | Festival | Healthy
                </p>
                <CodeBlock lang="Example" code="GET /recipes/category/Dinner?page=1&limit=10" />
              </Endpoint>
            </div>

            <div id="by-festival">
              <Endpoint method="GET" path="/recipes/festival/:festival" desc="Filter by festival">
                <p className="text-xs text-[#64748b] mb-3">
                  Valid: Diwali | Holi | Eid | Navratri | Christmas | Ramadan | Pongal | Baisakhi | None
                </p>
                <CodeBlock lang="Example" code="GET /recipes/festival/Diwali" />
              </Endpoint>
            </div>

            <div id="by-country">
              <Endpoint method="GET" path="/recipes/country/:country" desc="Filter by country">
                <CodeBlock lang="Example" code="GET /recipes/country/India?page=1&limit=20" />
              </Endpoint>
            </div>

            <div id="cities">
              <Endpoint method="GET" path="/recipes/country/:country/cities" desc="All cities in a country">
                <CodeBlock lang="Response" code={`{ "success": true, "country": "India", "cities": ["Delhi", "Mumbai", "Hyderabad"] }`} />
              </Endpoint>
            </div>

            <div id="by-city">
              <Endpoint method="GET" path="/recipes/country/:country/city?q=" desc="By city">
                <ParamTable rows={[
                  { name: "q", type: "string", required: true, desc: "City name" },
                  { name: "page", type: "number", required: false, desc: "" },
                ]} />
                <CodeBlock lang="Example" code="GET /recipes/country/India/city?q=Delhi" />
              </Endpoint>
            </div>
          </section>

          {/* ── Auth Endpoints ── */}
          <section className="mb-16">
            <SectionTitle>Auth Endpoints</SectionTitle>
            <p className="text-sm text-[#64748b] mb-5">
              Tokens in HTTP-only cookies. No token in response body.
            </p>

            <div id="auth-register">
              <Endpoint method="POST" path="/auth/register" desc="Create account">
                <ParamTable rows={[
                  { name: "name", type: "string", required: true, desc: "" },
                  { name: "email", type: "string", required: true, desc: "" },
                  { name: "password", type: "string", required: true, desc: "Min 6 chars" },
                ]} />
                <CodeBlock lang="Response" code={`{ "success": true, "user": { "id": "...", "name": "Amit", "email": "...", "tier": "free" } }\n// tokens set in httpOnly cookies`} />
              </Endpoint>
            </div>

            <div id="auth-login">
              <Endpoint method="POST" path="/auth/login" desc="Login">
                <ParamTable rows={[
                  { name: "email", type: "string", required: true, desc: "" },
                  { name: "password", type: "string", required: true, desc: "" },
                ]} />
                <CodeBlock lang="Response" code={`{ "success": true, "user": { ... } }\n// tokens set in cookies`} />
              </Endpoint>
            </div>

            <div id="auth-refresh">
              <Endpoint method="POST" path="/auth/refresh" desc="Refresh tokens via cookie">
                <p className="text-xs text-[#64748b] mb-3">
                  No body needed. Reads refreshToken cookie, rotates both tokens.
                </p>
                <CodeBlock lang="Response" code={`{ "success": true, "message": "Tokens refreshed" }`} />
              </Endpoint>
            </div>

            <div id="auth-logout">
              <Endpoint method="POST" path="/auth/logout" desc="Logout">
                <p className="text-xs text-[#64748b]">
                  Clears refreshToken from DB and removes both cookies.
                </p>
              </Endpoint>
            </div>

            <div id="auth-me">
              <Endpoint method="GET" path="/auth/me" desc="Get current user">
                <CodeBlock lang="Response" code={`{ "success": true, "user": { "_id": "...", "name": "Amit", "email": "...", "tier": "free" } }`} />
              </Endpoint>
            </div>

            <div id="create-key">
              <Endpoint method="POST" path="/auth/create-api-key" desc="Generate API key — shown once">
                <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-lg px-3 py-2.5 text-yellow-400 text-xs mb-3">
                  ⚠️ Key shown only once. Store immediately.
                </div>
                <CodeBlock lang="Response" code={`{ "success": true, "message": "Store this key safely...", "apiKey": "ra_3f9a1c2b..." }`} />
              </Endpoint>
            </div>

            <div id="regen-key">
              <Endpoint method="POST" path="/auth/regenerate-key" desc="Regenerate API key">
                <p className="text-xs text-[#64748b]">
                  Invalidates old key. Returns new raw key once.
                </p>
              </Endpoint>
            </div>

            <div id="delete-account">
              <Endpoint method="DELETE" path="/auth/delete-account" desc="Delete account permanently">
                <div className="bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2.5 text-red-400 text-xs mb-3">
                  ⛔ Irreversible. Deletes user and API key.
                </div>
                <CodeBlock lang="Response" code={`{ "success": true, "message": "Account deleted successfully" }`} />
              </Endpoint>
            </div>
          </section>

          {/* ── User Recipe API v2 ── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-blue-400 rounded flex-shrink-0" />
              <h2 className="text-xl font-black tracking-tight">User Recipe API</h2>
              <span className="bg-blue-400/10 border border-blue-400/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">v2</span>
            </div>

            {/* v2 overview card */}
            <div id="v2-overview" className="bg-[#0e1420] border border-[#1e2a42] rounded-xl p-5 mb-5">
              <p className="text-sm text-[#64748b] leading-relaxed mb-5">
                The User Recipe API lets registered RecipeAPI users submit their own recipes to the community.
                All submissions go through manual admin review before being published publicly.
              </p>

              {/* Base URL v2 */}
              <div className="bg-[#080b12] border border-[#1e2a42] rounded-xl px-4 py-3 flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1">Base URL v2</p>
                  <code className="font-mono text-sm text-blue-300">{BASE_V2}</code>
                </div>
                <CopyBtn text={BASE_V2} />
              </div>

              {/* 3-step flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { step: "01", title: "Register", desc: "Create a RecipeAPI account and generate your API key" },
                  { step: "02", title: "Submit", desc: "POST your recipe with your API key in x-api-key header" },
                  { step: "03", title: "Get Approved", desc: "Our team reviews and approves your recipe manually" },
                ].map((s) => (
                  <div key={s.step} className="bg-[#141b2d] border border-[#1e2a42] rounded-xl p-4">
                    <p className="text-2xl font-black text-blue-400/30 mb-1">{s.step}</p>
                    <p className="text-xs font-bold mb-1">{s.title}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Rules */}
              <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-yellow-400 mb-2">📋 Submission Rules</p>
                <ul className="space-y-1.5">
                  {[
                    "You must have a registered RecipeAPI account — submitter email must match",
                    "API key required in x-api-key header",
                    "Rate limit: 2 recipe submissions per 60 seconds per API key",
                    "Recipes are reviewed manually before going public",
                    "Rejected recipes include an admin note explaining the reason",
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#64748b]">
                      <span className="text-yellow-400 flex-shrink-0 mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Submit Recipe */}
            <div id="v2-submit">
              <Endpoint method="POST" path="/user-recipe" desc="Submit a community recipe">
                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg px-3 py-2.5 text-blue-400 text-xs mb-4">
                  🔑 Requires <code className="font-mono">x-api-key</code> header. Submitter email must match a registered RecipeAPI account.
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2">Request Body</p>
                <ParamTable rows={[
                  { name: "submitterEmail", type: "string", required: true, desc: "Must match a registered RecipeAPI account email" },
                  { name: "submitterName", type: "string", required: true, desc: "Your display name" },
                  { name: "title", type: "string", required: true, desc: "Full recipe title" },
                  { name: "baseDish", type: "string", required: true, desc: "Base dish name e.g. biryani, dosa, curry" },
                  { name: "description", type: "string", required: false, desc: "Short description of the recipe" },
                  { name: "category", type: "string", required: true, desc: "Breakfast | Lunch | Dinner | Snack | Street Food | Dessert | Festival | Healthy" },
                  { name: "festival", type: "string", required: false, desc: "Diwali | Holi | Eid | Navratri | Christmas | Ramadan | Pongal | Baisakhi | None" },
                  { name: "country", type: "string", required: false, desc: "Default: India" },
                  { name: "city", type: "string", required: false, desc: "City of origin" },
                  { name: "cuisine", type: "string", required: false, desc: "Default: Indian" },
                  { name: "ingredients", type: "string[]", required: true, desc: "Array of ingredient strings" },
                  { name: "steps", type: "object[]", required: true, desc: "Array of { stepNumber: number, instruction: string }" },
                  { name: "cookingTime", type: "number", required: true, desc: "Cooking time in minutes" },
                  { name: "servings", type: "number", required: true, desc: "Number of servings" },
                  { name: "difficulty", type: "string", required: false, desc: "Easy | Medium | Hard (default: Medium)" },
                  { name: "tags", type: "string[]", required: false, desc: "Array of tag strings" },
                  { name: "image", type: "string", required: false, desc: "Image URL" },
                ]} />
                <CodeBlock lang="JavaScript" code={`const res = await fetch("${BASE_V2}/user-recipe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "ra_your_key_here"
  },
  body: JSON.stringify({
    submitterEmail: "you@example.com",
    submitterName: "Amit Kumar",
    title: "Hyderabadi Chicken Biryani",
    baseDish: "biryani",
    description: "A rich and aromatic biryani from Hyderabad",
    category: "Dinner",
    festival: "Eid",
    city: "Hyderabad",
    country: "India",
    cuisine: "Indian",
    cookingTime: 60,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "500g basmati rice",
      "1kg chicken",
      "2 onions sliced"
    ],
    steps: [
      { stepNumber: 1, instruction: "Marinate chicken for 2 hours" },
      { stepNumber: 2, instruction: "Cook rice until 70% done" },
      { stepNumber: 3, instruction: "Layer and dum cook for 30 mins" }
    ],
    tags: ["spicy", "rice", "chicken"],
    image: "https://example.com/biryani.jpg"
  })
});
const data = await res.json();`} />
                <CodeBlock lang="Success Response" code={`{
  "success": true,
  "recipe": {
    "_id": "64f1a2b3...",
    "title": "Hyderabadi Chicken Biryani",
    "status": "pending",
    "createdAt": "2026-03-15T10:30:00.000Z"
  }
}`} />
                <CodeBlock lang="Not Registered Error" code={`{
  "success": false,
  "error": "NOT_REGISTERED",
  "message": "This email is not registered on RecipeAPI. Please create an account first."
}`} />
                <div className="mt-3 bg-[#0e1420] border border-[#1e2a42] rounded-lg px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-1.5">Rate Limit</p>
                  <p className="text-xs text-[#64748b]">
                    Max <span className="text-orange-400 font-semibold">2 submissions per 60 seconds</span> per API key.
                    Returns <code className="text-red-400 font-mono">429</code> when exceeded.
                  </p>
                </div>
              </Endpoint>
            </div>

            {/* Approved Recipes */}
            <div id="v2-approved">
              <Endpoint method="GET" path="/user-recipe" desc="Get all approved community recipes">
                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg px-3 py-2.5 text-blue-400 text-xs mb-4">
                  🔑 Requires <code className="font-mono">x-api-key</code> header.
                </div>
                <ParamTable rows={[
                  { name: "page", type: "number", required: false, desc: "Page number (default: 1)" },
                  { name: "limit", type: "number", required: false, desc: "Per page (default: 20)" },
                ]} />
                <CodeBlock lang="Example" code={`GET ${BASE_V2}/user-recipe?page=1&limit=20`} />
                <CodeBlock lang="Response" code={`{
  "success": true,
  "recipes": [
    {
      "_id": "64f1a2b3...",
      "title": "Hyderabadi Chicken Biryani",
      "submitterName": "Amit Kumar",
      "category": "Dinner",
      "difficulty": "Medium",
      "cookingTime": 60,
      "servings": 4,
      "status": "approved"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}`} />
              </Endpoint>
            </div>

            {/* My Recipes */}
            <div id="v2-my">
              <Endpoint method="GET" path="/user-recipe/my" desc="Get your submitted recipes — requires login">
                <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg px-3 py-2.5 text-blue-400 text-xs mb-4">
                  🍪 Requires valid session cookie (must be logged in to RecipeAPI).
                </div>
                <CodeBlock lang="Example" code={`GET ${BASE_V2}/user-recipe/my`} />
                <CodeBlock lang="Response" code={`{
  "success": true,
  "count": 3,
  "recipes": [
    {
      "_id": "64f1a2b3...",
      "title": "Hyderabadi Chicken Biryani",
      "status": "approved",
      "createdAt": "2026-03-15T10:30:00.000Z"
    },
    {
      "_id": "64f1a2b4...",
      "title": "Lucknowi Mutton Biryani",
      "status": "pending",
      "createdAt": "2026-03-14T08:00:00.000Z"
    },
    {
      "_id": "64f1a2b5...",
      "title": "Kolkata Biryani",
      "status": "rejected",
      "adminNote": "Incomplete steps — please add more detail",
      "createdAt": "2026-03-13T06:00:00.000Z"
    }
  ]
}`} />

                {/* Status legend */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2">Status Values</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-3 py-2.5">
                      <p className="text-xs font-bold text-yellow-400 mb-0.5">pending</p>
                      <p className="text-[10px] text-[#64748b] leading-relaxed">Submitted, awaiting admin review</p>
                    </div>
                    <div className="bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2.5">
                      <p className="text-xs font-bold text-green-400 mb-0.5">approved</p>
                      <p className="text-[10px] text-[#64748b] leading-relaxed">Approved and publicly visible</p>
                    </div>
                    <div className="bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5">
                      <p className="text-xs font-bold text-red-400 mb-0.5">rejected</p>
                      <p className="text-[10px] text-[#64748b] leading-relaxed">Rejected — check adminNote for reason</p>
                    </div>
                  </div>
                </div>
              </Endpoint>
            </div>

          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}