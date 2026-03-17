import React from 'react';

const Forecast = ({ items }) => {
  if (!items) return null;

  return (
    <div className="mt-8 md:mt-0">
      <h3 className="text-xl font-medium text-white/80 mb-6">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((day, idx) => (
          <div
            key={idx}
            className="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-lg"
          >
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-sm font-semibold text-white/70">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-xs font-medium text-white/50">
                {new Date(day.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              className="w-16 h-16"
              alt="forecast-status"
            />
            <p className="text-2xl font-bold text-white">
              {Math.round(day.main.temp)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;