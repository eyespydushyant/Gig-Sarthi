import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PredictionFormProps {
  city: string;
  setCity: (city: string) => void;
  hoursWorked: string;
  setHoursWorked: (hours: string) => void;
  onDemandAlert: () => void;
  loadingApi: string | null;
}

import { useRouter } from "next/navigation";

export function PredictionForm({
  city,
  setCity,
  hoursWorked,
  setHoursWorked,
  onDemandAlert,
  loadingApi,
}: PredictionFormProps) {
  const router = useRouter();

  const handlePredictRoute = () => {
    if (!city) return;
    router.push(`/dashboard?city=${encodeURIComponent(city)}&hours=${encodeURIComponent(hoursWorked || "8")}`);
  };
  return (
    <Card className="glass-panel border-primary/20 shadow-2xl relative overflow-hidden max-w-2xl mx-auto text-left">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <CardContent className="p-8 relative z-10 grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">City</label>
            <input
              type="text"
              className="w-full bg-background/50 border border-muted-foreground/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-md px-4 py-2 transition-all outline-none"
              placeholder="e.g., Delhi, Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Planned Hours</label>
            <input
              type="number"
              className="w-full bg-background/50 border border-muted-foreground/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-md px-4 py-2 transition-all outline-none"
              placeholder="e.g., 8"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              min="1"
              max="24"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <Button
            onClick={handlePredictRoute}
            disabled={loadingApi !== null || !city}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all col-span-1 md:col-span-2 py-6 text-lg"
          >
            Launch Dashboard
          </Button>
          <Button
            variant="secondary"
            disabled={loadingApi !== null}
            loading={loadingApi === "time"}
            className="hidden w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
          >
            Best Time
          </Button>
          <Button
            variant="outline"
            onClick={onDemandAlert}
            disabled={loadingApi !== null}
            loading={loadingApi === "demand"}
            className="w-full border-muted-foreground/30 hover:bg-muted/50 hover:text-foreground transition-all"
          >
            Quick Demand Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
