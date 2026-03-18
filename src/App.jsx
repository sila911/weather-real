import React, { useState, useEffect } from 'react';
import weatherService from './services/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

function App() {
  const [city, setCity] = useState('');
  const [defaultCity, setDefaultCity] = useState('Phnom Penh');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cityName = await weatherService.getCityByCoords(latitude, longitude);
          setDefaultCity(cityName);
          setCity(cityName);
        },
        (error) => {
          console.error("Error getting location", error);
          setCity('Phnom Penh'); // Fallback if user denies permission
        }
      );
    } else {
      setCity('Phnom Penh');
    }
  }, []);

  useEffect(() => {
    if (!city) return; // Prevent fetching before location is determined
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherService.getWeatherData(city, unit);
        setWeather(data);
      } catch (err) {
        setError("City not found. Please try again.");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city, unit]);

  // Dynamic Background Logic
  const getBgGradient = () => {
    if (!weather) return 'from-blue-500 to-purple-600';

    const main = weather.current.weather[0].main;
    const icon = weather.current.weather[0].icon;
    const isNight = icon.endsWith('n');

    // Darker themes for night time
    if (isNight) {
      if (main === 'Clear') return 'from-gray-800 to-blue-950';
      if (main === 'Clouds') return 'from-slate-800 to-gray-900';
      if (main === 'Rain' || main === 'Drizzle') return 'from-slate-900 to-blue-950';
      if (main === 'Thunderstorm') return 'from-gray-900 to-black';
      if (main === 'Snow') return 'from-slate-700 to-gray-900';
      return 'from-gray-800 to-slate-900';
    }

    // Vibrant themes for day time
    switch (main) {
      case 'Clear':
        return 'from-amber-400 to-orange-500';
      case 'Clouds':
        return 'from-sky-400 to-slate-400';
      case 'Rain':
      case 'Drizzle':
        return 'from-indigo-600 to-slate-700';
      case 'Thunderstorm':
        return 'from-slate-700 to-gray-900';
      case 'Snow':
        return 'from-blue-300 to-cyan-500';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Dust':
      case 'Fog':
      case 'Sand':
      case 'Ash':
      case 'Squall':
      case 'Tornado':
        return 'from-gray-400 to-slate-500';
      default:
        return 'from-sky-400 to-indigo-500';
    }
  };

  // Format the city name for the image search URL (e.g., "Phnom Penh" -> "Phnom+Penh")
  const bgCity = weather ? weather.current.name.replace(/ /g, '+') : 'city';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={{ backgroundImage: `url('https://source.unsplash.com/1920x1080/?${bgCity},landscape,city')` }}
    >
      {/* Dynamic Weather Color Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getBgGradient()} opacity-60 transition-all duration-1000`}></div>

      <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 text-white flex flex-col md:flex-row gap-8">

        {/* Left Side: Current Stats */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <SearchBar onSearch={setCity} onReset={() => setCity(defaultCity)} currentCity={city} defaultCity={defaultCity} />
          {loading ? (
            <div className="flex flex-1 items-center justify-center min-h-[200px]">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-[2rem] text-center animate-fade-in mt-4 flex flex-col items-center gap-4">
              <p className="text-red-100 font-medium text-lg">{error}</p>
              <button
                onClick={() => setCity(defaultCity)}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 transition-all rounded-full text-white text-sm font-semibold shadow-md"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            weather && <CurrentWeather data={weather.current} unit={unit} />
          )}
        </div>

        {/* Right Side: Forecast */}
        <div className="md:w-2/3">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            !error && weather && <Forecast items={weather.fullForecast} />
          )}
        </div>

      </div>
    </div>
  );
}

export default App;