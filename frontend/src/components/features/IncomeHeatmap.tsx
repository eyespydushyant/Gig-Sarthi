"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface DayData {
  date: string;
  earnings: number;
  level: "none" | "low" | "medium" | "high";
}

const LEVEL_COLORS = {
  none: "bg-white/5 border-white/5",
  low: "bg-blue-900/60 border-blue-800/40",
  medium: "bg-primary/50 border-primary/30",
  high: "bg-primary border-primary/80 shadow-[0_0_6px_rgba(14,165,233,0.4)]",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  city: string;
}

export function IncomeHeatmap({ city }: Props) {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ day: DayData; x: number; y: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/earnings-history?city=${city}`)
      .then((res) => setData(res.data.history))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [city]);

  // Build 52-week × 7 grid
  const weeks: (DayData | null)[][] = [];
  if (data.length > 0) {
    // Pad front so first day aligns with correct weekday
    const firstDayOfWeek = new Date(data[0].date).getDay();
    const aligned: (DayData | null)[] = [
      ...Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null),
      ...data,
    ];
    for (let i = 0; i < aligned.length; i += 7) {
      weeks.push(aligned.slice(i, i + 7));
    }
  }

  const counts = {
    high: data.filter((d) => d.level === "high").length,
    medium: data.filter((d) => d.level === "medium").length,
    low: data.filter((d) => d.level === "low").length,
  };

  return (
    <div className="glass-panel border border-white/10 rounded-2xl p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">Income Intensity — Past 52 Weeks</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-white/5 border border-white/5 inline-block" /> No data</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-900/60 inline-block" /> Low</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary/50 inline-block" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /> High</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-28 text-muted-foreground text-sm">Loading heatmap...</div>
      ) : (
        <>
          <div className="flex gap-1 overflow-x-auto pb-2" onMouseLeave={() => setTooltip(null)}>
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {DAYS.map((d) => (
                <div key={d} className="text-[10px] text-muted-foreground h-3 w-6 leading-3 flex items-center">{d}</div>
              ))}
            </div>
            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
                {Array(7).fill(null).map((_, di) => {
                  const cell = week[di] || null;
                  return (
                    <div
                      key={di}
                      className={`w-3 h-3 rounded-sm border cursor-pointer transition-transform hover:scale-125 ${
                        cell ? LEVEL_COLORS[cell.level] : LEVEL_COLORS.none
                      }`}
                      onMouseEnter={(e) => cell && setTooltip({ day: cell, x: e.clientX, y: e.clientY })}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
            <span>🟦 Low: <strong className="text-foreground">{counts.low} days</strong></span>
            <span>🟨 Medium: <strong className="text-foreground">{counts.medium} days</strong></span>
            <span>🟩 High: <strong className="text-foreground">{counts.high} days</strong></span>
          </div>
        </>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-background border border-white/20 shadow-lg rounded-lg px-3 py-2 text-xs pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
        >
          <p className="font-semibold text-foreground">{tooltip.day.date}</p>
          <p className="text-primary">₹{tooltip.day.earnings} estimated</p>
          <p className="capitalize text-muted-foreground">{tooltip.day.level} income day</p>
        </div>
      )}
    </div>
  );
}
