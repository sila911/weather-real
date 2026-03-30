import React from 'react';

const aqiTone = {
  Good: 'text-emerald-200 border-emerald-300/40 bg-emerald-500/10',
  Fair: 'text-lime-200 border-lime-300/40 bg-lime-500/10',
  Moderate: 'text-amber-100 border-amber-300/40 bg-amber-500/10',
  Poor: 'text-orange-100 border-orange-300/40 bg-orange-500/10',
  'Very Poor': 'text-red-100 border-red-300/40 bg-red-500/10',
};

const CurrentWeather = ({ data, unit, aqi, isFavorite, onToggleFavorite }) => {

  if (!data) return null;

  return (
    <div className="flex flex-col items-center md:items-start animate-in fade-in duration-700">
      <div className="mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-white">{data.name}</h2>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`rounded-full px-3 py-1 text-xs border transition-colors ${isFavorite ? 'bg-amber-400/20 border-amber-200/40 text-amber-100' : 'bg-white/5 border-white/20 text-white/70 hover:text-white'}`}
          >
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>
        <p className="text-white/80 text-lg font-medium mt-1">
          {new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-white/60 text-lg capitalize">{data.weather[0].description}</p>
      </div>

      <div className="flex items-center gap-6 my-6">
        {/* Assumes icons are in public/icons/ named after the API icon code */}
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
          className="w-32 h-32 drop-shadow-xl"
          alt="weather-status"
        />
        <h1 className="text-8xl font-light text-white leading-none">
          {Math.round(data.main.temp)}°
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white/5 backdrop-blur-sm p-5 rounded-[2rem] border border-white/10">
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Humidity</p>
          <p className="text-2xl font-semibold text-white">{data.main.humidity}%</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-5 rounded-[2rem] border border-white/10">
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Wind Speed</p>
          <p className="text-2xl font-semibold text-white">{Math.round(data.wind.speed)} <span className="text-sm font-normal text-white/50">{unit === 'imperial' ? 'mph' : 'm/s'}</span></p>
        </div>
      </div>

      {aqi?.value ? (
        <div className={`mt-4 w-full rounded-[1.5rem] border p-4 ${aqiTone[aqi.label] || 'text-white border-white/20 bg-white/5'}`}>
          <p className="text-xs uppercase tracking-[0.18em] opacity-75 mb-1">Air Quality</p>
          <p className="text-xl font-semibold">{aqi.label} <span className="text-sm opacity-80">(Index {aqi.value}/5)</span></p>
          {aqi.components?.pm2_5 ? (
            <p className="text-sm opacity-80 mt-1">PM2.5: {Math.round(aqi.components.pm2_5)} ug/m3</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CurrentWeather;