"use client";

import { useState, useEffect } from "react";
import { Target, TrendingUp, AlertCircle, Edit2, Check } from "lucide-react";

export function IncomeTargetTracker() {
  const [target, setTarget] = useState<number>(20000);
  const [targetType, setTargetType] = useState<"weekly" | "monthly">("monthly");
  const [earned, setEarned] = useState<number>(8500); // Mock starting value
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const savedTarget = localStorage.getItem("gigsarthi_target");
    const savedType = localStorage.getItem("gigsarthi_target_type");
    const savedEarned = localStorage.getItem("gigsarthi_earned");
    if (savedTarget) setTarget(Number(savedTarget));
    if (savedType) setTargetType(savedType as "weekly" | "monthly");
    if (savedEarned) setEarned(Number(savedEarned));
  }, []);

  const saveTarget = () => {
    const val = Number(editValue);
    if (!isNaN(val) && val > 0) {
      setTarget(val);
      localStorage.setItem("gigsarthi_target", val.toString());
      localStorage.setItem("gigsarthi_target_type", targetType);
    }
    setIsEditing(false);
  };

  // Simulate some earnings going up randomly (just for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setEarned((prev) => {
        const next = prev + Math.floor(Math.random() * 50);
        localStorage.setItem("gigsarthi_earned", next.toString());
        return next;
      });
    }, 60000); // every minute add a bit
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min((earned / target) * 100, 100);
  const remaining = Math.max(target - earned, 0);
  const daysLeft = targetType === "monthly" ? 30 - new Date().getDate() : 7 - new Date().getDay();
  const requiredPerDay = daysLeft > 0 ? (remaining / daysLeft).toFixed(0) : remaining;

  return (
    <div className="glass-panel border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Income Target
        </h3>
        <select
          value={targetType}
          onChange={(e) => {
            setTargetType(e.target.value as "weekly" | "monthly");
            localStorage.setItem("gigsarthi_target_type", e.target.value);
          }}
          className="bg-white/5 border border-white/10 text-xs px-2 py-1 rounded-md text-muted-foreground outline-none"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-muted-foreground">₹</span>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-transparent border-b border-primary/50 text-2xl font-bold text-foreground w-28 outline-none"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveTarget()}
              />
              <button onClick={saveTarget} className="text-primary hover:text-primary/80"><Check className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="text-3xl font-bold text-foreground">₹{target.toLocaleString()}</span>
              <button
                onClick={() => { setEditValue(target.toString()); setIsEditing(true); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <span className="text-sm text-primary font-medium">{progress.toFixed(1)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-muted-foreground text-xs mb-1">Earned So Far</p>
          <p className="font-semibold text-foreground flex items-center gap-1">
            ₹{earned.toLocaleString()} <TrendingUp className="w-3 h-3 text-green-400" />
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-muted-foreground text-xs mb-1">Remaining</p>
          <p className="font-semibold text-foreground">₹{remaining.toLocaleString()}</p>
        </div>
      </div>

      {remaining > 0 && (
        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            You need to earn approx. <strong className="text-foreground">₹{requiredPerDay}</strong> per day for the next <strong className="text-foreground">{daysLeft} days</strong> to hit your target.
          </p>
        </div>
      )}
      
      {remaining <= 0 && (
        <div className="mt-4 flex items-start gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <Target className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Target achieved! Great job. Consider setting a new stretch goal.</p>
        </div>
      )}
    </div>
  );
}
