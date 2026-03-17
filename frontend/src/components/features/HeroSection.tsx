import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative pt-32 pb-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live AI Estimations
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-foreground">Predict. Earn. </span>
          <span className="text-gradient-blue">Thrive.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          AI-powered routing and earning estimations for gig workers. Maximize your trips with real-time weather, traffic, and demand insights.
        </p>
      </motion.div>
    </div>
  );
}
