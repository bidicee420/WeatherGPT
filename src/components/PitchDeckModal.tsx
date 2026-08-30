import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Presentation,
  Play,
  Layers,
  Sparkles,
  CheckCircle,
  Cpu,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { PitchSlide } from '../types';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunDemoQuery: (query: string) => void;
}

const SLIDES: PitchSlide[] = [
  {
    id: 1,
    section: 'Slide 1 · The Hook (Problem)',
    title: 'Weather Apps Show Raw Numbers, Not Decisions',
    subtitle: 'Users do not need isolated numbers (68°F, 1013 hPa); they need actionable situational intelligence.',
    points: [
      'Raw Meteorological Disconnect: Standard apps provide isolated tables of metrics without contextual translation into real life.',
      'Complex Travel Planning Friction: Multi-city road trips and vacations require tedious manual cross-referencing of dozen highway stops.',
      'Emergency Alert Passivity: Generic storm alerts lack interactive physical preparedness checklists (power surge, pipe freeze, evacuation).',
    ],
    badge: '1. Problem',
  },
  {
    id: 2,
    section: 'Slide 2 · The Solution',
    title: 'WeatherGPT: Agentic Meteorological Engine',
    subtitle: 'Combining real-time Open-Meteo telemetry with Gemini 3.7 / 2.5 Flash conversational reasoning.',
    points: [
      'Autonomous Function Calling: Gemini calls Open-Meteo geocoding, current telemetry, air quality, and climate archives dynamically.',
      'Zero Rate-Limit Friction: 100% open-source meteorological models with high reliability and zero API cost barrier.',
      'Human-Centric Synthesis: Automatically translates barometric drops, UV indexes, and wind chill into attire, driving advisories, and gear.',
    ],
    demoQuery: 'What clothing gear and layers should I pack for a 5-day journey visiting Tokyo, Kyoto, and Sapporo this week?',
    badge: '2. Solution',
  },
  {
    id: 3,
    section: 'Slide 3 · Live Demo Flow',
    title: 'High-Impact Winning Hackathon Differentiators',
    subtitle: '3 Interactive live demonstrations that prove deep agentic capabilities.',
    points: [
      'Demo 1: Conversational Multi-Hop Routing (e.g., NYC to Boston with time-sliced icy road and hydroplaning hazard detection).',
      'Demo 2: 10-Year Historical Climate Anomaly Contextualizer (comparing today against 2014-2024 archive).',
      'Demo 3: Live Severe Storm Check with automated interactive emergency checklists.',
    ],
    demoQuery: 'I am driving from New York to Boston tomorrow morning. Will I encounter rain or icy roads along the way?',
    badge: '3. Live Demo Flow',
  },
  {
    id: 4,
    section: 'Slide 4 · Architecture & Orchestration',
    title: 'Bidirectional Grounding & Tool Orchestration',
    subtitle: 'Modern full-stack architecture powered by Google AI Studio and Express Vite server.',
    points: [
      'UI Tier: React 19 + Tailwind CSS + Recharts visual telemetry & synoptic timeline.',
      'Reasoning Tier: Gemini 3.7 Flash with @google/genai TypeScript SDK and multi-turn chat loops.',
      'Telemetry Tier: Open-Meteo REST endpoints for Geocoding, High-Resolution Forecasts, and Historical Archives.',
    ],
    badge: '4. Architecture',
  },
  {
    id: 5,
    section: 'Slide 5 · Future Scope & Horizons',
    title: 'IoT & Smart Home Sensor Fusion',
    subtitle: 'Evolving from conversational assistant into proactive physical automation.',
    points: [
      'Smart Thermostat & HVAC: Pre-cool or pre-heat buildings ahead of extreme temperature swings or cold fronts.',
      'Smart Irrigation Systems: Automatically disable sprinklers when Open-Meteo forecast rain probability exceeds 70%.',
      'Personalized Health Telemetry: Push asthma and allergy warnings based on live PM2.5 and Ozone AQI thresholds.',
    ],
    badge: '5. Future Scope',
  },
];

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  onClose,
  onRunDemoQuery,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Presentation className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">
                WeatherGPT Hackathon Pitch & Presentation Deck
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Slide Structure from the Development Guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              Slide {currentSlideIndex + 1} of {SLIDES.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Badge & Section */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {currentSlide.section}
            </span>
            <span className="text-xs text-slate-500 font-medium">WeatherGPT Hackathon Blueprint</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-sm text-cyan-200/90 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Key Bullet Points */}
          <div className="space-y-3 pt-2">
            {currentSlide.points.map((pt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Live Demo Trigger if available on this slide */}
          {currentSlide.demoQuery && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-cyan-300" />
                  <span>One-Click Live Demo Query:</span>
                </div>
                <p className="text-xs text-slate-300 italic">
                  "{currentSlide.demoQuery}"
                </p>
              </div>

              <button
                onClick={() => {
                  onRunDemoQuery(currentSlide.demoQuery!);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Launch Live Demo</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'w-6 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDES.length - 1}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
