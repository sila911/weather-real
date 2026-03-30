import React, { useState, useEffect, useRef } from 'react';
import weatherService from '../services/weatherService';

const SearchBar = ({
  onSearch,
  onReset,
  currentCity,
  favorites = [],
  recents = [],
  onToggleFavorite,
  onSelectRecent,
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length > 2) {
        try {
          const data = await weatherService.getCitySuggestions(input);
          setSuggestions(data);
          setShowSuggestions(true);
          setActiveIndex(-1);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // debounce input
    return () => clearTimeout(timeoutId);
  }, [input]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showSuggestions && activeIndex >= 0 && suggestions[activeIndex]) {
      const selected = suggestions[activeIndex];
      onSearch(selected.displayName);
      setInput('');
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }

    if (input.trim()) {
      onSearch(input);
      setShowSuggestions(false);
      setInput('');
      setActiveIndex(-1);
    }
  };

  const handleSuggestionClick = (city) => {
    onSearch(city.displayName);
    setShowSuggestions(false);
    setInput('');
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    if (onReset) onReset();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }

    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full group z-50">
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (input.trim().length > 2) setShowSuggestions(true);
          }}
          placeholder="Search city..."
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-6 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all shadow-inner text-white placeholder-white/40"
        />
        <div className="absolute right-4 flex items-center gap-3">
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="text-white/50 hover:text-white transition-colors text-lg"
              title="Clear and reset to default"
            >
              ✖
            </button>
          )}
          <button
            type="submit"
            className="text-white/50 hover:text-white transition-colors text-lg"
          >
            🔍
          </button>
        </div>
      </form>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Favorites</p>
          <button
            type="button"
            onClick={() => onToggleFavorite?.(currentCity)}
            className="text-xs text-amber-200 hover:text-amber-100 transition-colors"
          >
            {favorites.includes(currentCity) ? 'Remove current' : 'Save current'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {favorites.length > 0 ? favorites.slice(0, 4).map((favorite) => (
            <button
              type="button"
              key={favorite}
              onClick={() => onSearch(favorite)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 transition-colors"
            >
              {favorite}
            </button>
          )) : (
            <p className="text-xs text-white/50">No favorites yet</p>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 mb-1.5">Recent searches</p>
          <div className="flex flex-wrap gap-2">
            {recents.length > 0 ? recents.slice(0, 5).map((recent) => (
              <button
                type="button"
                key={recent}
                onClick={() => onSelectRecent?.(recent)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/20 hover:bg-black/30 text-white/90 border border-white/10 transition-colors"
              >
                {recent}
              </button>
            )) : (
              <p className="text-xs text-white/50">No recent searches</p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input.trim().length > 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {suggestions.length > 0 ? (
            suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className={`w-full text-left px-6 py-4 text-white transition-colors border-b border-white/10 last:border-0 flex items-center gap-3 ${activeIndex === idx ? 'bg-white/20' : 'hover:bg-white/20'}`}
              >
                <img
                  src={`https://flagcdn.com/w20/${s.country.toLowerCase()}.png`}
                  alt={s.country}
                  className="w-5 h-auto rounded-[2px]"
                />
                <span>{s.displayName}</span>
              </button>
            ))
          ) : (
            <div className="px-6 py-4 text-white/70 text-center">
              City not found. Please try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;