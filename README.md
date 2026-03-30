# Weather Dashboard

A modern weather dashboard built with React and Vite that shows live weather, forecast trends, and air quality for cities worldwide.

## Features

- Live current weather by city
- Search with debounced location suggestions
- Auto-detect default city from browser geolocation (with fallback)
- Forecast trend chart with filter modes: `24H`, `3 Days`, and `Week`
- Air Quality Index (AQI) with PM2.5 summary
- Favorites and recent searches persisted in `localStorage`
- Switchable visual themes (`Aurora`, `Noir`, `Sand`)
- Responsive glassmorphism UI for desktop and mobile

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS 4
- Recharts (forecast charts)
- Axios (API requests)
- OpenWeather APIs (`/weather`, `/forecast`, `/air_pollution`, geocoding)

## Prerequisites

- Node.js 18+
- npm 9+
- OpenWeather API key

## Environment Variables

Create a `.env` file in the project root:

You can copy `.env.exsample` and rename it to `.env`, then add your API key.

```env
VITE_WEATHER_API_KEY=your_openweather_api_key
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the URL shown in terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Run app in development mode
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```text
weather/
├── .env.exsample
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CurrentWeather.jsx
│   │   ├── Forecast.jsx
│   │   ├── MetricCard.jsx
│   │   └── SearchBar.jsx
│   ├── services/
│   │   └── weatherService.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Notes

- If geolocation permission is denied, the app falls back to `Phnom Penh`.
- Forecast and AQI data come from OpenWeather and require a valid API key.
