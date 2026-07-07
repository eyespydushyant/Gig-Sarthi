/**
 * Shared helpers for GigSarthi Next.js API routes
 * Replaces the Express backend utility functions
 */

export interface WeatherData {
  main: string;
  description: string;
  temp: number;
  humidity: number;
}

export interface HolidayData {
  is_holiday: boolean;
  holiday_name: string | null;
}

// --- Fetch live weather from WeatherAPI.com ---
export async function getWeather(city: string): Promise<WeatherData> {
  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    return { main: "Clear", description: "clear sky", temp: 30, humidity: 50 };
  }
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city + " India")}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) throw new Error(`WeatherAPI ${res.status}`);
    const data = await res.json();
    return {
      main: data.current.condition.text,
      description: data.current.condition.text,
      temp: data.current.temp_c,
      humidity: data.current.humidity,
    };
  } catch (err) {
    console.error("Weather API error:", err);
    return { main: "Clear", description: "clear sky", temp: 30, humidity: 50 };
  }
}

// --- Check holiday via Calendarific ---
export async function checkHoliday(city: string): Promise<HolidayData> {
  void city; // city unused but kept for API compatibility
  const key = process.env.CALENDARIFIC_API_KEY;
  if (!key) return { is_holiday: false, holiday_name: null };
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const url = `https://calendarific.com/api/v2/holidays?api_key=${key}&country=IN&year=${year}&month=${month}&day=${day}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hr
    if (!res.ok) throw new Error(`Calendarific ${res.status}`);
    const data = await res.json();
    const holidays = data?.response?.holidays ?? [];
    if (holidays.length > 0) return { is_holiday: true, holiday_name: holidays[0].name };
    return { is_holiday: false, holiday_name: null };
  } catch (err) {
    console.error("Holiday API error:", err);
    return { is_holiday: false, holiday_name: null };
  }
}

// --- Traffic estimate from current hour ---
export function estimateTrafficLevel(): string {
  const hour = new Date().getHours();
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) return "high";
  if ((hour >= 11 && hour <= 16) || (hour >= 21 && hour <= 23)) return "moderate";
  return "low";
}

// --- Time of day ---
export function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// --- Is weekend ---
export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}
