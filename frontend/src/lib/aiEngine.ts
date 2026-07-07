/**
 * GigSarthi AI Engine — TypeScript port of the Python rule-based prediction logic.
 * Replaces the Python FastAPI service for Vercel serverless deployment.
 */

// --- Base Rates (INR per hour) by city ---
const CITY_BASE_RATES: Record<string, number> = {
  delhi: 140, mumbai: 160, bangalore: 150, hyderabad: 130, chennai: 125,
  kolkata: 120, pune: 135, jaipur: 115, ahmedabad: 120, lucknow: 110,
  surat: 118, bhopal: 108, nagpur: 112, indore: 115, vadodara: 118,
  chandigarh: 125, coimbatore: 115, kochi: 130, visakhapatnam: 118,
  patna: 100, agra: 108, nashik: 115, rajkot: 110, meerut: 105, faridabad: 118,
};
const DEFAULT_BASE_RATE = 130;

// --- Weather factors ---
const WEATHER_FACTORS: Record<string, number> = {
  rain: 1.30, drizzle: 1.20, thunderstorm: 1.40, snow: 1.35,
  mist: 1.10, haze: 1.05, fog: 1.15, clouds: 1.05,
  clear: 1.00, sunny: 1.00, overcast: 1.05, "partly cloudy": 1.02,
};

// --- Traffic factors ---
const TRAFFIC_FACTORS: Record<string, number> = {
  low: 0.90, moderate: 1.00, high: 1.15, very_high: 1.25,
};

function getBaseRate(city: string): number {
  return CITY_BASE_RATES[city.toLowerCase().trim()] ?? DEFAULT_BASE_RATE;
}

function getWeatherFactor(weather: string): number {
  const w = weather.toLowerCase().trim();
  // Partial match for multi-word conditions like "Partly Cloudy"
  for (const [key, val] of Object.entries(WEATHER_FACTORS)) {
    if (w.includes(key)) return val;
  }
  return 1.0;
}

function getTrafficFactor(traffic: string): number {
  return TRAFFIC_FACTORS[traffic.toLowerCase().trim()] ?? 1.0;
}

function getTimeFactor(timeOfDay: string | undefined): number {
  const factors: Record<string, number> = {
    morning: 1.10, afternoon: 0.85, evening: 1.25, night: 1.15,
  };
  return factors[(timeOfDay ?? "evening").toLowerCase().trim()] ?? 1.0;
}

export function computeDemandScore(
  weather: string,
  traffic: string,
  isHoliday: boolean,
  isWeekend: boolean,
  timeOfDay: string
): number {
  let score = 5;
  const w = weather.toLowerCase().trim();
  if (w.includes("rain") || w.includes("thunderstorm")) score += 3;
  else if (w.includes("drizzle") || w.includes("snow")) score += 2;
  else if (w.includes("mist") || w.includes("fog") || w.includes("haze")) score += 1;

  const t = (timeOfDay || "evening").toLowerCase().trim();
  if (t === "evening") score += 2;
  else if (t === "night" || t === "morning") score += 1;

  const tr = traffic.toLowerCase().trim();
  if (tr === "high" || tr === "very_high") score += 1;

  if (isHoliday) score += 2;
  if (isWeekend) score += 1;

  return Math.min(score, 10);
}

export function getBestTimeWindow(
  weather: string,
  isHoliday: boolean,
  isWeekend: boolean
): { best_time: string; reason: string } {
  const w = weather.toLowerCase().trim();
  if (w.includes("rain") || w.includes("thunderstorm") || w.includes("drizzle")) {
    return { best_time: "6PM – 10PM", reason: `High delivery demand due to ${w} and evening peak hours` };
  }
  if (isHoliday) {
    return { best_time: "11AM – 2PM, 6PM – 10PM", reason: "Holiday boosts demand during lunch and dinner hours" };
  }
  if (isWeekend) {
    return { best_time: "11AM – 1PM, 7PM – 11PM", reason: "Weekend ordering peaks during lunch and late dinner" };
  }
  if (w.includes("clear") || w.includes("sunny")) {
    return { best_time: "7PM – 10PM", reason: "Standard evening peak for food and ride demand" };
  }
  return { best_time: "6PM – 10PM", reason: "Evening hours typically have the highest gig demand" };
}

export interface IncomeInput {
  city: string;
  hours_worked: number;
  weather: string;
  traffic_level: string;
  is_holiday: boolean;
  is_weekend: boolean;
  time_of_day?: string;
}

export function predictIncome(req: IncomeInput) {
  const baseRate = getBaseRate(req.city);
  const weatherFactor = getWeatherFactor(req.weather);
  const trafficFactor = getTrafficFactor(req.traffic_level);
  const timeFactor = getTimeFactor(req.time_of_day);
  const holidayBonus = req.is_holiday ? 1.40 : 1.0;
  const weekendBonus = req.is_weekend ? 1.20 : 1.0;

  const variance = 0.95 + Math.random() * 0.10; // ±5%
  const predictedEarnings = Math.round(
    req.hours_worked * baseRate * weatherFactor * trafficFactor * timeFactor * holidayBonus * weekendBonus * variance
  );

  const demandScore = computeDemandScore(
    req.weather, req.traffic_level, req.is_holiday, req.is_weekend, req.time_of_day || "evening"
  );

  return {
    predicted_earnings: predictedEarnings,
    currency: "INR",
    city: req.city,
    hours_worked: req.hours_worked,
    demand_score: demandScore,
    factors: {
      base_rate: baseRate,
      weather_factor: weatherFactor,
      traffic_factor: trafficFactor,
      holiday_bonus: holidayBonus,
      weekend_bonus: weekendBonus,
    },
  };
}

export interface DemandInput {
  city: string;
  weather: string;
  traffic_level: string;
  is_holiday: boolean;
  is_weekend: boolean;
  time_of_day: string;
  temperature?: number;
}

export function demandForecast(req: DemandInput) {
  const demandScore = computeDemandScore(req.weather, req.traffic_level, req.is_holiday, req.is_weekend, req.time_of_day);
  const demandLevel =
    demandScore >= 8 ? "Very High" :
    demandScore >= 6 ? "High" :
    demandScore >= 4 ? "Moderate" : "Low";
  const bestTimeInfo = getBestTimeWindow(req.weather, req.is_holiday, req.is_weekend);
  return { demand_level: demandLevel, demand_score: demandScore, ...bestTimeInfo, city: req.city };
}

export interface RecommendationInput {
  city: string;
  weather: string;
  traffic_level: string;
  is_holiday: boolean;
  is_weekend: boolean;
  temperature?: number;
}

export function workRecommendation(req: RecommendationInput) {
  const demandScore = computeDemandScore(req.weather, req.traffic_level, req.is_holiday, req.is_weekend, "evening");
  const bestTimeInfo = getBestTimeWindow(req.weather, req.is_holiday, req.is_weekend);
  const w = req.weather.toLowerCase().trim();
  const tips: string[] = [];
  if (w.includes("rain") || w.includes("drizzle") || w.includes("thunderstorm")) {
    tips.push("Carry rain gear – delivery demand surges during bad weather");
  }
  if (req.is_holiday) tips.push("Holiday detected – expect 40% higher demand than usual");
  if (req.is_weekend) tips.push("Weekends see 20% more orders, especially late-night");
  if (demandScore >= 7) tips.push("High demand period – maximize your hours for peak earnings");
  if (tips.length === 0) tips.push("Steady demand expected – focus on evening hours for best returns");

  return { best_time: bestTimeInfo.best_time, demand_score: demandScore, reason: bestTimeInfo.reason, tips, city: req.city };
}
