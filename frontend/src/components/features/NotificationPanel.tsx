"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Droplet, Coffee, AlertTriangle, ShieldCheck } from "lucide-react";

interface Notification {
  id: string;
  type: "health" | "alert" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1", type: "system", title: "Welcome to GigSarthi",
    message: "Your AI predictions are active. Drive safe!",
    time: "Just now", read: false
  }
];

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [hasUnread, setHasUnread] = useState(true);

  // Simulate incoming health alerts
  useEffect(() => {
    // Hydration alert every 2 minutes (for demo purposes)
    const waterInterval = setInterval(() => {
      addNotification({
        id: Math.random().toString(), type: "health",
        title: "Hydration Check 💧",
        message: "It's been a while. Remember to drink some water to stay hydrated!",
        time: "Just now", read: false
      });
    }, 120000);

    // Break alert every 5 minutes (for demo purposes)
    const breakInterval = setInterval(() => {
      addNotification({
        id: Math.random().toString(), type: "health",
        title: "Take a Break ☕",
        message: "You've been active for half your shift. A 10-minute break improves focus and safety.",
        time: "Just now", read: false
      });
    }, 300000);

    return () => { clearInterval(waterInterval); clearInterval(breakInterval); };
  }, []);

  const addNotification = (n: Notification) => {
    setNotifications(prev => [n, ...prev]);
    setHasUnread(true);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasUnread(false);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "health": return <Droplet className="w-5 h-5 text-blue-400" />;
      case "alert": return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <ShieldCheck className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <>
      {/* Floating Bell Button */}
      <button
        onClick={() => { setIsOpen(true); setHasUnread(false); }}
        className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground p-3.5 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-transform hover:scale-105"
      >
        <Bell className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-background rounded-full animate-pulse" />
        )}
      </button>

      {/* Slide-in Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-3 flex justify-between items-center bg-white/5 border-b border-white/5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {notifications.length} Alerts
                </span>
                {notifications.some(n => !n.read) && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                    Mark all as read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
                    <Bell className="w-12 h-12 mb-3 stroke-1" />
                    <p>You're all caught up!</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative group bg-white/5 border rounded-xl p-4 transition-all ${
                          n.read ? "border-white/5 opacity-70" : "border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.1)] bg-primary/5"
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-semibold ${n.read ? "text-foreground" : "text-primary"}`}>{n.title}</h4>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
