"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/features/HeroSection";
import { PredictionForm } from "@/components/features/PredictionForm";
import { InsightCard, InfoPill } from "@/components/features/InsightCard";
import { useGigSarthiLive } from "@/hooks/useGigSarthiLive";
import { MapPin, Clock, Activity, AlertCircle, TrendingUp, Sun, CloudRain } from "lucide-react";

export default function Home() {
  const [city, setCity] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  
  const {
    loadingApi,
    error,
    incomeResult,
    timeResult,
    demandResult,
    fetchDemandAlert
  } = useGigSarthiLive();

  const handleDemandAlert = () => fetchDemandAlert(city);

  return (
    <main className="min-h-screen pb-20 relative bg-background">
      {/* Background Mesh */}
      <div className="fixed inset-0 min-h-screen w-full -z-10 bg-mesh-blue pointer-events-none" />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Interactive Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10">
        
        {/* Input Form */}
        <PredictionForm 
          city={city}
          setCity={setCity}
          hoursWorked={hoursWorked}
          setHoursWorked={setHoursWorked}
          onDemandAlert={handleDemandAlert}
          loadingApi={loadingApi}
        />

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 max-w-2xl mx-auto bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <AnimatePresence>
            {/* Income Result */}
            {incomeResult && (
              <InsightCard
                key="income"
                title="Estimated Earnings"
                color="primary"
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
                value={
                  <div className="text-gradient-blue text-5xl font-bold tracking-tight mt-2">
                    ₹{(incomeResult.predicted_earnings || incomeResult.estimated_income || 0).toLocaleString('en-IN')}
                  </div>
                }
                description={incomeResult.reasoning || "Based on current city and weather dynamics."}
              >
                <div className="flex flex-wrap gap-2">
                  <InfoPill label="City" value={incomeResult.city} />
                  <InfoPill label="Hours" value={incomeResult.hours_worked} />
                  {incomeResult.factors?.weather_factor > 1 && (
                    <InfoPill label="Weather" value={<span className="flex items-center gap-1 text-blue-400"><CloudRain className="w-3 h-3"/> Bonus active</span>} />
                  )}
                </div>
              </InsightCard>
            )}

            {/* Timings Result */}
            {timeResult && (
              <InsightCard
                key="time"
                title="Best Work Window"
                color="secondary"
                icon={<Clock className="h-5 w-5 text-secondary" />}
                value={
                  <div className="text-3xl font-bold text-foreground mt-2 tracking-tight">
                    {timeResult.best_time_window?.window || timeResult.best_time || "N/A"}
                  </div>
                }
                description={timeResult.reasoning || timeResult.reason || "Calculate best time..."}
              />
            )}

            {/* Demand Alert Result */}
            {demandResult && (
              <InsightCard
                key="demand"
                title="Live Demand Status"
                color={demandResult.demand_level === "Very High" ? "danger" : demandResult.demand_level === "High" ? "warning" : "success"}
                icon={<Activity className="h-5 w-5 text-foreground" />}
                value={
                  <div className="flex items-end gap-3 mt-2">
                    <span className="text-4xl font-bold text-foreground">{demandResult.demand_level}</span>
                    <span className="text-lg text-muted-foreground mb-1 pb-1">Score: {demandResult.demand_score}/10</span>
                  </div>
                }
                description={demandResult.reasoning || demandResult.reason || "High demand expected."}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
