import { NextResponse } from "next/server";
import { getWeather, checkHoliday, estimateTrafficLevel, getTimeOfDay, isWeekend } from "@/lib/apiHelpers";
import { predictIncome } from "@/lib/aiEngine";

export async function POST(request: Request) {
  try {
    const { city = "Delhi", hours_worked = 6 } = await request.json();

    const [weather, holiday] = await Promise.all([getWeather(city), checkHoliday(city)]);
    const traffic_level = estimateTrafficLevel();
    const time_of_day = getTimeOfDay();

    const result = predictIncome({
      city,
      hours_worked: Number(hours_worked),
      weather: weather.main.toLowerCase(),
      traffic_level,
      is_holiday: holiday.is_holiday,
      is_weekend: isWeekend(),
      time_of_day,
    });

    return NextResponse.json({
      ...result,
      weather: { condition: weather.main, description: weather.description, temperature: weather.temp },
      holiday,
      traffic_level,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("predict-income error:", message);
    return NextResponse.json({ error: "Failed to predict income", details: message }, { status: 500 });
  }
}
