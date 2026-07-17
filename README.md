# GigSarthi – AI Assistant for Gig Workers


GigSarthi is a comprehensive, AI-powered platform designed to empower gig economy workers (delivery partners, ride-share drivers) in India. By predicting daily earnings, recommending optimal work hours, broadcasting real-time demand alerts, and providing safety, insurance, and planning tools — GigSarthi helps workers systematically maximize their income and wellbeing.

## 🚀   Features---

### Core AI Predictions
- **Income Prediction**: Forecasts potential earnings based on city, hours worked, weather, traffic, and holidays.
- **Best Work Window**: AI-recommended 3-hour peak demand blocks per city.
- **Live Demand Gauge**: Real-time 1–10 demand scoring based on local logistics events.

### Analytics Dashboard
- **Income Target Tracker**: Set weekly or monthly earnings goals and track your progress and required daily run-rate dynamically.
- **City Quick-Select**: One-click chip buttons to instantly switch between 25+ major Indian cities.
- **Income Heatmap**: A GitHub contribution-style 52×7 grid heatmap showing historical income intensity (Low/Med/High) with hover tooltips for daily estimates.
- **Weather Impact Card**: Live temperature and conditions from WeatherAPI.com.
- **7-Day Earnings Trend**: Recharts bar chart with city-specific revenue forecasts.
- **Demand Gauge**: SVG-animated circular gauge with color-coded demand levels.
- **Sarthi Tips**: AI-generated actionable insights for maximizing earnings.

### Live Notifications Panel
- Global slide-in panel that delivers timely health alerts (e.g., hydration reminders, break suggestions) to keep gig workers safe and focused.

### Emergency SOS Section
- One-tap SOS button for reporting safety incidents.
- Incident type selector: Accident, Harassment, Medical, Theft.
- National helpline numbers (Police: 100, Ambulance: 112, Women: 1091).

### Health Insurance Guide
- Curated government scheme cards: PM-JAY, ESIC, PMSBY, PMJJBY.
- Eligibility calculator based on monthly income.
- Direct links to official government portals.

### Shift Planner & Task Manager
- Monthly calendar view for scheduling shifts.
- AI-estimated earnings preview per planned shift.
- Kanban-style task board: Pre-shift, Maintenance, Financial.
- Full `localStorage` persistence.

### Multi-Language Support
- Seamlessly switch between English, Hindi, Marathi, Bengali, Kannada, Telugu, Tamil, and Malayalam to access the app in your preferred language.

---

## 🏗️ Architecture Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend API** | Node.js + Express (orchestrates external API calls) |
| **AI Engine** | Python + FastAPI (rule-based prediction engine) |
| **Weather** | WeatherAPI.com (live temp, condition, humidity) |
| **Holidays** | Calendarific API (live Indian holiday detection) |
| **Charts** | Recharts |
| **Animations** | Framer Motion |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/en) v18+
- [Python](https://www.python.org/) v3.10+
- npm or yarn

---

## 🛠️ Local Development Setup

### 1. Configure Environment Variables

Create a `backend/.env` file:
```ini
PORT=5000
AI_ENGINE_URL=http://localhost:8000
WEATHER_API_KEY=your_weatherapi_key_here
CALENDARIFIC_API_KEY=your_calendarific_key_here
```

Get your API keys from:
- **WeatherAPI.com**: https://www.weatherapi.com/
- **Calendarific**: https://calendarific.com/

### 2. Install Dependencies

From the **root directory**:
```bash
npm install
```

For the Python AI Engine:
```bash
cd ai-engine
pip install -r requirements.txt
```

### 3. Run All Services

From the root directory:
```bash
npm run dev
```

This starts all three services concurrently:
| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000 |
| **AI Engine** | http://localhost:8000 |

---

## 🌆 Supported Cities

Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Jaipur, Ahmedabad, Lucknow, Surat, Bhopal, Nagpur, Indore, Vadodara, Chandigarh, Coimbatore, Kochi, Visakhapatnam, Patna, and more.

## 🔒 Security-

- **Never commit `.env` files** — the `.gitignore` protects all key files.
- See `.env.example` for the required variable names.

## 🤝 Contributing

Open an issue or submit a pull request to help extend GigSarthi's features! .
