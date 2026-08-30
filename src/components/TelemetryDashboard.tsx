import React, { useState } from 'react';
import {
  FullWeatherTelemetry,
} from '../types';
import {
  getWeatherCondition,
  formatTemperature,
  formatWindSpeed,
  getAqiStatus,
  getUvCategory,
} from '../utils/weatherIcons';
import {
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Eye,
  CloudRain,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
  CartesianGrid,
} from 'recharts';

interface TelemetryDashboardProps {
  telemetry: FullWeatherTelemetry | null;
  tempUnit: 'C' | 'F';
  onAskAi: (prompt: string) => void;
  isLoading: boolean;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  telemetry,
  tempUnit,
  onAskAi,
  isLoading,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'temp' | 'precip' | 'wind'>('temp');

  if (isLoading && !telemetry) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Receiving real-time Open-Meteo telemetry stream...</p>
      </div>
    );
  }

  if (!telemetry || !telemetry.current) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-slate-400">
        No telemetry data available. Please search a city or check GPS.
      </div>
    );
  }

  const { location, current, hourly, daily, airQuality } = telemetry;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const IconComponent = condition.icon;
  const aqiInfo = airQuality?.current ? getAqiStatus(airQuality.current.us_aqi) : getAqiStatus(35);
  const uvInfo = getUvCategory(current.uv_index);

  // Format hourly chart data
  const chartData = (hourly.time || []).map((t, idx) => {
    const date = new Date(t);
    const hourStr = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const rawTemp = hourly.temperature_2m[idx];
    const displayTemp = tempUnit === 'F' ? (rawTemp * 9) / 5 + 32 : rawTemp;

    return {
      time: hourStr,
      temp: Number(displayTemp.toFixed(1)),
      rawTemp,
      precipProb: hourly.precipitation_probability[idx] ?? 0,
      precip: hourly.precipitation[idx] ?? 0,
      wind: hourly.wind_speed_10m[idx] ?? 0,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Hero Overview Banner */}
      <div
        className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${condition.gradient} border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: City & Condition */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 text-cyan-300 border border-slate-700/60">
                Live Station Telemetry
              </span>
              <span className="text-xs text-slate-400">
                Lat {location.latitude?.toFixed(2)}°, Lon {location.longitude?.toFixed(2)}°
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </h1>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${condition.badgeColor}`}>
                <IconComponent className="w-4 h-4" />
                {condition.label}
              </span>
              <span className="text-xs text-slate-400">{condition.description}</span>
            </div>
          </div>

          {/* Center-Right: Temperature & Key Stat */}
          <div className="flex items-baseline gap-4 sm:gap-6">
            <div className="flex items-start">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
                {formatTemperature(current.temperature, tempUnit).replace(/°[CF]/, '')}
              </span>
              <span className="text-2xl font-bold text-cyan-400 ml-1">°{tempUnit}</span>
            </div>

            <div className="space-y-1 text-xs text-slate-300 border-l border-slate-800 pl-4">
              <div>
                Feels like:{' '}
                <strong className="text-white">
                  {formatTemperature(current.apparent_temperature, tempUnit)}
                </strong>
              </div>
              <div>
                High / Low:{' '}
                <strong className="text-white">
                  {daily.temperature_2m_max?.[0] ? formatTemperature(daily.temperature_2m_max[0], tempUnit) : '--'}
                </strong>{' '}
                /{' '}
                <strong className="text-slate-400">
                  {daily.temperature_2m_min?.[0] ? formatTemperature(daily.temperature_2m_min[0], tempUnit) : '--'}
                </strong>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 font-medium">
                <CloudRain className="w-3.5 h-3.5" />
                <span>{daily.precipitation_probability_max?.[0] || 0}% precip risk today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick AI Advice Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Atmospheric Synthesizer:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAskAi(`Give me practical attire and travel recommendations for ${location.name} today based on the current weather.`)}
              className="px-3 py-1 rounded-lg text-xs bg-slate-900/90 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              🧥 What to wear today?
            </button>
            <button
              onClick={() => onAskAi(`Analyze the current barometric pressure (${current.surface_pressure} hPa) and wind gusts in ${location.name} for incoming front changes.`)}
              className="px-3 py-1 rounded-lg text-xs bg-slate-900/90 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              📉 Barometric analysis
            </button>
            <button
              onClick={() => onAskAi(`Is today's climate in ${location.name} normal compared to the 10-year historical baseline?`)}
              className="px-3 py-1 rounded-lg text-xs bg-slate-900/90 hover:bg-amber-950 hover:text-amber-300 text-slate-300 border border-slate-800 hover:border-amber-500/40 transition-all"
            >
              🌍 Climate trend check
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Atmospheric Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Wind Speed */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Wind Speed</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {formatWindSpeed(current.wind_speed_10m, tempUnit === 'F' ? 'imperial' : 'metric')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>Dir {current.wind_direction_10m}° · Gusts {Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3)}</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">{current.relative_humidity}%</div>
          <div className="text-[11px] text-slate-500">
            {current.relative_humidity > 70 ? 'High moisture' : current.relative_humidity < 30 ? 'Dry air' : 'Optimal comfort'}
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pressure</span>
            <Gauge className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {Math.round(current.surface_pressure || 1013)} <span className="text-xs font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {current.surface_pressure < 1010 ? 'Low pressure system' : 'Stable high pressure'}
          </div>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {current.uv_index.toFixed(1)}{' '}
            <span className={`text-xs font-semibold ${uvInfo.color}`}>({uvInfo.label})</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">{uvInfo.recommendation}</div>
        </div>

        {/* Air Quality AQI */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Air Quality</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {airQuality?.current?.us_aqi || 32}{' '}
            <span className="text-xs font-medium text-slate-400">US AQI</span>
          </div>
          <div className={`text-[11px] font-semibold truncate ${aqiInfo.color.split(' ')[0]}`}>
            {aqiInfo.label}
          </div>
        </div>

        {/* Solar Times */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Sun Cycle</span>
            <Sunrise className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xs text-slate-200 flex items-center justify-between pt-1">
            <span className="flex items-center gap-1">
              <Sunrise className="w-3 h-3 text-amber-400" />
              {daily.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:15'}
            </span>
            <span className="flex items-center gap-1">
              <Sunset className="w-3 h-3 text-orange-400" />
              {daily.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '19:45'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">Daylight hours available</div>
        </div>
      </div>

      {/* 24-Hour Hourly Forecast Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>24-Hour Atmospheric Telemetry Curves</span>
            </h3>
            <p className="text-xs text-slate-400">
              Granular time-sliced forecast curves for temperature, precipitation probability, and wind
            </p>
          </div>

          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveMetricTab('temp')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeMetricTab === 'temp' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Temperature
            </button>
            <button
              onClick={() => setActiveMetricTab('precip')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeMetricTab === 'precip' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Precipitation %
            </button>
            <button
              onClick={() => setActiveMetricTab('wind')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeMetricTab === 'wind' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wind Speed
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#1e293b',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              />
              {activeMetricTab === 'temp' && (
                <Area
                  type="monotone"
                  dataKey="temp"
                  name={`Temperature (°${tempUnit})`}
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
              )}
              {activeMetricTab === 'precip' && (
                <Bar
                  dataKey="precipProb"
                  name="Precipitation Probability (%)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              )}
              {activeMetricTab === 'wind' && (
                <Area
                  type="monotone"
                  dataKey="wind"
                  name="Wind Speed (km/h)"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="#a855f7"
                  fillOpacity={0.15}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Extended Forecast */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-cyan-400" />
          <span>7-Day Synoptic Outlook</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {(daily.time || []).map((dayTime, idx) => {
            const date = new Date(dayTime);
            const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const code = daily.weather_code?.[idx] ?? 0;
            const cond = getWeatherCondition(code, 1);
            const DayIcon = cond.icon;
            const maxTemp = daily.temperature_2m_max?.[idx] ?? 20;
            const minTemp = daily.temperature_2m_min?.[idx] ?? 12;
            const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;

            return (
              <div
                key={dayTime}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-between text-center space-y-2 hover:border-cyan-500/40 transition-colors group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {dayName}
                  </div>
                  <div className="text-[10px] text-slate-500">{dayNum}</div>
                </div>

                <div className="my-1 p-2 rounded-xl bg-slate-900 group-hover:bg-slate-800 transition-colors">
                  <DayIcon className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="text-xs font-medium text-slate-300">
                  {cond.label}
                </div>

                {precipProb > 10 && (
                  <div className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                    <CloudRain className="w-3 h-3" />
                    <span>{precipProb}%</span>
                  </div>
                )}

                <div className="w-full pt-2 border-t border-slate-900 flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">{formatTemperature(maxTemp, tempUnit)}</span>
                  <span className="text-slate-500">{formatTemperature(minTemp, tempUnit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
