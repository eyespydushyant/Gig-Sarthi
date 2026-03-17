import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  description?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
  children?: React.ReactNode;
}

export function InsightCard({
  title,
  subtitle,
  icon,
  value,
  description,
  color = "default",
  children
}: InsightCardProps) {

  const colorMap = {
    primary: "border-primary/30 shadow-[0_0_30px_rgba(14,165,233,0.15)]",
    secondary: "border-secondary/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    success: "border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    warning: "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    danger: "border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    default: "border-muted-foreground/30 shadow-lg"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="w-full"
    >
      <Card className={cn("glass-panel overflow-hidden relative group", colorMap[color])}>
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              {subtitle && <p className="text-xs text-muted-foreground/80 mt-1">{subtitle}</p>}
            </div>
            <div className="p-2 rounded-lg bg-background/50 border border-white/5 shadow-inner">
              {icon}
            </div>
          </div>
          
          <div className="mb-2">
            {value}
          </div>
          
          {description && (
            <p className="text-sm text-muted-foreground/90 border-t border-white/10 pt-3 mt-3">
              {description}
            </p>
          )}

          {children && (
            <div className="mt-4 pt-4 border-t border-white/10">
              {children}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper component for info pills inside the card
export function InfoPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-background/60 border border-white/5 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-medium">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
