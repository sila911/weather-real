import React, { useState, useEffect } from 'react';
import weatherService from './services/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

const STORAGE_KEYS = {
  favorites: 'weather_favorites',
  recents: 'weather_recent_searches',
  theme: 'weather_theme',
};

const THEMES = {
  aurora: { label: 'Aurora', chip: 'bg-cyan-300' },
  noir: { label: 'Noir', chip: 'bg-slate-700' },
  sand: { label: 'Sand', chip: 'bg-amber-300' },
};

const safeJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getThemeOverlay = (theme) => {
  if (theme === 'noir') return 'from-slate-950/90 via-slate-900/80 to-black/90';
  if (theme === 'sand') return 'from-amber-900/50 via-orange-700/35 to-zinc-900/75';
  return 'from-cyan-900/55 via-blue-900/45 to-indigo-950/80';
};

const getWeatherOverlay = (weather) => {
  if (!weather) return 'from-sky-500/35 to-indigo-800/35';
  const main = weather.current.weather[0].main;
  const icon = weather.current.weather[0].icon;
  const isNight = icon.endsWith('n');

  if (isNight) {
    if (main === 'Clear') return 'from-indigo-900/45 to-slate-950/60';
    if (main === 'Clouds') return 'from-slate-700/45 to-gray-950/60';
    if (main === 'Rain' || main === 'Drizzle') return 'from-blue-900/50 to-slate-950/65';
    if (main === 'Thunderstorm') return 'from-zinc-700/55 to-black/75';
    if (main === 'Snow') return 'from-sky-700/45 to-slate-900/60';
    return 'from-gray-800/45 to-slate-950/60';
  }

  switch (main) {
    case 'Clear':
      return 'from-amber-300/35 to-orange-500/45';
    case 'Clouds':
      return 'from-sky-300/25 to-slate-500/45';
    case 'Rain':
    case 'Drizzle':
      return 'from-blue-500/35 to-indigo-800/55';
    case 'Thunderstorm':
      return 'from-violet-700/35 to-slate-900/70';
    case 'Snow':
      return 'from-cyan-200/30 to-blue-400/35';
    default:
      return 'from-sky-400/30 to-indigo-600/45';
  }
};

function App() {
  const [city, setCity] = useState('');
  const [defaultCity, setDefaultCity] = useState('Phnom Penh');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unit = 'metric';
  const [favorites, setFavorites] = useState(() => safeJson(STORAGE_KEYS.favorites, []));
  const [recentSearches, setRecentSearches] = useState(() => safeJson(STORAGE_KEYS.recents, []));
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) || 'aurora');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.recents, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
      } catch {
        setError("City not found. Please try again.");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city, unit]);

  const addRecentSearch = (cityName) => {
    setRecentSearches((prev) => {
      const next = [cityName, ...prev.filter((item) => item.toLowerCase() !== cityName.toLowerCase())];
      return next.slice(0, 7);
    });
  };

  const handleSearch = (cityName) => {
    const normalized = cityName?.trim();
    if (!normalized) return;
    setCity(normalized);
    addRecentSearch(normalized);
  };

  const handleToggleFavorite = (cityName) => {
    const normalized = cityName?.trim();
    if (!normalized) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === normalized.toLowerCase());
      if (exists) {
        return prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
      }
      return [normalized, ...prev].slice(0, 6);
    });
  };

  const mainWeather = weather?.current?.weather?.[0]?.main || 'weather';
  const bgCity = weather ? weather.current.name.replace(/ /g, '+') : 'city';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={{ backgroundImage: `url('https://source.unsplash.com/1920x1080/?${bgCity},${mainWeather},landscape')` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${getThemeOverlay(theme)} transition-all duration-1000`}></div>
      <div className={`absolute inset-0 bg-gradient-to-tr ${getWeatherOverlay(weather)} transition-all duration-1000`}></div>
      <div className="weather-blob weather-blob-a"></div>
      <div className="weather-blob weather-blob-b"></div>
      <div className="weather-blob weather-blob-c"></div>

      <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 text-white flex flex-col md:flex-row gap-8">

        {/* Left Side: Current Stats */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Theme</p>
            <div className="flex items-center gap-2 bg-black/20 border border-white/15 p-1 rounded-full">
              {Object.entries(THEMES).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${theme === key ? 'bg-white text-black' : 'text-white/75 hover:text-white'}`}
                >
                  <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${value.chip}`}></span>
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          <SearchBar
            onSearch={handleSearch}
            onReset={() => handleSearch(defaultCity)}
            currentCity={city}
            defaultCity={defaultCity}
            favorites={favorites}
            recents={recentSearches}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecent={handleSearch}
          />
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
            weather && (
              <CurrentWeather
                data={weather.current}
                unit={unit}
                aqi={weather.aqi}
                isFavorite={favorites.some((item) => item.toLowerCase() === city.toLowerCase())}
                onToggleFavorite={() => handleToggleFavorite(city)}
              />
            )
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