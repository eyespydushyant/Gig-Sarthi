"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, ShieldAlert, HeartPulse, Car, User, Send, CheckCircle } from "lucide-react";

const HELPLINES = [
  { name: "Police", number: "100", icon: "🚔", color: "text-blue-400" },
  { name: "Ambulance", number: "108", icon: "🚑", color: "text-red-400" },
  { name: "National Emergency", number: "112", icon: "🆘", color: "text-orange-400" },
  { name: "Women Helpline", number: "1091", icon: "🛡️", color: "text-pink-400" },
  { name: "Road Accident", number: "1073", icon: "🚗", color: "text-yellow-400" },
  { name: "CRPF", number: "14411", icon: "🪖", color: "text-green-400" },
];

const INCIDENT_TYPES = [
  { id: "accident", label: "Road Accident", icon: Car, color: "text-yellow-400 border-yellow-400/30" },
  { id: "medical", label: "Medical Emergency", icon: HeartPulse, color: "text-red-400 border-red-400/30" },
  { id: "harassment", label: "Harassment / Assault", icon: ShieldAlert, color: "text-orange-400 border-orange-400/30" },
  { id: "theft", label: "Theft / Robbery", icon: AlertTriangle, color: "text-purple-400 border-purple-400/30" },
];

export default function EmergencyPage() {
  const [incident, setIncident] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident) return;
    const report = { incident, description, timestamp: new Date().toISOString() };
    const prev = JSON.parse(localStorage.getItem("emergencyReports") || "[]");
    localStorage.setItem("emergencyReports", JSON.stringify([report, ...prev]));
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setIncident(""); setDescription(""); }, 3000);
  };

  return (
    <main className="min-h-screen pb-20 relative bg-background">
      <div className="fixed inset-0 -z-10 bg-mesh-blue pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 text-sm text-red-400 font-medium mb-4">
            <AlertTriangle className="w-4 h-4" /> Safety & Emergency Hub
          </div>
          <h1 className="text-4xl font-bold text-foreground">Stay Safe. Get Help Fast.</h1>
          <p className="text-muted-foreground mt-2">One-tap access to emergency services. Your safety is our priority.</p>
        </div>

        {/* SOS Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={handleSOS}
            whileTap={{ scale: 0.95 }}
            className="relative w-44 h-44 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-3xl shadow-[0_0_60px_rgba(239,68,68,0.6)] transition-colors flex flex-col items-center justify-center gap-1"
          >
            {sosActive && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-500"
              />
            )}
            <span className="text-4xl">🆘</span>
            <span>{sosActive ? "CALLING..." : "SOS"}</span>
            <span className="text-sm font-normal opacity-80">Press for 112</span>
          </motion.button>
        </div>

        {/* Emergency Helplines */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Helplines</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {HELPLINES.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="glass-panel border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 transition-all group"
              >
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${h.color}`}>{h.name}</p>
                  <p className="text-lg font-bold text-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {h.number}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Report Incident */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Report an Incident
          </h2>
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm"
              >
                <CheckCircle className="w-4 h-4" /> Incident report saved successfully.
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Incident Type</label>
              <div className="grid grid-cols-2 gap-3">
                {INCIDENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setIncident(t.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                      incident === t.id
                        ? "bg-primary/10 border-primary text-primary"
                        : `bg-background/40 ${t.color} hover:bg-white/5`
                    }`}
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Details (optional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full bg-background/50 border border-muted-foreground/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-md px-4 py-2 transition-all outline-none resize-none text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!incident}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Report
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
