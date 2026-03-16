"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnimatedHeroProps {
  onPredictIncome: () => void;
  onBestWorkTime: () => void;
  onDemandAlert: () => void;
  isLoading: boolean;
}

const HEADLINE_WORDS = ["Predict", "Earn", "Thrive"];

export function AnimatedHero({
  onPredictIncome,
  onBestWorkTime,
  onDemandAlert,
  isLoading,
}: AnimatedHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/8 blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/3 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-orange-400 pulse-dot" />
          AI-Powered Gig Worker Insights · Real-time Data
        </motion.div>

        {/* Animated headline */}
        <div className="mb-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight"
          >
            GigSarthi –
          </motion.h1>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                className={`text-5xl md:text-7xl font-black leading-tight ${
                  i === 0
                    ? "gradient-text"
                    : i === 1
                    ? "text-white"
                    : "gradient-text"
                }`}
              >
                {word}
                {i < HEADLINE_WORDS.length - 1 && (
                  <span className="text-white/20 mx-2">·</span>
                )}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mt-6 mb-10 leading-relaxed"
        >
          AI assistant for delivery agents, ride-share drivers & freelancers.{" "}
          <span className="text-white/80">Predict earnings. Find the best time to work.</span>
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {[
            { icon: TrendingUp, label: "Earnings Prediction" },
            { icon: Clock, label: "Best Work Hours" },
            { icon: Zap, label: "Demand Alerts" },
            { icon: BarChart3, label: "Income Dashboard" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/8 text-white/60 text-sm"
            >
              <Icon className="w-4 h-4 text-orange-400" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            variant="glow"
            size="lg"
            onClick={onPredictIncome}
            loading={isLoading}
            className="min-w-[160px]"
          >
            <TrendingUp className="w-5 h-5" />
            Predict Income
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onBestWorkTime}
            disabled={isLoading}
            className="min-w-[160px]"
          >
            <Clock className="w-5 h-5" />
            Best Work Time
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onDemandAlert}
            disabled={isLoading}
            className="min-w-[160px]"
          >
            <Zap className="w-5 h-5" />
            Demand Alert
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="min-w-[160px]">
              <BarChart3 className="w-5 h-5" />
              Open Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
