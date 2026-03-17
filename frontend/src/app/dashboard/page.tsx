"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGigSarthiLive } from "@/hooks/useGigSarthiLive";
import { fallbackTrends, DailyTrend } from "@/data/mockData";
import { DashboardGrid } from "@/components/features/DashboardGrid";
import { DemandGauge } from "@/components/features/DemandGauge";
import { InsightCard } from "@/components/features/InsightCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Clock, CloudSun, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { QUICK_CITIES } from "@/constants/cities";
import { IncomeHeatmap } from "@/components/features/IncomeHeatmap";

export default function Dashboard() {
  const { dashboardData, dashboardLoading, error, fetchDashboardData } = useGigSarthiLive();
  const searchParams = useSearchParams();
  const urlCity = searchParams.get("city") || "Delhi";
  const urlHours = searchParams.get("hours") || "8";

  // Load data based on URL parameters or fallback
  useEffect(() => {
    fetchDashboardData(urlCity, urlHours);
  }, [fetchDashboardData, urlCity, urlHours]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => fetchDashboardData(urlCity, urlHours)} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  // Handle missing data states smoothly
  const earnings = dashboardData?.predicted_earnings || 0;
  const bestTime = dashboardData?.best_time || "Calculating...";
  const demandLevel = dashboardData?.demand_level || "Moderate";
  const demandScore = dashboardData?.demand_score || 5;
  const weatherCond = dashboardData?.weather?.condition || "Clear";
  const weatherTemp = dashboardData?.weather?.temperature ? `${dashboardData.weather.temperature}°C` : "--°C";
  const trends = dashboardData?.earnings_trend || fallbackTrends;

  return (
    <main className="min-h-screen pb-20 relative bg-background">
      {/* Blue mesh background */}
      <div className="fixed inset-0 min-h-screen w-full -z-10 bg-mesh-blue pointer-events-none" />

      {/* City Quick Switch Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mr-2">Switch City:</span>
          {QUICK_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => fetchDashboardData(c, urlHours)}
              disabled={dashboardLoading}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                ${ (dashboardData?.city || urlCity).toLowerCase() === c.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(14,165,233,0.4)]"
                  : "bg-background/40 text-muted-foreground border-white/10 hover:border-primary/50 hover:text-primary"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {dashboardLoading ? (
        <div className="flex w-full h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Syncing live logistics data...</p>
          </div>
        </div>
      ) : (
        <DashboardGrid 
          title="Analytics Dashboard" 
          subtitle={`Live conditions for ${dashboardData?.city || urlCity}`}
          action={
            <Button onClick={() => fetchDashboardData(dashboardData?.city || urlCity, urlHours)} variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/5">
              <RefreshCw className="w-4 h-4" /> Refresh Sync
            </Button>
          }
        >
          {/* Top Row: Stat Cards */}
          <InsightCard 
            title="Est. Daily Earnings" 
            color="primary"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            value={<div className="text-3xl font-bold mt-2">₹{earnings}</div>}
            description="Projected for an 8-hour shift today."
          />
          
          <InsightCard 
            title="Best Work Time" 
            color="secondary"
            icon={<Clock className="w-5 h-5 text-secondary" />}
            value={<div className="text-2xl font-bold mt-2">{bestTime}</div>}
            description={dashboardData?.reason || "Based on historical routing."}
          />
          
          <InsightCard 
            title="Weather Impact" 
            color="default"
            icon={<CloudSun className="w-5 h-5 text-foreground" />}
            value={<div className="text-3xl font-bold mt-2">{weatherTemp}</div>}
            description={`${weatherCond}. ${dashboardData?.weather?.description || ""}`}
          />
          
          <div className="md:col-span-1">
             <DemandGauge score={demandScore} level={demandLevel as any} explanation={dashboardData?.reason} />
          </div>

          {/* Bottom Row: Charts & Tips */}
          <div className="md:col-span-3 h-[400px] glass-panel rounded-xl border-white/10 p-6 flex flex-col">
            <h3 className="text-lg font-medium text-foreground mb-6">7-Day Earnings Trend</h3>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(16, 20, 28, 0.9)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                    formatter={(val: number) => [`₹${val}`, 'Earnings']}
                  />
                  <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                    {trends.map((entry: DailyTrend, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === trends.length - 1 ? '#0ea5e9' : 'rgba(14, 165, 233, 0.3)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Tips Panel */}
          <div className="md:col-span-1 glass-panel rounded-xl border-white/10 p-6 flex flex-col bg-gradient-to-b from-primary/10 to-transparent">
             <h3 className="text-lg font-medium text-primary mb-4 flex items-center gap-2">
               ✨ Sarthi Tips
             </h3>
             <ul className="space-y-4">
                {dashboardData?.tips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground/90 flex items-start gap-2 border-b border-primary/10 pb-3 last:border-0">
                    <span className="text-primary mt-0.5">•</span> {tip}
                  </li>
                ))}
             </ul>
          </div>
        </DashboardGrid>
      )}

      {/* Income Heatmap — full width below main grid */}
      {!dashboardLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <IncomeHeatmap city={dashboardData?.city || urlCity} />
        </div>
      )}
    </main>
  );
}
