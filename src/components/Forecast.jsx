import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/50 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white shadow-xl">
        <p className="font-semibold text-sm opacity-90 mb-1">{data.tooltipLabel}</p>
        <div className="flex items-center gap-1">
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            className="w-10 h-10 drop-shadow-md -ml-1"
          />
          <p className="text-xl font-bold">{data.Temp}°</p>
        </div>
        <p className="text-xs text-white/70 capitalize">{data.description}</p>
      </div>
    );
  }
  return null;
};

const Forecast = ({ items }) => {
  const [filter, setFilter] = useState('24H');

  if (!items) return null;

  // Filter 3-hour interval data (8 items = 24H, 24 items = 3 Days, All = 5 Days)
  let filteredForecast = [];
  if (filter === '24H') filteredForecast = items.slice(0, 8);
  else if (filter === '3D') filteredForecast = items.slice(0, 24);
  else filteredForecast = items;

  // Format forecast data for the chart
  const chartData = filteredForecast.map(day => {
    const date = new Date(day.dt * 1000);
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric' });
    const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      name: filter === '24H'
        ? timeString
        : `${dayString} ${timeString}`,
      tooltipLabel: `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      Temp: Math.round(day.main.temp),
      icon: day.weather[0].icon,
      description: day.weather[0].description
    };
  });

  // Format data for the small cards grid
  let gridCards = [];
  if (filter === '24H') {
    gridCards = filteredForecast; // Show all intervals for the 24H view
  } else {
    // For 3D and Week, show only one card per day to avoid clutter
    const dailyMap = new Map();
    filteredForecast.forEach(day => {
      const dateStr = new Date(day.dt * 1000).toLocaleDateString('en-US');
      // Prefer midday readings if available, otherwise take the first reading of the day
      if (!dailyMap.has(dateStr) || day.dt_txt.includes("12:00:00")) {
        dailyMap.set(dateStr, day);
      }
    });
    gridCards = Array.from(dailyMap.values());
  }

  return (
    <div className="mt-8 md:mt-0 flex flex-col h-full w-full">
      {/* Header & Filters */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-white/80">Forecast Trend</h3>
        <div className="flex bg-black/20 p-1 rounded-full border border-white/10">
          {['24H', '3D', 'Week'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${filter === f ? 'bg-white text-black shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              {f === '3D' ? '3 Days' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-56 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
              dy={10}
              minTickGap={30}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              content={<CustomTooltip />}
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

      {/* Forecast Cards Grid */}
      <div className="overflow-y-auto max-h-[300px] pr-2 -mr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {gridCards.map((day, idx) => (
            <div
              key={idx}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-lg"
            >
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-sm font-semibold text-white/70">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-xs font-medium text-white/50">
                  {filter === '24H'
                    ? new Date(day.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
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
    </div>
  );
};

export default Forecast;