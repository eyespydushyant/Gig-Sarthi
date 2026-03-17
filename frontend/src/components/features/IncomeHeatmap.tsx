"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface DayData {
  date: string;
  earnings: number;
  level: "none" | "low" | "medium" | "high";
}

interface TooltipState {
  day: DayData;
  x: number;
  y: number;
}

const LEVEL_COLORS = {
  none: "bg-white/5 border-white/5",
  low: "bg-blue-900/70 border-blue-800/40",
  medium: "bg-sky-600/60 border-sky-500/40",
  high: "bg-primary border-primary/80 shadow-[0_0_6px_rgba(14,165,233,0.5)]",
};

const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getDayName(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "long" });
}
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

interface Props { city: string; }

export function IncomeHeatmap({ city }: Props) {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/earnings-history?city=${encodeURIComponent(city)}`)
      .then((res) => setData(res.data.history))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [city]);

  // Build aligned week columns
  // Each column = one week (Mon-Sun), left-to-right = oldest to newest
  const weeks: (DayData | null)[][] = [];
  const monthLabels: { weekIndex: number; label: string }[] = [];

  if (data.length > 0) {
    // Align so Monday = row 0
    const firstDay = new Date(data[0].date);
    const dow = firstDay.getDay(); // 0=Sun … 6=Sat
    const mondayOffset = dow === 0 ? 6 : dow - 1;
    const padded: (DayData | null)[] = [...Array(mondayOffset).fill(null), ...data];

    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7).concat(Array(7).fill(null)).slice(0, 7));
    }

    // Month label positions — find the first week where each new month appears
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstReal = week.find(Boolean) as DayData | undefined;
      if (!firstReal) return;
      const m = new Date(firstReal.date).getMonth();
      if (m !== lastMonth) { monthLabels.push({ weekIndex: wi, label: MONTH_NAMES[m] }); lastMonth = m; }
    });
  }

  const counts = {
    high: data.filter((d) => d.level === "high").length,
    medium: data.filter((d) => d.level === "medium").length,
    low: data.filter((d) => d.level === "low").length,
  };

  return (
    <div className="glass-panel border border-white/10 rounded-2xl p-6" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-medium text-foreground">Income Intensity — Past Year</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Daily estimated earnings heatmap for {city}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-white/5 border border-white/5 inline-block" /> No data</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-900/70 inline-block" /> Low</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-sky-600/60 inline-block" /> Med</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> High</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-28 text-muted-foreground text-sm">Loading heatmap...</div>
      ) : (
        <div className="overflow-x-auto pb-2" onMouseLeave={() => setTooltip(null)}>
          {/* Month labels row */}
          <div className="flex gap-1 mb-1 ml-7">
            {weeks.map((_, wi) => {
              const ml = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} className="w-3 flex-shrink-0 text-[10px] text-muted-foreground text-left overflow-visible whitespace-nowrap">
                  {ml ? ml.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {/* Weekday labels */}
            <div className="flex flex-col gap-1 mr-1 flex-shrink-0">
              {WEEKDAY_LABELS.map((d, i) => (
                <div key={i} className="text-[10px] text-muted-foreground h-3 w-6 leading-3 flex items-center">{d}</div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className={`w-3 h-3 rounded-sm border cursor-pointer transition-transform hover:scale-125 ${
                      cell ? LEVEL_COLORS[cell.level] : LEVEL_COLORS.none
                    }`}
                    onMouseEnter={(e) => {
                      if (!cell) return;
                      setTooltip({ day: cell, x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      if (tooltip) setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="flex gap-5 mt-4 text-xs text-muted-foreground">
            <span>🟦 Low: <strong className="text-foreground">{counts.low} days</strong></span>
            <span>🩵 Medium: <strong className="text-foreground">{counts.medium} days</strong></span>
            <span>🔵 High: <strong className="text-foreground">{counts.high} days</strong></span>
          </div>
        </div>
      )}

      {/* Portal-style tooltip */}
      {tooltip && (
        <div
          className="fixed z-[999] pointer-events-none bg-background/95 backdrop-blur border border-white/20 shadow-xl rounded-xl px-4 py-3 text-sm min-w-[180px]"
          style={{ left: tooltip.x + 14, top: tooltip.y - 70 }}
        >
          <p className="font-semibold text-foreground">{formatDate(tooltip.day.date)}</p>
          <p className="text-muted-foreground text-xs mb-2">{getDayName(tooltip.day.date)}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Est. Earnings</span>
            <span className="font-bold text-primary">₹{tooltip.day.earnings.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span className="text-muted-foreground">Intensity</span>
            <span className={`font-semibold capitalize ${
              tooltip.day.level === "high" ? "text-primary" :
              tooltip.day.level === "medium" ? "text-sky-400" : "text-blue-400"
            }`}>{tooltip.day.level}</span>
          </div>
        </div>
      )}
    </div>
  );
}
