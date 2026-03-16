"""
GigSarthi AI Engine - FastAPI Service
Rule-based + lightweight ML-style predictions for gig worker earnings, demand, and work recommendations.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random

app = FastAPI(title="GigSarthi AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Base Rates (INR per hour) by city ---
CITY_BASE_RATES = {
    "delhi": 140,
    "mumbai": 160,
    "bangalore": 150,
    "hyderabad": 130,
    "chennai": 125,
    "kolkata": 120,
    "pune": 135,
    "jaipur": 115,
    "ahmedabad": 120,
    "lucknow": 110,
}
DEFAULT_BASE_RATE = 130

# --- Weather factors ---
WEATHER_FACTORS = {
    "rain": 1.30,
    "drizzle": 1.20,
    "thunderstorm": 1.40,
    "snow": 1.35,
    "mist": 1.10,
    "haze": 1.05,
    "fog": 1.15,
    "clouds": 1.05,
    "clear": 1.00,
    "sunny": 1.00,
}

# --- Traffic factors ---
TRAFFIC_FACTORS = {
    "low": 0.90,
    "moderate": 1.00,
    "high": 1.15,
    "very_high": 1.25,
}

# --- Pydantic Models ---

class IncomeRequest(BaseModel):
    city: str = "Delhi"
    hours_worked: float = 6
    weather: str = "clear"
    traffic_level: str = "moderate"
    is_holiday: bool = False
    is_weekend: bool = False
    time_of_day: Optional[str] = None  # "morning", "afternoon", "evening", "night"

class DemandRequest(BaseModel):
    city: str = "Delhi"
    weather: str = "clear"
    traffic_level: str = "moderate"
    is_holiday: bool = False
    is_weekend: bool = False
    time_of_day: str = "evening"
    temperature: Optional[float] = None

class RecommendationRequest(BaseModel):
    city: str = "Delhi"
    weather: str = "clear"
    traffic_level: str = "moderate"
    is_holiday: bool = False
    is_weekend: bool = False
    temperature: Optional[float] = None


# --- Helper Functions ---

def get_base_rate(city: str) -> float:
    return CITY_BASE_RATES.get(city.lower().strip(), DEFAULT_BASE_RATE)

def get_weather_factor(weather: str) -> float:
    return WEATHER_FACTORS.get(weather.lower().strip(), 1.0)

def get_traffic_factor(traffic: str) -> float:
    return TRAFFIC_FACTORS.get(traffic.lower().strip(), 1.0)

def get_time_factor(time_of_day: str) -> float:
    time_factors = {
        "morning": 1.10,
        "afternoon": 0.85,
        "evening": 1.25,
        "night": 1.15,
    }
    return time_factors.get(time_of_day.lower().strip() if time_of_day else "evening", 1.0)

def compute_demand_score(weather: str, traffic: str, is_holiday: bool, is_weekend: bool, time_of_day: str) -> int:
    """Compute demand score from 1-10."""
    score = 5  # base
    
    # Weather impact
    w = weather.lower().strip()
    if w in ("rain", "thunderstorm"):
        score += 3
    elif w in ("drizzle", "snow"):
        score += 2
    elif w in ("mist", "fog", "haze"):
        score += 1

    # Time impact
    t = time_of_day.lower().strip() if time_of_day else "evening"
    if t == "evening":
        score += 2
    elif t == "night":
        score += 1
    elif t == "morning":
        score += 1

    # Traffic impact
    tr = traffic.lower().strip()
    if tr in ("high", "very_high"):
        score += 1

    # Holiday / weekend
    if is_holiday:
        score += 2
    if is_weekend:
        score += 1

    return min(score, 10)


def get_best_time_window(weather: str, is_holiday: bool, is_weekend: bool) -> dict:
    """Determine the best working time window."""
    w = weather.lower().strip()
    
    if w in ("rain", "thunderstorm", "drizzle"):
        return {"best_time": "6PM – 10PM", "reason": f"High delivery demand due to {w} and evening peak hours"}
    elif is_holiday:
        return {"best_time": "11AM – 2PM, 6PM – 10PM", "reason": "Holiday boosts demand during lunch and dinner hours"}
    elif is_weekend:
        return {"best_time": "11AM – 1PM, 7PM – 11PM", "reason": "Weekend ordering peaks during lunch and late dinner"}
    elif w in ("clear", "sunny"):
        return {"best_time": "7PM – 10PM", "reason": "Standard evening peak for food and ride demand"}
    else:
        return {"best_time": "6PM – 10PM", "reason": "Evening hours typically have the highest gig demand"}


# --- API Endpoints ---

@app.get("/")
def health_check():
    return {"status": "ok", "service": "GigSarthi AI Engine"}


@app.post("/predict-income")
def predict_income(req: IncomeRequest):
    base_rate = get_base_rate(req.city)
    weather_factor = get_weather_factor(req.weather)
    traffic_factor = get_traffic_factor(req.traffic_level)
    time_factor = get_time_factor(req.time_of_day) if req.time_of_day else 1.0

    # Holiday and weekend bonuses
    holiday_bonus = 1.40 if req.is_holiday else 1.0
    weekend_bonus = 1.20 if req.is_weekend else 1.0

    # Core formula
    predicted_earnings = (
        req.hours_worked
        * base_rate
        * weather_factor
        * traffic_factor
        * time_factor
        * holiday_bonus
        * weekend_bonus
    )

    # Add slight randomness for realism (±5%)
    variance = random.uniform(0.95, 1.05)
    predicted_earnings *= variance

    predicted_earnings = round(predicted_earnings, 2)

    demand_score = compute_demand_score(
        req.weather, req.traffic_level, req.is_holiday, req.is_weekend,
        req.time_of_day or "evening"
    )

    return {
        "predicted_earnings": predicted_earnings,
        "currency": "INR",
        "city": req.city,
        "hours_worked": req.hours_worked,
        "demand_score": demand_score,
        "factors": {
            "base_rate": base_rate,
            "weather_factor": weather_factor,
            "traffic_factor": traffic_factor,
            "holiday_bonus": holiday_bonus,
            "weekend_bonus": weekend_bonus,
        }
    }


@app.post("/demand-forecast")
def demand_forecast(req: DemandRequest):
    demand_score = compute_demand_score(
        req.weather, req.traffic_level, req.is_holiday, req.is_weekend, req.time_of_day
    )

    if demand_score >= 8:
        demand_level = "Very High"
    elif demand_score >= 6:
        demand_level = "High"
    elif demand_score >= 4:
        demand_level = "Moderate"
    else:
        demand_level = "Low"

    best_time_info = get_best_time_window(req.weather, req.is_holiday, req.is_weekend)

    return {
        "demand_level": demand_level,
        "demand_score": demand_score,
        "best_time": best_time_info["best_time"],
        "reason": best_time_info["reason"],
        "city": req.city,
    }


@app.post("/work-recommendation")
def work_recommendation(req: RecommendationRequest):
    demand_score = compute_demand_score(
        req.weather, req.traffic_level, req.is_holiday, req.is_weekend, "evening"
    )
    best_time_info = get_best_time_window(req.weather, req.is_holiday, req.is_weekend)

    # Generate tips
    tips = []
    w = req.weather.lower().strip()
    if w in ("rain", "drizzle", "thunderstorm"):
        tips.append("Carry rain gear – delivery demand surges during bad weather")
    if req.is_holiday:
        tips.append("Holiday detected – expect 40% higher demand than usual")
    if req.is_weekend:
        tips.append("Weekends see 20% more orders, especially late-night")
    if demand_score >= 7:
        tips.append("High demand period – maximize your hours for peak earnings")
    if not tips:
        tips.append("Steady demand expected – focus on evening hours for best returns")

    return {
        "best_time": best_time_info["best_time"],
        "demand_score": demand_score,
        "reason": best_time_info["reason"],
        "tips": tips,
        "city": req.city,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
