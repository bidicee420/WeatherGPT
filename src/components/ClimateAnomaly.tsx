import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Thermometer,
  CloudRain,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ClimateAnomalyData } from '../types';
import { formatTemperature } from '../utils/weatherIcons';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface ClimateAnomalyProps {
  initialCity: string;
  onFetchAnomaly: (city: string) => Promise<ClimateAnomalyData>;
  onAskAi: (prompt: string) => void;
  tempUnit: 'C' | 'F';
}

const COMPARISON_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Phoenix', 'Sydney', 'Cairo'];

export const ClimateAnomaly: React.FC<ClimateAnomalyProps> = ({
  initialCity,
  onFetchAnomaly,
  onAskAi,
  tempUnit,
}) => {
  const [cityInput, setCityInput] = useState(initialCity || 'London');
  const [anomalyData, setAnomalyData] = useState<ClimateAnomalyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCityAnomaly = async (target: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await onFetchAnomaly(target);
      setAnomalyData(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch climate archive telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCityAnomaly(cityInput);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      loadCityAnomaly(cityInput.trim());
    }
  };

  // Format Recharts data
  const chartData = (anomalyData?.yearlyHistory || []).map((y) => {
    const rawMax = y.avgTempMax;
    const rawMin = y.avgTempMin;
    const maxVal = tempUnit === 'F' ? (rawMax * 9) / 5 + 32 : rawMax;
    const minVal = tempUnit === 'F' ? (rawMin * 9) / 5 + 32 : rawMin;

    return {
      year: y.year.toString(),
      maxTemp: Number(maxVal.toFixed(1)),
      minTemp: Number(minVal.toFixed(1)),
      precip: y.totalPrecip,
    };
  });

  const baseMaxFormatted = anomalyData
    ? tempUnit === 'F'
      ? (anomalyData.baseline10YrTempMax * 9) / 5 + 32
      : anomalyData.baseline10YrTempMax
    : 20;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-purple-950/40 border border-amber-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Hackathon Differentiator #2
              </span>
              <span className="text-xs text-slate-400">Open-Meteo Climate Archive Grounding</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              10-Year Historical Climate Anomaly Contextualizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Compares today's local temperature and precipitation against a decade of historical baseline data to detect climate shifts, unseasonal heat domes, and polar vortex anomalies.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* City Filter & Search */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city to contextualize..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            >
              Analyze
            </button>
          </form>

          {/* Quick city chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Presets:</span>
            {COMPARISON_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCityInput(c);
                  loadCityAnomaly(c);
                }}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                  cityInput.toLowerCase() === c.toLowerCase()
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">
            Querying Open-Meteo 10-Year Climate Archive (2014-2024)...
          </p>
        </div>
      ) : anomalyData ? (
        <div className="space-y-6">
          {/* Anomaly Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Temperature Anomaly */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Temperature Departure</span>
                <Thermometer className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold ${
                    anomalyData.tempAnomaly > 0
                      ? 'text-amber-400'
                      : anomalyData.tempAnomaly < 0
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {anomalyData.tempAnomaly > 0 ? `+${anomalyData.tempAnomaly}` : anomalyData.tempAnomaly}°C
                </span>
                <span className="text-xs text-slate-400">from 10-yr mean</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1">
                {anomalyData.tempAnomaly > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-cyan-400" />
                )}
                <span>
                  Today max: {formatTemperature(anomalyData.currentTempMax, tempUnit)} vs Baseline{' '}
                  {formatTemperature(anomalyData.baseline10YrTempMax, tempUnit)}
                </span>
              </div>
            </div>

            {/* Baseline Mean */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>10-Year Historical Norm</span>
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {formatTemperature(anomalyData.baseline10YrTempMax, tempUnit)}
              </div>
              <div className="text-xs text-slate-400">
                10-Year historical average maximum for {anomalyData.targetDateOrMonth}
              </div>
            </div>

            {/* Precipitation Comparison */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Precipitation Deviation</span>
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {anomalyData.currentPrecip} mm
              </div>
              <div className="text-xs text-slate-400">
                10-yr month normal: {anomalyData.baseline10YrPrecip} mm ({anomalyData.precipAnomalyPercent > 0 ? `+${anomalyData.precipAnomalyPercent}%` : `${anomalyData.precipAnomalyPercent}%`})
              </div>
            </div>
          </div>

          {/* 10-Year History Trend Chart */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>10-Year Temperature & Precipitation Trajectory</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Year-by-year historical climate measurements in {anomalyData.location.name}
                </p>
              </div>

              <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {anomalyData.location.name} · {anomalyData.targetDateOrMonth}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
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
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <ReferenceLine
                    y={Number(baseMaxFormatted.toFixed(1))}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: '10-Yr Baseline Max', fill: '#f59e0b', fontSize: 10 }}
                  />
                  <Bar
                    dataKey="precip"
                    name="Precipitation (mm)"
                    fill="#3b82f6"
                    opacity={0.6}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="maxTemp"
                    name={`Max Temp (°${tempUnit})`}
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f97316' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minTemp"
                    name={`Min Temp (°${tempUnit})`}
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#06b6d4' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meteorological Narrative Summary */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Climate Intelligence Summary
              </div>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {anomalyData.trendSummary}
              </p>
            </div>

            <button
              onClick={() =>
                onAskAi(
                  `Provide a detailed climate comparison for ${anomalyData.location.name} in ${anomalyData.targetDateOrMonth}. Today's temp is ${anomalyData.currentTempMax}°C vs the 10-year baseline of ${anomalyData.baseline10YrTempMax}°C (anomaly: ${anomalyData.tempAnomaly}°C). Explain the meteorological drivers and long-term implications.`
                )
              }
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask WeatherGPT for In-Depth Climate Breakdown</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500">
          No climate data available. Search a city above.
        </div>
      )}
    </div>
  );
};
