import React from 'react';

const CurrentWeather = ({ data, unit }) => {

  if (!data) return null;

  return (
    <div className="flex flex-col items-center md:items-start animate-in fade-in duration-700">
      <div className="mb-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">{data.name}</h2>
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
    </div>
  );
};

export default CurrentWeather;