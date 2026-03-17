"use client";

import { useState } from "react";
import { ExternalLink, CheckCircle2, Shield, Heart, Zap } from "lucide-react";
import { INSURANCE_SCHEMES, InsuranceScheme } from "@/data/insuranceSchemes";

const FILTERS = [
  { id: "all", label: "All Schemes" },
  { id: "health", label: "Health" },
  { id: "life", label: "Life" },
  { id: "accident", label: "Accident" },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  health: <Heart className="w-4 h-4 text-red-400" />,
  life: <Zap className="w-4 h-4 text-yellow-400" />,
  accident: <Shield className="w-4 h-4 text-blue-400" />,
};

export default function InsurancePage() {
  const [filter, setFilter] = useState("all");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const filtered = INSURANCE_SCHEMES.filter(
    (s) => filter === "all" || s.type === filter
  );

  const eligible = (s: InsuranceScheme) =>
    !monthlyIncome || Number(monthlyIncome) <= s.maxIncomeMonthly;

  return (
    <main className="min-h-screen pb-20 relative bg-background">
      <div className="fixed inset-0 -z-10 bg-mesh-blue pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-4">
            <Shield className="w-4 h-4" /> Insurance & Benefits
          </div>
          <h1 className="text-4xl font-bold text-foreground">Health Insurance for Gig Workers</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Discover government schemes you qualify for and secure your future with the right coverage.
          </p>
        </div>

        {/* Eligibility Calculator */}
        <div className="glass-panel border border-primary/20 rounded-2xl p-6 mb-8">
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Eligibility Checker
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="Enter your monthly income (₹)"
              className="flex-1 bg-background/50 border border-muted-foreground/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-md px-4 py-2 outline-none transition-all"
            />
            <span className="text-sm text-muted-foreground">
              {monthlyIncome
                ? `Showing ${filtered.filter(eligible).length} eligible scheme(s)`
                : "Enter income to filter eligible schemes"}
            </span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === f.id
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                  : "bg-background/40 text-muted-foreground border-white/10 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((scheme) => {
            const isEligible = eligible(scheme);
            return (
              <div
                key={scheme.id}
                className={`glass-panel border rounded-2xl p-6 flex flex-col gap-4 transition-all ${
                  monthlyIncome && !isEligible
                    ? "opacity-40 border-white/5"
                    : "border-white/10 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{scheme.emoji}</span>
                      <span className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                        {scheme.govTag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{scheme.name}</h3>
                    <p className="text-xs text-muted-foreground">{scheme.fullName}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium bg-background/40 border border-white/10 rounded-lg px-2 py-1">
                    {TYPE_ICON[scheme.type]}
                    <span className="capitalize">{scheme.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Coverage</p>
                    <p className="font-semibold text-primary">{scheme.coverage}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Premium</p>
                    <p className="font-semibold text-foreground">{scheme.premium}</p>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {scheme.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">Eligibility:</span> {scheme.eligibility}
                  </p>
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all text-sm"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
