import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDemandColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "very high":
      return "text-red-400";
    case "high":
      return "text-orange-400";
    case "moderate":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
}

export function getDemandBg(level: string): string {
  switch (level?.toLowerCase()) {
    case "very high":
      return "bg-red-500/10 border-red-500/30";
    case "high":
      return "bg-orange-500/10 border-orange-500/30";
    case "moderate":
      return "bg-yellow-500/10 border-yellow-500/30";
    case "low":
      return "bg-green-500/10 border-green-500/30";
    default:
      return "bg-gray-500/10 border-gray-500/30";
  }
}

export function getWeatherEmoji(condition: string): string {
  const c = condition?.toLowerCase() || "";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "🌫️";
  return "☀️";
}
