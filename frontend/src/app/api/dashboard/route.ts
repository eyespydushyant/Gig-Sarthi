import { NextRequest, NextResponse } from "next/server";
import { getWeather, checkHoliday, estimateTrafficLevel, getTimeOfDay, isWeekend } from "@/lib/apiHelpers";
import { predictIncome, demandForecast, workRecommendation } from "@/lib/aiEngine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Delhi";
    const hours_worked = parseFloat(searchParams.get("hours_worked") || "6");

    const [weather, holiday] = await Promise.all([getWeather(city), checkHoliday(city)]);
    const traffic_level = estimateTrafficLevel();
    const time_of_day = getTimeOfDay();
    const weekend = isWeekend();
    const wMain = weather.main.toLowerCase();

    const [incomeResult, demandResult, recommendResult] = await Promise.all([
      Promise.resolve(predictIncome({
        city, hours_worked,
        weather: wMain, traffic_level,
        is_holiday: holiday.is_holiday, is_weekend: weekend, time_of_day,
      })),
      Promise.resolve(demandForecast({
        city, weather: wMain, traffic_level,
        is_holiday: holiday.is_holiday, is_weekend: weekend, time_of_day,
      })),
      Promise.resolve(workRecommendation({
        city, weather: wMain, traffic_level,
        is_holiday: holiday.is_holiday, is_weekend: weekend, temperature: weather.temp,
      })),
    ]);

    // Generate 7-day earnings trend
    const baseEarning = incomeResult.predicted_earnings;
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIdx = new Date().getDay();
    const earningsTrend = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (todayIdx - (6 - i) + 7) % 7;
      const variation = 0.7 + Math.random() * 0.6;
      return {
        day: DAYS[dayIndex === 0 ? 6 : dayIndex - 1],
        earnings: Math.round(baseEarning * variation),
      };
    });

    return NextResponse.json({
      predicted_earnings: incomeResult.predicted_earnings,
      demand_level: demandResult.demand_level,
      demand_score: demandResult.demand_score,
      best_time: recommendResult.best_time,
      reason: recommendResult.reason,
      tips: recommendResult.tips,
      weather: {
        condition: weather.main,
        description: weather.description,
        temperature: weather.temp,
        humidity: weather.humidity,
      },
      holiday,
      traffic_level,
      city,
      hours_worked,
      earnings_trend: earningsTrend,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("dashboard error:", message);
    return NextResponse.json({ error: "Failed to load dashboard", details: message }, { status: 500 });
  }
}
