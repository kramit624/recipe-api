import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Zap,
  Clock,
  Shield,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const { user, createApiKey, regenerateApiKey, fetchMe } = useAuth();

  useEffect(() => {
    fetchMe();
  },[])

  
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-[#080b12] border border-[#1e2a42] rounded-xl overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#141b2d] border-b border-[#1e2a42]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
          {lang}
        </span>
        <button
          onClick={copy}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${copied ? "text-green-400" : "text-[#64748b] hover:text-orange-400"}`}
        >
          {copied ? (
            <>
              <CheckCircle size={11} /> Copied
            </>
          ) : (
            <>
              <Copy size={11} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-5 py-4 text-xs text-[#94a3b8] font-mono leading-relaxed overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}

export default function ApiDashboard() {
  const { user, createApiKey, regenerateApiKey } = useAuth();
  const navigate = useNavigate();
  const [revealedKey, setRevealedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [notice, setNotice] = useState(null);

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

  const hasKey = !!user.apiKey;

  const handleCreate = async () => {
    setLoading("create");
    try {
      const key = await createApiKey();
      setRevealedKey(key);
      setShowKey(true);
      setNotice({
        type: "success",
        msg: "API key created! Copy it now — you won't see it again.",
      });
    } catch (err) {
      setNotice({ type: "error", msg: err.message });
    } finally {
      setLoading("");
    }
  };

  const handleRegenerate = async () => {
    if (!confirmRegen) {
      setConfirmRegen(true);
      return;
    }
    setLoading("regen");
    setConfirmRegen(false);
    try {
      const key = await regenerateApiKey();
      setRevealedKey(key);
      setShowKey(true);
      setNotice({
        type: "success",
        msg: "New API key generated! Copy it now — you won't see it again.",
      });
    } catch (err) {
      setNotice({ type: "error", msg: err.message });
    } finally {
      setLoading("");
    }
  };

  const handleCopy = () => {
    if (!revealedKey) return;
    navigator.clipboard.writeText(revealedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-[2]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8 animate-fade-up">
          <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
            <KeyRound size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">API Dashboard</h1>
            <p className="text-xs text-[#64748b]">
              Manage your API key and view usage
            </p>
          </div>
        </div>

        {notice && (
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium mb-5 border animate-fade-up ${notice.type === "success" ? "bg-green-400/8 border-green-400/20 text-green-400" : "bg-red-500/8 border-red-500/20 text-red-400"}`}
          >
            {notice.type === "success" ? (
              <CheckCircle size={15} />
            ) : (
              <AlertTriangle size={15} />
            )}
            {notice.msg}
            <button
              onClick={() => setNotice(null)}
              className="ml-auto opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 animate-fade-up delay-100">
          {[
            {
              icon: <Zap size={16} />,
              label: "Rate Limit",
              value: "10 / min",
              color: "text-orange-400",
            },
            {
              icon: <Clock size={16} />,
              label: "Window",
              value: "60 sec",
              color: "text-blue-400",
            },
            {
              icon: <Shield size={16} />,
              label: "Tier",
              value: user.tier || "Free",
              color: "text-green-400",
            },
            {
              icon: <Activity size={16} />,
              label: "Status",
              value: "Active",
              color: "text-green-400",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#0e1420] border border-[#1e2a42] rounded-xl p-4"
            >
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className="font-black text-base tracking-tight">{s.value}</p>
              <p className="text-[10px] text-[#64748b] font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl overflow-hidden mb-4 animate-fade-up delay-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a42] flex-wrap gap-3">
            <div>
              <p className="font-bold text-sm">Your API Key</p>
              <p className="text-xs text-[#64748b] mt-0.5">
                {hasKey
                  ? "Key active. Use as x-api-key header."
                  : "No key yet. Create one to start."}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {hasKey && (
                <button
                  onClick={handleRegenerate}
                  disabled={!!loading}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${confirmRegen ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-[#141b2d] border-[#1e2a42] text-[#64748b] hover:text-[#e2e8f0] hover:border-orange-500"}`}
                >
                  {loading === "regen" ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RefreshCw size={12} />
                  )}
                  {confirmRegen ? "Confirm?" : "Regenerate"}
                </button>
              )}
              {!hasKey && (
                <button
                  onClick={handleCreate}
                  disabled={!!loading}
                  className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-70 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  {loading === "create" ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <KeyRound size={12} />
                  )}
                  {loading === "create" ? "Creating..." : "Create API Key"}
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {revealedKey ? (
              <>
                <div className="bg-[#080b12] border border-[#1e2a42] rounded-xl px-4 py-3 flex items-center gap-3 mb-3">
                  <code
                    className={`font-mono text-sm flex-1 break-all ${showKey ? "text-orange-300" : "text-[#64748b]"}`}
                  >
                    {showKey ? revealedKey : "ra_" + "•".repeat(40)}
                  </code>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="text-[#64748b] hover:text-[#e2e8f0] transition-colors p-1"
                    >
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${copied ? "bg-green-400/10 border-green-400/25 text-green-400" : "bg-[#141b2d] border-[#1e2a42] text-[#64748b] hover:text-[#e2e8f0]"}`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={11} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/15 rounded-lg px-3 py-2.5 text-yellow-400 text-xs">
                  <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                  This key is shown only once. Store it safely now.
                </div>
              </>
            ) : hasKey ? (
              <div className="bg-[#080b12] border border-[#1e2a42] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <code className="font-mono text-sm text-[#64748b]">
                  ra_{"•".repeat(40)}
                </code>
                <span className="bg-green-400/10 border border-green-400/20 text-green-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0">
                  Active
                </span>
              </div>
            ) : (
              <div className="text-center py-8 text-[#64748b]">
                <KeyRound size={30} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No API key generated yet.</p>
                <p className="text-xs mt-1">
                  Click "Create API Key" above to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl overflow-hidden animate-fade-up delay-300">
          <div className="px-5 py-4 border-b border-[#1e2a42]">
            <p className="font-bold text-sm">How to use your API key</p>
          </div>
          <div className="p-5">
            <CodeBlock
              lang="cURL"
              code={`curl https://api.recipeapi.dev/api/v1/recipes \\\n  -H "x-api-key: ra_your_key_here"`}
            />
            <CodeBlock
              lang="JavaScript"
              code={`const res = await fetch("https://api.recipeapi.dev/api/v1/recipes", {\n  headers: { "x-api-key": "ra_your_key_here" }\n});\nconst data = await res.json();`}
            />
            <CodeBlock
              lang="Python"
              code={`import requests\nres = requests.get(\n  "https://api.recipeapi.dev/api/v1/recipes",\n  headers={"x-api-key": "ra_your_key_here"}\n)\ndata = res.json()`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
