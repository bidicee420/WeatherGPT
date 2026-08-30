import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Activity,
  Car,
  TrendingUp,
  ShieldAlert,
  Thermometer,
  Wind,
  Droplets,
  CloudRain,
  MapPin,
  RefreshCw,
  Mic,
  MicOff,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { ChatMessage, FullWeatherTelemetry, RouteTravelAdvisory, ClimateAnomalyData } from '../types';
import { getWeatherCondition, formatTemperature, formatWindSpeed } from '../utils/weatherIcons';

interface WeatherChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  tempUnit: 'C' | 'F';
  onNavigateTab: (tab: 'dashboard' | 'route' | 'climate' | 'emergency') => void;
  activeCity: string;
}

const HACKATHON_DEMO_PROMPTS = [
  {
    label: '🚗 Multi-Hop Route Advisory',
    prompt: 'I am driving from New York to Boston tomorrow morning. Will I encounter rain or icy roads along the way?',
    tag: 'Differentiator #1',
  },
  {
    label: '🌍 10-Yr Climate Anomaly',
    prompt: "Is today's temperature in London unusual compared to the 10-year historical climate baseline?",
    tag: 'Differentiator #2',
  },
  {
    label: '⚠️ Emergency Protocols',
    prompt: 'Run a severe convective storm check for Miami and display practical emergency safety protocols.',
    tag: 'Differentiator #3',
  },
  {
    label: '🧳 Multi-City Packing Advisor',
    prompt: 'What clothing gear and layers should I pack for a 5-day journey visiting Tokyo, Kyoto, and Sapporo this week?',
    tag: 'Travel Planning',
  },
];

export const WeatherChat: React.FC<WeatherChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  tempUnit,
  onNavigateTab,
  activeCity,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice speech-to-text setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render markdown styled content
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          // Check for [ALERT]
          if (line.includes('[ALERT]') || line.startsWith('⚠️') || line.includes('WARNING')) {
            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-200 font-medium my-2 flex items-start gap-2.5"
              >
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>{line.replace('[ALERT]', '').trim()}</div>
              </div>
            );
          }

          // Headers
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-semibold text-slate-100 text-sm mt-3 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ') || line.startsWith('# ')) {
            return (
              <h3 key={idx} className="font-bold text-slate-100 text-base mt-4 mb-2">
                {line.replace(/^#+\s/, '')}
              </h3>
            );
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const cleanText = line.substring(2);
            // highlight bold words
            const parts = cleanText.split(/(\*\*.*?\*\*)/g);
            return (
              <li key={idx} className="ml-4 list-disc text-slate-300">
                {parts.map((p, pIdx) => {
                  if (p.startsWith('**') && p.endsWith('**')) {
                    return (
                      <strong key={pIdx} className="text-cyan-200 font-semibold">
                        {p.slice(2, -2)}
                      </strong>
                    );
                  }
                  return p;
                })}
              </li>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(line)) {
            const cleanText = line.replace(/^\d+\.\s/, '');
            return (
              <div key={idx} className="ml-2 flex items-start gap-2 text-slate-300">
                <span className="text-cyan-400 font-mono text-xs mt-0.5">
                  {line.match(/^\d+\./)?.[0]}
                </span>
                <span>{cleanText}</span>
              </div>
            );
          }

          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Regular paragraph with bolding support
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className="text-slate-300">
              {parts.map((p, pIdx) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="text-white font-semibold">
                      {p.slice(2, -2)}
                    </strong>
                  );
                }
                return p;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Chat Header Status */}
      <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-200">WeatherGPT Meteorological Agent</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tooling Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Target Focus: <span className="text-cyan-300 font-medium">{activeCity}</span> · Open-Meteo Grounding
            </p>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="px-2.5 py-1 rounded-md text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50 flex items-center gap-1 transition-colors"
          >
            <span>Telemetry</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => onNavigateTab('route')}
            className="px-2.5 py-1 rounded-md text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50 flex items-center gap-1 transition-colors"
          >
            <span>Route Map</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Welcome Empty State if only initial message */}
        {messages.length <= 1 && (
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 text-center max-w-2xl mx-auto my-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Conversational Weather & Climate Intelligence
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Ask anything about real-time weather forecasts, multi-hop driving routes with road hazard detection, 10-year historical climate trends, or actionable severe storm emergency protocols.
            </p>

            <div className="text-left">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Featured Hackathon Demonstrations:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HACKATHON_DEMO_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    id={`demo-prompt-${idx}`}
                    onClick={() => {
                      setInputText(item.prompt);
                      onSendMessage(item.prompt);
                    }}
                    className="p-3 text-left rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                        {item.label}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-cyan-950 group-hover:text-cyan-300">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      "{item.prompt}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-md shadow-cyan-600/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl shadow-sm ${
                    isUser
                      ? 'bg-blue-600/90 text-white rounded-tr-none'
                      : 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-tl-none backdrop-blur-md'
                  }`}
                >
                  {/* Tool Invocations Badge if any */}
                  {!isUser && msg.toolInvocations && msg.toolInvocations.length > 0 && (
                    <div className="mb-3 space-y-1.5 pb-2 border-b border-slate-800/60">
                      <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Agentic Telemetry Invocations</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.toolInvocations.map((tool, tIdx) => (
                          <div
                            key={tIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-900 border border-slate-800 text-cyan-300 font-mono"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{tool.name}</span>
                            {tool.resultSummary && (
                              <span className="text-slate-400 font-sans text-[10px]">
                                ({tool.resultSummary})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Content */}
                  {isUser ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    renderFormattedContent(msg.content)
                  )}

                  {/* Telemetry Payload Card Widget */}
                  {!isUser && msg.telemetryPayload && (
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      {msg.telemetryPayload.type === 'route_advisory' && (
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs font-bold text-slate-200">
                                Route Telemetry Summary
                              </span>
                            </div>
                            <button
                              onClick={() => onNavigateTab('route')}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                            >
                              <span>Open Route Map</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                              <span className="text-slate-500 block text-[10px]">Route Legs</span>
                              <span className="font-semibold text-slate-200">
                                {(msg.telemetryPayload.data as RouteTravelAdvisory).routeStops?.length || 2} Stops
                              </span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                              <span className="text-slate-500 block text-[10px]">Total Distance</span>
                              <span className="font-semibold text-slate-200">
                                {(msg.telemetryPayload.data as RouteTravelAdvisory).totalDistanceKm} km
                              </span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                              <span className="text-slate-500 block text-[10px]">Est. Drive Time</span>
                              <span className="font-semibold text-slate-200">
                                {(msg.telemetryPayload.data as RouteTravelAdvisory).estimatedDriveHours} hrs
                              </span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                              <span className="text-slate-500 block text-[10px]">Hazard Status</span>
                              <span
                                className={`font-bold uppercase text-[10px] ${
                                  (msg.telemetryPayload.data as RouteTravelAdvisory).overallHazard === 'safe'
                                    ? 'text-emerald-400'
                                    : 'text-rose-400'
                                }`}
                              >
                                {(msg.telemetryPayload.data as RouteTravelAdvisory).overallHazard}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.telemetryPayload.type === 'climate_anomaly' && (
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-bold text-slate-200">
                                10-Year Climate Anomaly Analysis
                              </span>
                            </div>
                            <button
                              onClick={() => onNavigateTab('climate')}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                            >
                              <span>Inspect Climate Graph</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-xs text-slate-300">
                            Anomaly: <strong className="text-amber-300">{(msg.telemetryPayload.data as ClimateAnomalyData).tempAnomaly > 0 ? `+${(msg.telemetryPayload.data as ClimateAnomalyData).tempAnomaly}` : (msg.telemetryPayload.data as ClimateAnomalyData).tempAnomaly}°C</strong> compared to 10-year historical baseline.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bottom Action Bar */}
                  {!isUser && (
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Followups */}
                {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowups.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          setInputText(sug);
                          onSendMessage(sug);
                        }}
                        className="px-2.5 py-1 rounded-full text-xs bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center gap-1"
                      >
                        <span>{sug}</span>
                        <ChevronRight className="w-2.5 h-2.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner / Tool Running Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 rounded-tl-none max-w-md shadow-lg space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs font-medium text-slate-300">
                  Querying Open-Meteo telemetry & Gemini reasoning...
                </span>
              </div>
              <div className="flex gap-1.5 text-[11px] font-mono text-cyan-400/80">
                <span className="animate-pulse">Fetching atmospheric vectors...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Box */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800/80">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="weather-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about weather, multi-hop road trips, climate shifts, or severe storm checklists..."
              className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
              disabled={isLoading}
            />
            {/* Voice Input Button */}
            <button
              type="button"
              id="voice-input-btn"
              onClick={toggleVoice}
              title={isListening ? 'Stop listening' : 'Voice Input'}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between px-1">
          <span>Supported: Open-Meteo REST Grounding · Multi-turn Conversation · Route Traversal</span>
          <span className="font-mono text-cyan-400/80">Gemini 3.7 Flash</span>
        </div>
      </div>
    </div>
  );
};
