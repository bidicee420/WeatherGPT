import React, { useState } from 'react';
import {
  Car,
  Navigation,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Droplets,
  Wind,
  Thermometer,
} from 'lucide-react';
import { RouteTravelAdvisory, RouteWaypointWeather } from '../types';
import { getWeatherCondition, formatTemperature, formatWindSpeed } from '../utils/weatherIcons';

interface RouteAdvisorProps {
  onCalculateRoute: (origin: string, destination: string, waypoints: string[]) => Promise<RouteTravelAdvisory>;
  onAskAi: (prompt: string) => void;
  tempUnit: 'C' | 'F';
}

const PRESET_ROUTES = [
  {
    name: 'New York ➔ Boston (I-95 Corridor)',
    origin: 'New York',
    destination: 'Boston',
    waypoints: ['New Haven', 'Providence'],
  },
  {
    name: 'San Francisco ➔ Lake Tahoe (Sierra Mountain Pass)',
    origin: 'San Francisco',
    destination: 'South Lake Tahoe',
    waypoints: ['Sacramento', 'Placerville'],
  },
  {
    name: 'London ➔ Edinburgh (UK Northway)',
    origin: 'London',
    destination: 'Edinburgh',
    waypoints: ['Birmingham', 'Manchester', 'Newcastle'],
  },
  {
    name: 'Miami ➔ Orlando ➔ Tampa (Florida Peninsula)',
    origin: 'Miami',
    destination: 'Tampa',
    waypoints: ['Fort Lauderdale', 'Orlando'],
  },
];

export const RouteAdvisor: React.FC<RouteAdvisorProps> = ({
  onCalculateRoute,
  onAskAi,
  tempUnit,
}) => {
  const [origin, setOrigin] = useState('New York');
  const [destination, setDestination] = useState('Boston');
  const [waypoints, setWaypoints] = useState<string[]>(['New Haven', 'Providence']);
  const [newWaypointInput, setNewWaypointInput] = useState('');
  const [advisoryResult, setAdvisoryResult] = useState<RouteTravelAdvisory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddWaypoint = () => {
    if (newWaypointInput.trim()) {
      setWaypoints([...waypoints, newWaypointInput.trim()]);
      setNewWaypointInput('');
    }
  };

  const handleRemoveWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, idx) => idx !== index));
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!origin || !destination) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await onCalculateRoute(origin, destination, waypoints);
      setAdvisoryResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Route calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_ROUTES)[0]) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
    setWaypoints(preset.waypoints);
    onCalculateRoute(preset.origin, preset.destination, preset.waypoints)
      .then((res) => setAdvisoryResult(res))
      .catch((err) => setErrorMessage(err.message));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-cyan-950/60 border border-blue-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Hackathon Differentiator #1
              </span>
              <span className="text-xs text-slate-400">Time-Sliced Telemetry Traversal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Multi-Hop Road Weather & Hazard Advisor
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Evaluates atmospheric telemetry sequentially along your highway itinerary to pinpoint localized black ice, hydroplaning, blinding fog pockets, or convective squall risks before you start driving.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Preset Quick Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Quick Test Routes:</span>
          {PRESET_ROUTES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="px-3 py-1 rounded-lg text-xs bg-slate-900/90 hover:bg-blue-900/40 text-slate-300 hover:text-blue-200 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center gap-1.5"
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Configuration Form */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Itinerary Parameters</span>
          </h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Origin */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Departure City (Origin)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40"
                  required
                />
              </div>
            </div>

            {/* Waypoints */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">
                Intermediate Highway Waypoints
              </label>
              {waypoints.map((wp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{wp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWaypoint(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Waypoint Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newWaypointInput}
                  onChange={(e) => setNewWaypointInput(e.target.value)}
                  placeholder="Add waypoint city..."
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleAddWaypoint}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700/60 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Final Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Boston"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40"
                  required
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Traversing Waypoints...</span>
                </>
              ) : (
                <>
                  <Car className="w-4 h-4" />
                  <span>Calculate Road Advisory</span>
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Route Timeline & Results */}
        <div className="lg:col-span-2 space-y-4">
          {advisoryResult ? (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-6">
              {/* Summary Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Trip Overview
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        advisoryResult.overallHazard === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : advisoryResult.overallHazard === 'caution'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                          : advisoryResult.overallHazard === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {advisoryResult.overallHazard}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{advisoryResult.summary}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Est. Distance</span>
                    <span className="text-white text-sm">{advisoryResult.totalDistanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Drive Duration</span>
                    <span className="text-white text-sm">{advisoryResult.estimatedDriveHours} hrs</span>
                  </div>
                </div>
              </div>

              {/* Waypoint Steps Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sequential Road Waypoint Telemetry
                </h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {advisoryResult.routeStops.map((stop, idx) => {
                    const cond = getWeatherCondition(stop.weatherCode, 1);
                    const StopIcon = cond.icon;

                    return (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-3 w-5 h-5 rounded-full border-2 bg-slate-950 flex items-center justify-center ${
                            stop.hazardLevel === 'safe'
                              ? 'border-emerald-500 text-emerald-400'
                              : stop.hazardLevel === 'caution'
                              ? 'border-yellow-500 text-yellow-400'
                              : stop.hazardLevel === 'warning'
                              ? 'border-amber-500 text-amber-400'
                              : 'border-rose-500 text-rose-400'
                          }`}
                        >
                          <span className="text-[9px] font-black">{idx + 1}</span>
                        </div>

                        {/* Stop Card */}
                        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{stop.city}</h4>
                              <span className="text-xs text-slate-500">
                                ~+{stop.estimatedArrivalHours}h into trip ({stop.distanceFromStartKm} km)
                              </span>
                            </div>

                            <span
                              className={`self-start sm:self-auto px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${
                                stop.hazardLevel === 'safe'
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                  : stop.hazardLevel === 'caution'
                                  ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                                  : stop.hazardLevel === 'warning'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              {stop.hazardLevel}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{formatTemperature(stop.temperature, tempUnit)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <StopIcon className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="truncate">{cond.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Droplets className="w-3.5 h-3.5 text-blue-400" />
                              <span>{stop.precipitationProb}% precip</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Wind className="w-3.5 h-3.5 text-purple-400" />
                              <span>{formatWindSpeed(stop.windSpeed, tempUnit === 'F' ? 'imperial' : 'metric')}</span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 flex items-start gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{stop.hazardDetails}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Deep Query Trigger */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={() =>
                    onAskAi(
                      `Provide a deep conversational travel advisory for driving from ${origin} to ${destination} via ${waypoints.join(
                        ', '
                      )}. Address tire safety, stopping distance, departure timing, and emergency precautions.`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask WeatherGPT for Complete Conversational Route Briefing</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/60 text-center space-y-3">
              <Car className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Active Route Calculated</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure departure and destination points on the left or select a quick test route to analyze highway telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
