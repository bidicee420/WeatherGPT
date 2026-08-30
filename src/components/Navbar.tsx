import React, { useState } from 'react';
import {
  CloudLightning,
  Search,
  Navigation,
  Presentation,
  SlidersHorizontal,
  Compass,
  Car,
  TrendingUp,
  ShieldAlert,
  MessageSquare,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'chat' | 'dashboard' | 'route' | 'climate' | 'emergency';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'route' | 'climate' | 'emergency') => void;
  tempUnit: 'C' | 'F';
  setTempUnit: (unit: 'C' | 'F') => void;
  onSearchCity: (city: string) => void;
  onUseGps: () => void;
  onOpenPitchDeck: () => void;
  isLoadingLocation: boolean;
  activeLocationName: string;
}

const POPULAR_CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'Chicago', 'San Francisco', 'Miami', 'Sydney'];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tempUnit,
  setTempUnit,
  onSearchCity,
  onUseGps,
  onOpenPitchDeck,
  isLoadingLocation,
  activeLocationName,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchCity(searchInput.trim());
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <CloudLightning className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  WeatherGPT
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Agentic AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Open-Meteo Telemetry · Gemini Reasoning
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="navbar-city-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={`Search city (current: ${activeLocationName})...`}
                className="w-full pl-9 pr-24 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              <button
                type="submit"
                id="search-submit-btn"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700/50 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick dropdown pills */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 p-2 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-1">
                <div className="text-[11px] font-medium text-slate-400 px-2 py-1 flex items-center justify-between">
                  <span>Quick Destinations</span>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-1">
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c}
                      id={`quick-city-${c.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        onSearchCity(c);
                        setSearchInput(c);
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 text-slate-300 border border-slate-700/40 transition-all text-left"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* GPS Location Button */}
            <button
              id="gps-location-btn"
              onClick={onUseGps}
              disabled={isLoadingLocation}
              title="Detect Current GPS Coordinates"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-all hover:border-slate-700 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingLocation ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">GPS</span>
            </button>

            {/* Temperature Unit Toggle */}
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                id="unit-c-btn"
                onClick={() => setTempUnit('C')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  tempUnit === 'C'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                id="unit-f-btn"
                onClick={() => setTempUnit('F')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  tempUnit === 'F'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Hackathon Presentation Pitch Deck Button */}
            <button
              id="open-pitch-deck-btn"
              onClick={onOpenPitchDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all shadow-sm group"
            >
              <Presentation className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Hackathon Deck</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-900">
          <button
            id="tab-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Conversationalist</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </button>

          <button
            id="tab-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Live Telemetry Studio</span>
          </button>

          <button
            id="tab-route-btn"
            onClick={() => setActiveTab('route')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'route'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Multi-Hop Road Advisor</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
              Diff #1
            </span>
          </button>

          <button
            id="tab-climate-btn"
            onClick={() => setActiveTab('climate')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'climate'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>10-Yr Climate Anomaly</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              Diff #2
            </span>
          </button>

          <button
            id="tab-emergency-btn"
            onClick={() => setActiveTab('emergency')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'emergency'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Severe Emergency Protocols</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
              Diff #3
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
