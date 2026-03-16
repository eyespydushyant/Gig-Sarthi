"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Clock, Zap, MapPin, Timer, IndianRupee,
  Thermometer, AlertCircle, CheckCircle2, Lightbulb
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency, getDemandColor, getDemandBg, getWeatherEmoji, cn
} from "@/lib/utils";

// ----- Type definitions -----
interface IncomeResult {
  predicted_earnings: number;
  demand_score: number;
  city: string;
  hours_worked: number;
  weather: { condition: string; description: string; temperature: number };
  traffic_level: string;
  holiday: { is_holiday: boolean; holiday_name: string | null };
}

interface WorkTimeResult {
  best_time: string;
  reason: string;
  demand_score: number;
  tips: string[];
  weather: { condition: string; temperature: number };
}

interface DemandResult {
  demand_level: string;
  demand_score: number;
  best_time: string;
  reason: string;
  city: string;
  weather: { condition: string; temperature: number };
}

type ApiResult = IncomeResult | WorkTimeResult | DemandResult | null;

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow",
  "Surat", "Chandigarh", "Kochi", "Bhopal", "Nagpur",
];

// ----- Result Card components -----
function IncomeCard({ data }: { data: IncomeResult }) {
  return (
    <Card className="border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <IndianRupee className="w-5 h-5" /> Income Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-black gradient-text mb-4">
          {formatCurrency(data.predicted_earnings)}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoPill icon={MapPin} label="City" value={data.city} />
          <InfoPill icon={Timer} label="Hours" value={`${data.hours_worked}h`} />
          <InfoPill
            icon={Thermometer}
            label="Weather"
            value={`${getWeatherEmoji(data.weather?.condition)} ${data.weather?.condition || "N/A"} · ${data.weather?.temperature || "--"}°C`}
          />
          <InfoPill icon={Zap} label="Demand Score" value={`${data.demand_score}/10`} />
        </div>
        {data.holiday?.is_holiday && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Holiday detected: {data.holiday.holiday_name} – 40% demand bonus!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WorkTimeCard({ data }: { data: WorkTimeResult }) {
  return (
    <Card className="border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Clock className="w-5 h-5" /> Best Work Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white mb-2">{data.best_time}</div>
        <p className="text-white/60 text-sm mb-4">{data.reason}</p>
        <InfoPill icon={TrendingUp} label="Demand Score" value={`${data.demand_score}/10`} />
        {data.tips && data.tips.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Tips</p>
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DemandCard({ data }: { data: DemandResult }) {
  return (
    <Card className={cn("border", getDemandBg(data.demand_level))}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className={cn("w-5 h-5", getDemandColor(data.demand_level))} />
          <span className={getDemandColor(data.demand_level)}>Demand Alert</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-4xl font-black mb-3", getDemandColor(data.demand_level))}>
          {data.demand_level}
        </div>
        {/* Score bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Demand Score</span>
            <span>{data.demand_score}/10</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.demand_score * 10}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                data.demand_score >= 8
                  ? "bg-red-400"
                  : data.demand_score >= 6
                  ? "bg-orange-400"
                  : data.demand_score >= 4
                  ? "bg-yellow-400"
                  : "bg-green-400"
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <InfoPill icon={Clock} label="Best Time" value={data.best_time} />
          <p className="text-white/50 text-xs mt-1">{data.reason}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/6">
      <Icon className="w-4 h-4 text-white/40 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white/80 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
    >
      <AlertCircle className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}

// ----- Main Home Page -----
export default function HomePage() {
  const [city, setCity] = useState("Delhi");
  const [hours, setHours] = useState("6");
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: string; data: ApiResult } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (type: string) => {
    setLoading(true);
    setActiveAction(type);
    setError(null);
    setResult(null);
    try {
      let data;
      if (type === "income") {
        const res = await axios.post("/api/predict-income", {
          city,
          hours_worked: parseFloat(hours) || 6,
        });
        data = res.data;
      } else if (type === "worktime") {
        const res = await axios.get(`/api/best-work-time?city=${encodeURIComponent(city)}`);
        data = res.data;
      } else if (type === "demand") {
        const res = await axios.get(`/api/demand-alert?city=${encodeURIComponent(city)}`);
        data = res.data;
      }
      setResult({ type, data });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Make sure the backend is running on port 5000.";
      setError(message);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <AnimatedHero
        onPredictIncome={() => callApi("income")}
        onBestWorkTime={() => callApi("worktime")}
        onDemandAlert={() => callApi("demand")}
        isLoading={loading}
      />

      {/* Input Section */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="glass-card rounded-2xl p-6"
        >
          <p className="text-sm text-white/40 font-medium uppercase tracking-wider mb-4">
            Configure Your Query
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City picker */}
            <div className="space-y-2">
              <label className="text-sm text-white/60 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" /> City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-gray-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <label className="text-sm text-white/60 flex items-center gap-2">
                <Timer className="w-4 h-4 text-orange-400" /> Hours to Work
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="1"
                max="16"
                step="0.5"
                placeholder="e.g. 6"
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/6">
            <Button
              variant="glow"
              onClick={() => callApi("income")}
              loading={loading && activeAction === "income"}
              disabled={loading}
            >
              <TrendingUp className="w-4 h-4" /> Predict Income
            </Button>
            <Button
              variant="outline"
              onClick={() => callApi("worktime")}
              loading={loading && activeAction === "worktime"}
              disabled={loading}
            >
              <Clock className="w-4 h-4" /> Best Work Time
            </Button>
            <Button
              variant="outline"
              onClick={() => callApi("demand")}
              loading={loading && activeAction === "demand"}
              disabled={loading}
            >
              <Zap className="w-4 h-4" /> Demand Alert
            </Button>
          </div>
        </motion.div>

        {/* Result area */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ErrorBanner message={error} />
              </motion.div>
            )}

            {result && !error && (
              <motion.div
                key={result.type}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.4 }}
              >
                {result.type === "income" && (
                  <IncomeCard data={result.data as IncomeResult} />
                )}
                {result.type === "worktime" && (
                  <WorkTimeCard data={result.data as WorkTimeResult} />
                )}
                {result.type === "demand" && (
                  <DemandCard data={result.data as DemandResult} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-2">How It Works</h2>
          <p className="text-white/40 text-center mb-10">
            Real-time data → AI engine → personalized insights in seconds
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Enter Your Details",
                desc: "Pick your city and how many hours you plan to work today.",
                color: "from-orange-500/20 to-orange-500/5",
                border: "border-orange-500/20",
              },
              {
                step: "02",
                title: "AI Fetches Live Data",
                desc: "We pull real-time weather, traffic patterns, and public holiday data for your city.",
                color: "from-blue-500/20 to-blue-500/5",
                border: "border-blue-500/20",
              },
              {
                step: "03",
                title: "Get Smart Predictions",
                desc: "Our AI engine computes your expected earnings, best working hours, and demand levels.",
                color: "from-green-500/20 to-green-500/5",
                border: "border-green-500/20",
              },
            ].map(({ step, title, desc, color, border }) => (
              <Card key={step} className={cn("border", border, "relative overflow-hidden")}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", color)} />
                <CardContent className="relative pt-2">
                  <div className="text-5xl font-black text-white/5 mb-2">{step}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">
              <span className="gradient-text">Gig</span>
              <span className="text-white">Sarthi</span>
            </span>
            <span className="text-white/30 text-sm">· Hackathon Prototype</span>
          </div>
          <p className="text-white/30 text-sm">
            Built with Next.js · FastAPI · OpenWeatherMap
          </p>
        </div>
      </footer>
    </div>
  );
}
