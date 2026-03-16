"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  IndianRupee, Clock, Zap, CloudSun, MapPin, Timer,
  TrendingUp, TrendingDown, RefreshCw, AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatCurrency, getDemandColor, getDemandBg, getWeatherEmoji, cn
} from "@/lib/utils";

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow",
];

interface DashboardData {
  predicted_earnings: number;
  demand_level: string;
  demand_score: number;
  best_time: string;
  reason: string;
  tips: string[];
  weather: {
    condition: string;
    description: string;
    temperature: number;
    humidity: number;
  };
  holiday: { is_holiday: boolean; holiday_name: string | null };
  traffic_level: string;
  city: string;
  hours_worked: number;
  earnings_trend: { day: string; earnings: number }[];
}

// ----- Stat Card -----
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "orange",
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: "orange" | "blue" | "green" | "purple";
  delay?: number;
}) {
  const accentClasses = {
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="hover:scale-[1.02] transition-transform duration-200 cursor-default">
        <CardContent className="pt-2">
          <div className={cn("inline-flex p-2.5 rounded-xl border mb-4", accentClasses[accent])}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ----- Custom Tooltip -----
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-gray-900 border border-white/10 text-sm">
        <p className="text-white/50 mb-1">{label}</p>
        <p className="text-orange-400 font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

// ----- Loading Skeleton -----
function SkeletonCard() {
  return (
    <Card>
      <CardContent className="pt-2 space-y-3">
        <div className="w-10 h-10 rounded-xl shimmer" />
        <div className="w-20 h-3 rounded shimmer" />
        <div className="w-28 h-6 rounded shimmer" />
      </CardContent>
    </Card>
  );
}

// ----- Main Dashboard -----
export default function DashboardPage() {
  const [city, setCity] = useState("Delhi");
  const [hours, setHours] = useState("6");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `/api/dashboard?city=${encodeURIComponent(city)}&hours_worked=${hours}`
      );
      setData(res.data);
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, [city, hours]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-black text-white">
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">
              AI-powered earnings and demand insights
              {lastUpdated && (
                <span className="ml-2 text-white/30">· Updated {lastUpdated}</span>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500/50 focus:outline-none appearance-none cursor-pointer"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="1" max="16" step="0.5"
              placeholder="Hours"
              className="h-9 w-24 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
            />
            <Button
              variant="glow"
              size="sm"
              onClick={fetchDashboard}
              loading={loading}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading && !data ? (
            <>
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </>
          ) : data ? (
            <>
              <StatCard
                icon={IndianRupee}
                label="Predicted Earnings"
                value={formatCurrency(data.predicted_earnings)}
                sub={`For ${data.hours_worked}h in ${data.city}`}
                accent="orange"
                delay={0}
              />
              <StatCard
                icon={Clock}
                label="Best Work Time"
                value={data.best_time}
                sub="Today's recommendation"
                accent="blue"
                delay={0.1}
              />
              <StatCard
                icon={Zap}
                label="Demand Level"
                value={data.demand_level}
                sub={`Score: ${data.demand_score}/10`}
                accent={
                  data.demand_level === "Very High" || data.demand_level === "High"
                    ? "orange"
                    : data.demand_level === "Moderate"
                    ? "purple"
                    : "green"
                }
                delay={0.2}
              />
              <StatCard
                icon={CloudSun}
                label="Weather"
                value={`${getWeatherEmoji(data.weather?.condition)} ${data.weather?.condition || "N/A"}`}
                sub={`${data.weather?.temperature || "--"}°C · ${data.weather?.humidity || "--"}% humidity`}
                accent="green"
                delay={0.3}
              />
            </>
          ) : null}
        </div>

        {/* Charts + Details row */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings Trend Chart */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    7-Day Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.earnings_trend} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${v}`}
                        width={55}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Bar dataKey="earnings" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#f97316" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Demand Gauge + Details */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Demand meter */}
              <Card className={cn("border", getDemandBg(data.demand_level))}>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2", getDemandColor(data.demand_level))}>
                    <Zap className="w-5 h-5" /> Live Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-4xl font-black mb-3", getDemandColor(data.demand_level))}>
                    {data.demand_score}/10
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {[10, 8, 6, 4, 2].map((mark) => (
                      <div key={mark} className="flex items-center gap-2">
                        <div className="w-6 text-xs text-white/30 text-right">{mark}</div>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: data.demand_score >= mark ? "100%" : "0%" }}
                            transition={{ duration: 0.6, delay: 0.1 * (10 - mark) / 2 }}
                            className={cn(
                              "h-full rounded-full",
                              data.demand_score >= 8 ? "bg-red-400" :
                              data.demand_score >= 6 ? "bg-orange-400" :
                              data.demand_score >= 4 ? "bg-yellow-400" : "bg-green-400"
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs">{data.reason}</p>
                </CardContent>
              </Card>

              {/* Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" /> Conditions · {data.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> Traffic</span>
                    <span className="text-white capitalize">{data.traffic_level}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span className="flex items-center gap-1.5">
                      {data.demand_score >= 6
                        ? <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      } Trend
                    </span>
                    <span className={data.demand_score >= 6 ? "text-green-400" : "text-red-400"}>
                      {data.demand_score >= 6 ? "Bullish" : "Bearish"}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Holiday</span>
                    <span className={data.holiday?.is_holiday ? "text-yellow-400" : "text-white/40"}>
                      {data.holiday?.is_holiday ? `✓ ${data.holiday.holiday_name}` : "None"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Tips */}
        {data?.tips && data.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-white/80">💡 AI Tips for Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {data.tips.map((tip, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 rounded-xl bg-orange-500/8 border border-orange-500/15 text-orange-200/70 text-sm"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
