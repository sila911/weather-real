import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CurrentWeather = ({ data, forecast, unit }) => {
  if (!data) return null;

  // Format forecast data for the chart
  const chartData = forecast?.map(day => {
    const date = new Date(day.dt * 1000);
    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      tooltipLabel: `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      Temp: Math.round(day.main.temp)
    };
  }) || [];

  return (
    <div className="flex flex-col items-center md:items-start animate-in fade-in duration-700">
      <div className="mb-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">{data.name}</h2>
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

      {/* Forecast Chart */}
      {chartData.length > 0 && (
        <div className="w-full h-48 mt-6 bg-white/5 backdrop-blur-sm p-4 rounded-[2rem] border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} dy={10} />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                labelFormatter={(label, payload) => payload?.[0]?.payload?.tooltipLabel || label}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="Temp"
                stroke="#ffffff"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                activeDot={{ r: 6, fill: '#fff', stroke: 'rgba(255,255,255,0.5)', strokeWidth: 4 }}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;