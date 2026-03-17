import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface DemandGaugeProps {
  score: number; // 1 to 10
  level: "Low" | "Moderate" | "High" | "Very High";
  explanation?: string;
}

export function DemandGauge({ score, level, explanation }: DemandGaugeProps) {
  // Normalize score to percentage for the fill ring, max 10
  const percentage = Math.min(Math.max((score / 10) * 100, 5), 100);

  const levelConfig = {
    Low: { color: "text-blue-400", bg: "bg-blue-400", glow: "shadow-[0_0_20px_rgba(96,165,250,0.4)]" },
    Moderate: { color: "text-cyan-400", bg: "bg-cyan-400", glow: "shadow-[0_0_20px_rgba(34,211,238,0.4)]" },
    High: { color: "text-orange-400", bg: "bg-orange-400", glow: "shadow-[0_0_20px_rgba(251,146,60,0.4)]" },
    "Very High": { color: "text-red-500", bg: "bg-red-500", glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]" },
  };

  const currentConfig = levelConfig[level] || levelConfig.Moderate;

  return (
    <Card className="glass-panel overflow-hidden h-full flex flex-col items-center justify-center p-6 border-muted-foreground/20">
      <CardContent className="w-full flex-1 flex flex-col items-center justify-center pt-6 p-0">
        
        {/* Gauge Container */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          {/* Background Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="96" cy="96" r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted-foreground/20"
            />
          </svg>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center drop-shadow-xl">
            <motion.circle
              cx="96" cy="96" r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              className={currentConfig.color}
              strokeDasharray="552.92" // 2 * pi * 88
              initial={{ strokeDashoffset: 552.92 }}
              animate={{ strokeDashoffset: 552.92 - (552.92 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Activity className={`w-8 h-8 mb-2 opacity-80 ${currentConfig.color}`} />
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className={`text-3xl font-bold tracking-tighter ${currentConfig.color}`}
            >
              {level}
            </motion.span>
            <span className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">Demand</span>
          </div>
        </div>

        {/* Info Box */}
        {explanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className={`mt-auto w-full p-4 rounded-xl bg-background/50 border border-white/5 text-sm text-center ${currentConfig.glow} transition-shadow duration-1000`}
          >
            <p className="text-muted-foreground/90">{explanation}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
