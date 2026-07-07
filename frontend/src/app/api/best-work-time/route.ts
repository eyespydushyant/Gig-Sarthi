import { NextRequest, NextResponse } from "next/server";
import { getWeather, checkHoliday, estimateTrafficLevel, isWeekend } from "@/lib/apiHelpers";
import { workRecommendation } from "@/lib/aiEngine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Delhi";

    const [weather, holiday] = await Promise.all([getWeather(city), checkHoliday(city)]);
    const traffic_level = estimateTrafficLevel();

    const result = workRecommendation({
      city,
      weather: weather.main.toLowerCase(),
      traffic_level,
      is_holiday: holiday.is_holiday,
      is_weekend: isWeekend(),
      temperature: weather.temp,
    });

    return NextResponse.json({
      ...result,
      weather: { condition: weather.main, temperature: weather.temp },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("best-work-time error:", message);
    return NextResponse.json({ error: "Failed to get work time recommendation", details: message }, { status: 500 });
  }
}
