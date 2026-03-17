# GigSarthi – AI Assistant for Gig Workers

GigSarthi is a comprehensive, AI-powered platform designed to empower gig economy workers (delivery partners, ride-share drivers) in India. By predicting daily earnings, recommending optimal work hours, and broadcasting real-time demand alerts, GigSarthi allows workers to systematically maximize their income.

## 🚀 Features

*   **Income Prediction:** Forecasts potential earnings based on city dynamics, upcoming weather, traffic conditions, and local holidays.
*   **Best Work Window:** Offers smart, AI-driven recommendations on the best 3-hour blocks to maximize earnings.
*   **Live Demand Gauge:** Real-time 1-10 demand scoring system based on local logistics events.
*   **Analytics Dashboard:** A premium, "Stitch-designed" glassmorphism dashboard featuring responsive charts (recharts) and modern UI elements.

## 🏗️ Architecture Stack

GigSarthi uses a full-stack, decoupled architecture:

*   **Frontend (/frontend):** Next.js 14, React, Tailwind CSS, shadcn/ui.
*   **Backend Node API (/backend):** Express.js orchestrator that centralizes secure third-party API calls (Weather, Holidays).
*   **AI Engine (/ai-engine):** Python FastAPI service that processes logistics algorithms and evaluates real-time data to generate predictions.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/en) (v18+)
*   [Python](https://www.python.org/) (v3.10+)
*   A package manager like `npm` or `yarn`

## 🛠️ Local Development Setup

To get all three services running concurrently on your local machine:

### 1. Configure Environment Variables
You will need API keys for real-time weather and holiday mapping.

Create a `.env` file inside the `/backend` directory:
```bash
cd backend
touch .env
```
Paste the following into your new `backend/.env` file:
```ini
PORT=5000
AI_ENGINE_URL=http://localhost:8000
CALENDARIFIC_API_KEY=your_calendarific_key_here
WEATHER_API_KEY=your_weatherapi_key_here
```

### 2. Install Dependencies
Run the install command from the **root directory**. This will install the `concurrently` package, and recursively install dependencies for both the frontend and backend.
```bash
npm install
```

*(Optional: If the root install doesn't cascade cleanly, you may manually cd into `/frontend` and `/backend` and run `npm install` in each).*

For the Python AI Engine, make sure you install its dependencies:
```bash
cd ai-engine
pip install -r requirements.txt
```

### 3. Run the Platform
From the root directory, simply run:
```bash
npm run dev
```

This single command utilizes `concurrently` to spin up:
1.  **Frontend Next.js App** at `http://localhost:3000`
2.  **Node Express Server** at `http://localhost:5000`
3.  **Python FastAPI Engine** at `http://localhost:8000`

---

## 🎨 UI & Theming

The frontend was recently migrated to a premium **Blue/Cyan Glassmorphism Theme** based on Google's Stitch design tool.
All components reside in `frontend/src/components` and use a decoupled hook `useGigSarthiLive` for all API interactions.

## 🔒 Security Notes
*   **Do not commit `.env` files.** The `.gitignore` at the root of the repository ensures that `.env` keys are never pushed to version control.
*   Review `.env.example` (if applicable) for the keys needed.

## 🤝 Contributing
Feel free to open issues or submit PRs if you want to extend GigSarthi's AI models or frontend dashboard!
