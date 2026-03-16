/**
 * GigSarthi Backend - Express API Server
 * Orchestrates external API calls and forwards to Python AI engine
 */

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CALENDARIFIC_API_KEY = process.env.CALENDARIFIC_API_KEY;

// --- Helper: Fetch Weather from OpenWeatherMap ---
async function getWeather(city) {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.log("⚠️  No OpenWeather API key. Using fallback weather data.");
      return { main: "Clear", description: "clear sky", temp: 30, humidity: 50 };
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const res = await axios.get(url);
    const data = res.data;
    return {
      main: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
      humidity: data.main.humidity,
    };
  } catch (err) {
    console.error("Weather API error:", err.message);
    return { main: "Clear", description: "clear sky", temp: 30, humidity: 50 };
  }
}

// --- Helper: Check if today is a holiday (Calendarific) ---
async function checkHoliday(city) {
  try {
    if (!CALENDARIFIC_API_KEY) {
      console.log("⚠️  No Calendarific API key. Using fallback holiday data.");
      return { is_holiday: false, holiday_name: null };
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const url = `https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=IN&year=${year}&month=${month}&day=${day}`;
    const res = await axios.get(url);
    const holidays = res.data.response.holidays;
    if (holidays && holidays.length > 0) {
      return { is_holiday: true, holiday_name: holidays[0].name };
    }
    return { is_holiday: false, holiday_name: null };
  } catch (err) {
    console.error("Holiday API error:", err.message);
    return { is_holiday: false, holiday_name: null };
  }
}

// --- Helper: Estimate traffic level based on time ---
function estimateTrafficLevel() {
  const hour = new Date().getHours();
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    return "high";
  } else if ((hour >= 11 && hour <= 16) || (hour >= 21 && hour <= 23)) {
    return "moderate";
  }
  return "low";
}

// --- Helper: Get time of day ---
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// --- Helper: Check if weekend ---
function isWeekend() {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "GigSarthi Backend" });
});

// --- POST /api/predict-income ---
app.post("/api/predict-income", async (req, res) => {
  try {
    const { city = "Delhi", hours_worked = 6 } = req.body;

    // Fetch real-time data
    const [weather, holiday] = await Promise.all([
      getWeather(city),
      checkHoliday(city),
    ]);

    const traffic_level = estimateTrafficLevel();
    const time_of_day = getTimeOfDay();

    // Call AI engine
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/predict-income`, {
      city,
      hours_worked,
      weather: weather.main.toLowerCase(),
      traffic_level,
      is_holiday: holiday.is_holiday,
      is_weekend: isWeekend(),
      time_of_day,
    });

    res.json({
      ...aiResponse.data,
      weather: {
        condition: weather.main,
        description: weather.description,
        temperature: weather.temp,
      },
      holiday: holiday,
      traffic_level,
    });
  } catch (err) {
    console.error("predict-income error:", err.message);
    res.status(500).json({ error: "Failed to predict income", details: err.message });
  }
});

// --- GET /api/best-work-time ---
app.get("/api/best-work-time", async (req, res) => {
  try {
    const city = req.query.city || "Delhi";

    const [weather, holiday] = await Promise.all([
      getWeather(city),
      checkHoliday(city),
    ]);

    const traffic_level = estimateTrafficLevel();

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/work-recommendation`, {
      city,
      weather: weather.main.toLowerCase(),
      traffic_level,
      is_holiday: holiday.is_holiday,
      is_weekend: isWeekend(),
      temperature: weather.temp,
    });

    res.json({
      ...aiResponse.data,
      weather: {
        condition: weather.main,
        temperature: weather.temp,
      },
    });
  } catch (err) {
    console.error("best-work-time error:", err.message);
    res.status(500).json({ error: "Failed to get work time recommendation", details: err.message });
  }
});

// --- GET /api/demand-alert ---
app.get("/api/demand-alert", async (req, res) => {
  try {
    const city = req.query.city || "Delhi";

    const [weather, holiday] = await Promise.all([
      getWeather(city),
      checkHoliday(city),
    ]);

    const traffic_level = estimateTrafficLevel();
    const time_of_day = getTimeOfDay();

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/demand-forecast`, {
      city,
      weather: weather.main.toLowerCase(),
      traffic_level,
      is_holiday: holiday.is_holiday,
      is_weekend: isWeekend(),
      time_of_day,
      temperature: weather.temp,
    });

    res.json({
      ...aiResponse.data,
      weather: {
        condition: weather.main,
        temperature: weather.temp,
      },
    });
  } catch (err) {
    console.error("demand-alert error:", err.message);
    res.status(500).json({ error: "Failed to get demand alert", details: err.message });
  }
});

// --- GET /api/dashboard ---
app.get("/api/dashboard", async (req, res) => {
  try {
    const city = req.query.city || "Delhi";
    const hours_worked = parseFloat(req.query.hours_worked) || 6;

    // Fetch real-time data
    const [weather, holiday] = await Promise.all([
      getWeather(city),
      checkHoliday(city),
    ]);

    const traffic_level = estimateTrafficLevel();
    const time_of_day = getTimeOfDay();
    const weekend = isWeekend();

    // Call all AI endpoints in parallel
    const [incomeRes, demandRes, recommendRes] = await Promise.all([
      axios.post(`${AI_ENGINE_URL}/predict-income`, {
        city, hours_worked,
        weather: weather.main.toLowerCase(),
        traffic_level, is_holiday: holiday.is_holiday,
        is_weekend: weekend, time_of_day,
      }),
      axios.post(`${AI_ENGINE_URL}/demand-forecast`, {
        city,
        weather: weather.main.toLowerCase(),
        traffic_level, is_holiday: holiday.is_holiday,
        is_weekend: weekend, time_of_day,
      }),
      axios.post(`${AI_ENGINE_URL}/work-recommendation`, {
        city,
        weather: weather.main.toLowerCase(),
        traffic_level, is_holiday: holiday.is_holiday,
        is_weekend: weekend, temperature: weather.temp,
      }),
    ]);

    // Generate mock earnings trend (last 7 days with slight variations)
    const baseEarning = incomeRes.data.predicted_earnings;
    const earningsTrend = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      const variation = 0.7 + Math.random() * 0.6; // 70% to 130% of base
      earningsTrend.push({
        day: days[dayIndex === 0 ? 6 : dayIndex - 1],
        earnings: Math.round(baseEarning * variation),
      });
    }

    res.json({
      predicted_earnings: incomeRes.data.predicted_earnings,
      demand_level: demandRes.data.demand_level,
      demand_score: demandRes.data.demand_score,
      best_time: recommendRes.data.best_time,
      reason: recommendRes.data.reason,
      tips: recommendRes.data.tips,
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
  } catch (err) {
    console.error("dashboard error:", err.message);
    res.status(500).json({ error: "Failed to load dashboard", details: err.message });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 GigSarthi Backend running on http://localhost:${PORT}`);
  console.log(`🤖 AI Engine URL: ${AI_ENGINE_URL}`);
  console.log(`🌤️  Weather API: ${OPENWEATHER_API_KEY ? "Configured" : "Not configured (using fallback)"}`);
  console.log(`📅 Holiday API: ${CALENDARIFIC_API_KEY ? "Configured" : "Not configured (using fallback)"}`);
});
