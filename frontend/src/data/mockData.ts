// Types
export interface InsightData {
  title: string;
  value: string;
  subtitle?: string;
  iconType: "wallet" | "clock" | "activity";
  color: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
}

export interface DashboardMetrics {
  totalEarnings: number;
  bestTime: string;
  demandLevel: "Low" | "Moderate" | "High" | "Very High";
  demandScore: number;
  weatherCondition: string;
  weatherTemp: number;
}

export interface DailyTrend {
  day: string;
  earnings: number;
}

// Static fallback data (used when API is unavailable or loading initial state)
export const fallbackTrends: DailyTrend[] = [
  { day: "Mon", earnings: 1200 },
  { day: "Tue", earnings: 950 },
  { day: "Wed", earnings: 1400 },
  { day: "Thu", earnings: 1100 },
  { day: "Fri", earnings: 1800 },
  { day: "Sat", earnings: 2400 },
  { day: "Sun", earnings: 2100 },
];
