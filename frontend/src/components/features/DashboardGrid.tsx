import React from "react";
import { motion } from "framer-motion";

interface DashboardGridProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardGrid({ children, title, subtitle, action }: DashboardGridProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      
      {/* Header Area */}
      {(title || subtitle || action) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title && <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>}
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </motion.div>
          
          {action && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {action}
            </motion.div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
