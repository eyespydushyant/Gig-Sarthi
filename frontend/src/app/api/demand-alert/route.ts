import { NextRequest, NextResponse } from "next/server";
import { getWeather, checkHoliday, estimateTrafficLevel, getTimeOfDay, isWeekend } from "@/lib/apiHelpers";
import { demandForecast } from "@/lib/aiEngine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Delhi";

    const [weather, holiday] = await Promise.all([getWeather(city), checkHoliday(city)]);
    const traffic_level = estimateTrafficLevel();
    const time_of_day = getTimeOfDay();

    const result = demandForecast({
      city,
      weather: weather.main.toLowerCase(),
      traffic_level,
      is_holiday: holiday.is_holiday,
      is_weekend: isWeekend(),
      time_of_day,
      temperature: weather.temp,
    });

    return NextResponse.json({
      ...result,
      weather: { condition: weather.main, temperature: weather.temp },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("demand-alert error:", message);
    return NextResponse.json({ error: "Failed to get demand alert", details: message }, { status: 500 });
  }
}
