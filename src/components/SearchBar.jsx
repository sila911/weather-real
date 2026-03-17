import React, { useState, useEffect, useRef } from 'react';
import weatherService from '../services/weatherService';

const SearchBar = ({ onSearch, onReset, currentCity, defaultCity }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length > 2) {
        try {
          const data = await weatherService.getCitySuggestions(input);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
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

  // Sync input when city is cleared externally
  useEffect(() => {
    if (currentCity === defaultCity) {
      setInput('');
    }
  }, [currentCity, defaultCity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setShowSuggestions(false);
      setInput('');
    }
  };

  const handleSuggestionClick = (city) => {
    onSearch(city.name);
    setShowSuggestions(false);
    setInput('');
  };

  const handleClear = () => {
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onReset) onReset();
  };

  return (
    <div ref={wrapperRef} className="relative w-full group z-50">
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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

      {/* Suggestions Dropdown */}
      {showSuggestions && input.trim().length > 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {suggestions.length > 0 ? (
            suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-6 py-4 text-white hover:bg-white/20 transition-colors border-b border-white/10 last:border-0 flex items-center gap-3"
              >
                <img
                  src={`https://flagcdn.com/w20/${s.country.toLowerCase()}.png`}
                  alt={s.country}
                  className="w-5 h-auto rounded-[2px]"
                />
                <span>{s.name}{s.state ? `, ${s.state}` : ''}, {s.country}</span>
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