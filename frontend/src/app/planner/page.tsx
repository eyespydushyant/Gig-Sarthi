"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Plus, Trash2, CheckSquare, Square, CalendarDays, ListTodo, TrendingUp } from "lucide-react";

// ─── Types ──────────────────────────────────────────────
interface Shift {
  id: string;
  date: string;
  city: string;
  hours: string;
  estimatedEarnings?: number;
}

interface Task {
  id: string;
  text: string;
  category: "pre-shift" | "maintenance" | "financial";
  done: boolean;
}

const TASK_CATEGORIES: { id: Task["category"]; label: string; color: string }[] = [
  { id: "pre-shift", label: "Pre-Shift", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "maintenance", label: "Maintenance", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  { id: "financial", label: "Financial", color: "bg-green-500/20 text-green-300 border-green-500/30" },
];

const CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Lucknow", "Surat",
];

const uid = () => Math.random().toString(36).slice(2);

// ─── Helpers ─────────────────────────────────────────────
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// ─── Component ───────────────────────────────────────────
export default function PlannerPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);

  // Shifts
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [newCity, setNewCity] = useState("Delhi");
  const [newHours, setNewHours] = useState("8");
  const [estimating, setEstimating] = useState(false);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState<Task["category"]>("pre-shift");

  // Load persisted data
  useEffect(() => {
    const s = localStorage.getItem("gigsarthi_shifts");
    const t = localStorage.getItem("gigsarthi_tasks");
    if (s) setShifts(JSON.parse(s));
    if (t) setTasks(JSON.parse(t));
  }, []);

  const saveShifts = (data: Shift[]) => {
    setShifts(data);
    localStorage.setItem("gigsarthi_shifts", JSON.stringify(data));
  };
  const saveTasks = (data: Task[]) => {
    setTasks(data);
    localStorage.setItem("gigsarthi_tasks", JSON.stringify(data));
  };

  // Add shift with AI earnings estimate
  const addShift = useCallback(async () => {
    setEstimating(true);
    let estimated: number | undefined;
    try {
      const res = await axios.post("/api/predict-income", {
        city: newCity, hours_worked: Number(newHours),
      });
      estimated = res.data.predicted_earnings;
    } catch {
      estimated = undefined;
    }
    const shift: Shift = { id: uid(), date: selectedDate, city: newCity, hours: newHours, estimatedEarnings: estimated };
    saveShifts([shift, ...shifts]);
    setEstimating(false);
  }, [newCity, newHours, selectedDate, shifts]);

  const removeShift = (id: string) => saveShifts(shifts.filter((s) => s.id !== id));

  // Tasks
  const addTask = () => {
    if (!newTask.trim()) return;
    saveTasks([{ id: uid(), text: newTask.trim(), category: newCategory, done: false }, ...tasks]);
    setNewTask("");
  };
  const toggleTask = (id: string) => saveTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: string) => saveTasks(tasks.filter((t) => t.id !== id));

  // Calendar helpers
  const firstDay = firstDayOfMonth(viewYear, viewMonth);
  const totalDays = daysInMonth(viewYear, viewMonth);
  const calDate = (day: number) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const hasShift = (day: number) => shifts.some((s) => s.date === calDate(day));
  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const selectedShifts = shifts.filter((s) => s.date === selectedDate);
  const totalEstimated = selectedShifts.reduce((sum, s) => sum + (s.estimatedEarnings || 0), 0);

  return (
    <main className="min-h-screen pb-20 relative bg-background">
      <div className="fixed inset-0 -z-10 bg-mesh-blue pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-3">
            <CalendarDays className="w-4 h-4" /> Shift Planner & Task Manager
          </div>
          <h1 className="text-4xl font-bold text-foreground">Plan. Earn. Achieve.</h1>
          <p className="text-muted-foreground mt-1">Schedule your shifts and manage your daily tasks in one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Calendar ── */}
          <div className="lg:col-span-2 glass-panel border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">‹</button>
              <h2 className="text-base font-semibold text-foreground">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(firstDay === 0 ? 6 : firstDay - 1).fill(null).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                const dStr = calDate(day);
                const isToday = dStr === today.toISOString().split("T")[0];
                const isSelected = dStr === selectedDate;
                const hasS = hasShift(day);
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dStr)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                      ${isSelected ? "bg-primary text-primary-foreground font-bold shadow-[0_0_12px_rgba(14,165,233,0.4)]"
                        : isToday ? "bg-white/10 text-foreground font-semibold border border-primary/40"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                  >
                    {day}
                    {hasS && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-green-400" />}
                  </button>
                );
              })}
            </div>

            {/* Shift Planner for selected date */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Shift for {selectedDate}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="bg-background/50 border border-muted-foreground/30 text-foreground rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary/50"
                >
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  min={1} max={24}
                  className="w-20 bg-background/50 border border-muted-foreground/30 text-foreground rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary/50"
                  placeholder="hrs"
                />
                <button
                  onClick={addShift}
                  disabled={estimating}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-md transition-all disabled:opacity-60"
                >
                  <Plus className="w-4 h-4" /> {estimating ? "Estimating..." : "Add Shift"}
                </button>
              </div>

              {selectedShifts.length > 0 ? (
                <div className="space-y-2">
                  {selectedShifts.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.city} — {s.hours}h</p>
                        {s.estimatedEarnings && <p className="text-xs text-primary">Est. ₹{s.estimatedEarnings.toFixed(0)}</p>}
                      </div>
                      <button onClick={() => removeShift(s.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {totalEstimated > 0 && (
                    <p className="text-sm text-right text-muted-foreground">
                      Total estimate: <strong className="text-primary">₹{totalEstimated.toFixed(0)}</strong>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No shifts planned. Add one above.</p>
              )}
            </div>
          </div>

          {/* ── Task Board ── */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-primary" /> Task Manager
            </h2>

            {/* Add task */}
            <div className="space-y-2">
              <input
                type="text"
                value={newTask}
                placeholder="Add a task..."
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="w-full bg-background/50 border border-muted-foreground/30 focus:border-primary/50 text-foreground rounded-md px-3 py-2 text-sm outline-none transition-all"
              />
              <div className="flex gap-2 items-center">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Task["category"])}
                  className="flex-1 bg-background/50 border border-muted-foreground/30 text-foreground rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary/50"
                >
                  {TASK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <button onClick={addTask} className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md text-sm transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task list grouped by category */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[460px] pr-1">
              {TASK_CATEGORIES.map((cat) => {
                const catTasks = tasks.filter((t) => t.category === cat.id);
                if (catTasks.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-2 ${cat.color}`}>{cat.label}</span>
                    <div className="space-y-1.5">
                      {catTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2 group">
                          <button onClick={() => toggleTask(task.id)} className="text-primary flex-shrink-0">
                            {task.done ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                          </button>
                          <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.text}</span>
                          <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center pt-8">No tasks yet. Add one above!</p>}
            </div>

            <div className="border-t border-white/10 pt-3 text-xs text-muted-foreground flex justify-between">
              <span>{tasks.filter(t => t.done).length}/{tasks.length} completed</span>
              {tasks.some(t => t.done) && (
                <button onClick={() => saveTasks(tasks.filter(t => !t.done))} className="hover:text-red-400 transition-colors">Clear done</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
