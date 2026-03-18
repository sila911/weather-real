import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = async (city, units = 'metric') => {
  try {
    // 1. Fetch Current Weather
    const currentRes = await axios.get(`${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`);

    // 2. Fetch 5-Day Forecast
    const forecastRes = await axios.get(`${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`);

    // Filter to get Morning (06:00), Noon (12:00), and Evening (18:00) data for each day
    const dailyForecast = forecastRes.data.list.filter(f =>
      f.dt_txt.includes("06:00:00") ||
      f.dt_txt.includes("12:00:00") ||
      f.dt_txt.includes("18:00:00")
    );

    return {
      current: currentRes.data,
      forecast: dailyForecast,
      fullForecast: forecastRes.data.list,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

const getCitySuggestions = async (query) => {
  try {
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};

const getCityByCoords = async (lat, lon) => {
  try {
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
    if (res.data && res.data.length > 0) {
      return res.data[0].name;
    }
    return 'Phnom Penh'; // Fallback if no local city is found
  } catch (error) {
    console.error("Error fetching city by coords:", error);
    return 'Phnom Penh';
  }
};

export default { getWeatherData, getCitySuggestions, getCityByCoords };