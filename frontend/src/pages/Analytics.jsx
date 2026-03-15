import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart2,
  Calendar,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function Analytics() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setDataLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API}/analytics`, { credentials: "include" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setDataLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAnalytics();
  }, [user, loading]);

  // auth still loading
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center relative z-[2]">
        <Loader2 size={28} className="animate-spin text-orange-400" />
      </div>
    );

  // data loading
  if (dataLoading)
    return (
      <div className="min-h-screen flex items-center justify-center relative z-[2]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-orange-400" />
          <p className="text-sm text-[#64748b]">Loading analytics...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center relative z-[2]">
        <div className="text-center">
          <AlertTriangle size={28} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );

  // rest of your component stays exactly the same...

  const maxCount = data?.topEndpoints?.[0]?.count || 1;

  // Fill missing days in trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const found = data?.dailyTrend?.find((t) => t.date === key);
    return {
      date: key,
      count: found?.count || 0,
      label: d.toLocaleDateString("en", { weekday: "short" }),
    };
  });

  const maxTrend = Math.max(...last7Days.map((d) => d.count), 1);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-[2]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
              <BarChart2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                API Analytics
              </h1>
              <p className="text-xs text-[#64748b]">
                Your usage stats and insights
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-[#141b2d] border border-[#1e2a42] hover:border-orange-500 text-[#64748b] hover:text-[#e2e8f0] px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 animate-fade-up delay-100">
          {[
            {
              icon: <Clock size={16} />,
              label: "Today",
              value: data.totalToday,
              color: "text-orange-400",
            },
            {
              icon: <Calendar size={16} />,
              label: "This Month",
              value: data.totalMonth,
              color: "text-blue-400",
            },
            {
              icon: <Activity size={16} />,
              label: "All Time",
              value: data.totalAll,
              color: "text-purple-400",
            },
            {
              icon: <AlertTriangle size={16} />,
              label: "Rate Limits",
              value: data.rateLimitHits,
              color: "text-red-400",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#0e1420] border border-[#1e2a42] rounded-xl p-4"
            >
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className="text-2xl font-black tracking-tight">
                {s.value.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#64748b] font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* 7-day trend */}
        <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl p-5 mb-4 animate-fade-up delay-200">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={15} className="text-orange-400" />
            <p className="font-bold text-sm">Last 7 Days</p>
          </div>
          <div className="flex items-end gap-2 h-28">
            {last7Days.map((day, i) => {
              const heightPct =
                maxTrend === 0
                  ? 0
                  : Math.max(
                      (day.count / maxTrend) * 100,
                      day.count > 0 ? 8 : 0,
                    );
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <span className="text-[9px] text-[#64748b] font-medium">
                    {day.count > 0 ? day.count : ""}
                  </span>
                  <div className="w-full flex items-end" style={{ height: 80 }}>
                    <div
                      className="w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        background:
                          day.count > 0
                            ? "linear-gradient(to top, #f97316, #fb923c)"
                            : "#1e2a42",
                        minHeight: day.count > 0 ? 4 : 2,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-[#64748b]">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top endpoints */}
        <div className="bg-[#0e1420] border border-[#1e2a42] rounded-2xl overflow-hidden animate-fade-up delay-300">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1e2a42]">
            <Zap size={15} className="text-orange-400" />
            <p className="font-bold text-sm">Top Endpoints</p>
            <span className="ml-auto text-[10px] text-[#64748b]">All time</span>
          </div>

          {data.topEndpoints.length === 0 ? (
            <div className="text-center py-10 text-[#64748b]">
              <Activity size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No requests yet.</p>
              <p className="text-xs mt-1">
                Start making API calls to see analytics.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {data.topEndpoints.map((ep, i) => {
                const pct = Math.round((ep.count / maxCount) * 100);
                return (
                  <div
                    key={i}
                    className="px-3 py-2.5 rounded-xl hover:bg-[#141b2d] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#64748b] w-4">
                          {i + 1}
                        </span>
                        <code className="font-mono text-xs text-[#e2e8f0]">
                          {ep.endpoint}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-400">
                          {ep.count.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#64748b]">req</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-[#1e2a42] rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background:
                            i === 0
                              ? "linear-gradient(to right, #f97316, #fb923c)"
                              : i === 1
                                ? "linear-gradient(to right, #60a5fa, #818cf8)"
                                : "linear-gradient(to right, #4ade80, #34d399)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rate limit info */}
        {data.rateLimitHits > 0 && (
          <div className="mt-4 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-up">
            <AlertTriangle
              size={15}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-red-400">
                Rate limit hit {data.rateLimitHits} time
                {data.rateLimitHits > 1 ? "s" : ""} this month
              </p>
              <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                You're hitting the 10 req/min limit. Space out your requests or
                wait for the window to reset.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
