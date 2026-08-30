import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckSquare,
  Square,
  Zap,
  Flame,
  CloudLightning,
  CloudSnow,
  Waves,
  Sparkles,
  LifeBuoy,
  PhoneCall,
  Radio,
  BatteryCharging,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { WeatherAlert } from '../types';

interface EmergencyProtocolsProps {
  alerts: WeatherAlert[];
  onAskAi: (prompt: string) => void;
  activeCity: string;
}

interface DisasterScenario {
  id: string;
  name: string;
  category: 'thunderstorm' | 'ice' | 'flood' | 'heatwave' | 'tornado';
  severity: 'high' | 'extreme';
  headline: string;
  description: string;
  checklistTitle: string;
  checklistItems: string[];
  icon: typeof CloudLightning;
  color: string;
}

const SIMULATION_SCENARIOS: DisasterScenario[] = [
  {
    id: 'sim-convective',
    name: 'Severe Convective Thunderstorm & Lightning',
    category: 'thunderstorm',
    severity: 'high',
    headline: 'Convective Supercell Warning: Hail & Lightning Risk',
    description: 'High-energy convective instability detected with intense cloud-to-ground lightning discharge and sudden 80+ km/h microbursts.',
    checklistTitle: 'Thunderstorm Physical Safety Protocols',
    checklistItems: [
      'Immediately seek shelter in a substantial, fully enclosed building or metal-topped vehicle.',
      'Unplug computers, TVs, and sensitive appliances to protect against voltage surges.',
      'Stay away from windows, glass doors, and open porches.',
      'Avoid plumbing fixtures, sinks, and metal pipes during active lightning strikes.',
      'If driving, pull over safely away from tall trees and power transmission lines.',
    ],
    icon: CloudLightning,
    color: 'border-purple-500/40 text-purple-300 bg-purple-950/20',
  },
  {
    id: 'sim-ice',
    name: 'Freezing Rain & Highway Black Ice',
    category: 'ice',
    severity: 'extreme',
    headline: 'Hazardous Glaze Ice & Freeze Advisory',
    description: 'Ground temperatures below freezing causing liquid precipitation to instantly glaze surfaces. High risk of tree branch failure and black ice on overpasses.',
    checklistTitle: 'Black Ice & Freeze Mitigation Checklist',
    checklistItems: [
      'Cease all non-emergency highway travel until salt spreaders treat roads.',
      'Apply coarse salt, calcium chloride, or sand to outdoor walkways and steps.',
      'Insulate exposed outdoor hose bibs and leave indoor faucets dripping slightly.',
      'Ensure vehicle has sub-zero emergency blanket, flashlight, and jumper cables.',
      'Keep backup portable power banks charged in case of ice-laden power line failure.',
    ],
    icon: CloudSnow,
    color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20',
  },
  {
    id: 'sim-flood',
    name: 'Flash Flood & Atmospheric River',
    category: 'flood',
    severity: 'extreme',
    headline: 'Flash Flood Emergency: Rapid Water Inundation',
    description: 'Heavy precipitation rates exceeding soil absorption capacity. Low-lying depressions and culverts subject to sudden flash flooding.',
    checklistTitle: 'Flash Flood Evacuation & Response Protocols',
    checklistItems: [
      'Turn Around, Don’t Drown: NEVER drive or walk through standing floodwaters (6 inches can knock you down, 12 inches can sweep a car).',
      'Move critical documents, medications, and electronics to the upper floors of your home.',
      'Disconnect basement electrical circuits if water is encroaching near breaker panels.',
      'Prepare emergency go-bag with 3 days of bottled water and non-perishable rations.',
      'Monitor local meteorological emergency broadcast radio frequencies.',
    ],
    icon: Waves,
    color: 'border-blue-500/40 text-blue-300 bg-blue-950/20',
  },
  {
    id: 'sim-heat',
    name: 'Catastrophic Heatwave (Wet-Bulb > 35°C)',
    category: 'heatwave',
    severity: 'high',
    headline: 'Extreme Heat Stress & Hyperthermia Alert',
    description: 'Dangerous combined heat and humidity levels impairing human thermal regulation. Elevated risk of heat stroke within 30 minutes of direct sun exposure.',
    checklistTitle: 'Hyperthermia Prevention & Cooling Checklist',
    checklistItems: [
      'Drink cold electrolyte solutions steadily throughout the day; do not wait until thirsty.',
      'Confine outdoor physical exertion exclusively to early dawn hours before 07:00 AM.',
      'Never leave children, disabled individuals, or pets inside parked vehicles under any circumstance.',
      'Utilize air conditioning or visit public designated cooling center facilities.',
      'Check on elderly neighbors and those with pre-existing cardiovascular conditions.',
    ],
    icon: Flame,
    color: 'border-amber-500/40 text-amber-300 bg-amber-950/20',
  },
];

export const EmergencyProtocols: React.FC<EmergencyProtocolsProps> = ({
  alerts,
  onAskAi,
  activeCity,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<DisasterScenario>(SIMULATION_SCENARIOS[0]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const totalItems = selectedScenario.checklistItems.length;
  const completedItems = selectedScenario.checklistItems.filter((i) => checkedItems[i]).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/50 via-slate-900/80 to-purple-950/50 border border-rose-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Hackathon Differentiator #3
              </span>
              <span className="text-xs text-slate-400">Actionable Hazard Checklists</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Severe Weather Protocols & Disaster Bulletins
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Translates severe meteorological alert conditions into tangible physical safety checklists, surge protection procedures, and evacuation readiness steps.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        {/* Disaster Scenario Simulation Selector */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Interactive Scenario Simulator:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIMULATION_SCENARIOS.map((scen) => {
              const ScenIcon = scen.icon;
              return (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenario(scen);
                    setCheckedItems({});
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    selectedScenario.id === scen.id
                      ? `${scen.color} border shadow-lg`
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <ScenIcon className="w-3.5 h-3.5" />
                  <span>{scen.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Protocol Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Alert Bulletin */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Bulletin
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  selectedScenario.severity === 'extreme'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {selectedScenario.severity} Hazard
              </span>
            </div>

            <h2 className="text-lg font-bold text-white leading-snug">
              {selectedScenario.headline}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
              {selectedScenario.description}
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NOAA Broadcast Code:</span>
                </span>
                <span className="font-mono text-slate-200">WXR-9902</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                  <span>Grid Failure Risk:</span>
                </span>
                <span className="font-semibold text-rose-400">High (65%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-blue-400" />
                  <span>Safe Shelter Directive:</span>
                </span>
                <span className="text-slate-200">Substantial Interior</span>
              </div>
            </div>

            <button
              onClick={() =>
                onAskAi(
                  `Generate customized emergency survival instructions for a ${selectedScenario.name} scenario in ${activeCity}. Detail indoor power surge mitigation, food/water storage, and child/pet safety.`
                )
              }
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Ask AI for Local Emergency Guidance</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Actionable Interactive Safety Checklist */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{selectedScenario.checklistTitle}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tick each safety protocol as you complete physical preparations
              </p>
            </div>

            {/* Progress Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-white">
                  {completedItems} of {totalItems} Done
                </span>
                <span className="text-[10px] text-slate-400 block">{progressPercent}% complete</span>
              </div>
              <div className="w-12 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {selectedScenario.checklistItems.map((item, idx) => {
              const isDone = !!checkedItems[item];
              return (
                <button
                  key={idx}
                  onClick={() => toggleCheck(item)}
                  className={`w-full p-4 rounded-2xl text-left border flex items-start gap-3.5 transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-white'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className={`text-xs font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {item}
                    </p>
                    <span className="text-[10px] text-slate-500">Protocol Step #{idx + 1}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Emergency Resources Note */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-rose-400" />
              <span>In immediate life-threatening danger, dial local emergency services (911 / 112 / 999).</span>
            </div>
            <button
              onClick={() => setCheckedItems({})}
              className="text-[11px] text-slate-500 hover:text-slate-300 underline"
            >
              Reset Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
