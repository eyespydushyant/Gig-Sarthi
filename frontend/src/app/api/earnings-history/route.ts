import { NextRequest, NextResponse } from "next/server";

const CITY_BASE_RATES: Record<string, number> = {
  delhi: 140, mumbai: 160, bangalore: 150, hyderabad: 130, chennai: 125,
  kolkata: 120, pune: 135, jaipur: 115, ahmedabad: 120, lucknow: 110,
  surat: 118, bhopal: 108, nagpur: 112, indore: 115, vadodara: 118,
  chandigarh: 125, coimbatore: 115, kochi: 130, visakhapatnam: 118,
  patna: 100, agra: 108, nashik: 115, rajkot: 110, meerut: 105, faridabad: 118,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = (searchParams.get("city") || "Delhi").toLowerCase();
    const baseRate = CITY_BASE_RATES[city] || 130;
    const today = new Date();
    const history = [];

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendBoost = isWeekend ? 1.2 : 1.0;
      const variance = 0.7 + Math.random() * 0.7;
      const earnings = Math.round(baseRate * 8 * weekendBoost * variance);
      const level = earnings < baseRate * 6 ? "low" : earnings > baseRate * 9.5 ? "high" : "medium";
      history.push({ date: d.toISOString().split("T")[0], earnings, level });
    }

    return NextResponse.json({ city, history });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("earnings-history error:", message);
    return NextResponse.json({ error: "Failed to load history", details: message }, { status: 500 });
  }
}
