import React, { useState, useEffect } from 'react';
import {
  Navbar,
} from './components/Navbar';
import {
  WeatherChat,
} from './components/WeatherChat';
import {
  TelemetryDashboard,
} from './components/TelemetryDashboard';
import {
  RouteAdvisor,
} from './components/RouteAdvisor';
import {
  ClimateAnomaly,
} from './components/ClimateAnomaly';
import {
  EmergencyProtocols,
} from './components/EmergencyProtocols';
import {
  PitchDeckModal,
} from './components/PitchDeckModal';
import {
  sendWeatherQuery,
  getQuickWeather,
  getRouteAdvisory,
  getClimateAnomaly,
} from './services/weatherService';
import {
  ChatMessage,
  FullWeatherTelemetry,
  RouteTravelAdvisory,
  ClimateAnomalyData,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'route' | 'climate' | 'emergency'>('chat');
  const [activeCity, setActiveCity] = useState<string>('New York');
  const [telemetry, setTelemetry] = useState<FullWeatherTelemetry | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState<boolean>(false);
  const [isLoadingGps, setIsLoadingGps] = useState<boolean>(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to WeatherGPT 👋
I am your **agentic meteorological assistant and climate intelligence system**, powered by Google Gemini and live Open-Meteo telemetry grounding.

I can help you with:
- **Real-Time Forecasts & Attire Advice**: Precision temperature, UV, barometric pressure, and wind chill.
- **Multi-Hop Road Trip Routing**: Time-sliced highway waypoint forecasts with black ice and hydroplaning risk detection.
- **10-Year Climate Anomaly Comparisons**: Historical climate baseline vs. current temperatures.
- **Actionable Emergency Protocols**: Step-by-step physical safety checklists for severe convective storms and blizzards.

*Try selecting one of the featured hackathon demo prompts below, or type any weather question!*`,
      timestamp: new Date().toISOString(),
      suggestedFollowups: [
        'I am driving from New York to Boston tomorrow morning. Will I encounter rain or icy roads along the way?',
        "Is today's temperature in London unusual compared to the 10-year historical climate average?",
        'Run a severe convective storm check for Miami and display practical emergency safety protocols.',
        'What should I pack for a 5-day trip covering Tokyo, Kyoto, and Sapporo this week?',
      ],
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Initial fetch for default city
  useEffect(() => {
    loadWeatherData(activeCity);
  }, []);

  const loadWeatherData = async (cityName?: string, lat?: number, lon?: number) => {
    setIsLoadingTelemetry(true);
    try {
      const data = await getQuickWeather(cityName, lat, lon);
      setTelemetry(data);
      if (data.location?.name) {
        setActiveCity(data.location.name);
      }
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  const handleSearchCity = (city: string) => {
    setActiveCity(city);
    loadWeatherData(city);
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherData(undefined, pos.coords.latitude, pos.coords.longitude).finally(() =>
          setIsLoadingGps(false)
        );
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLoadingGps(false);
      },
      { timeout: 10000 }
    );
  };

  // Handle conversational message sending
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsChatLoading(true);

    try {
      const response = await sendWeatherQuery(text, newHistory);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        toolInvocations: response.toolInvocations,
        telemetryPayload: response.telemetryPayload,
        suggestedFollowups: response.suggestedFollowups,
      };
      setMessages([...newHistory, assistantMsg]);

      // If response contained fresh current weather telemetry, refresh dashboard
      if (response.telemetryPayload?.type === 'current_weather') {
        setTelemetry(response.telemetryPayload.data as FullWeatherTelemetry);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Weather Intelligence Notice**: ${err.message || 'Unable to retrieve telemetry at this moment. Please verify connection and try again.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAskAiFromComponent = (prompt: string) => {
    setActiveTab('chat');
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
        onSearchCity={handleSearchCity}
        onUseGps={handleUseGps}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        isLoadingLocation={isLoadingGps}
        activeLocationName={activeCity}
      />

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'chat' && (
          <WeatherChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            tempUnit={tempUnit}
            onNavigateTab={setActiveTab}
            activeCity={activeCity}
          />
        )}

        {activeTab === 'dashboard' && (
          <TelemetryDashboard
            telemetry={telemetry}
            tempUnit={tempUnit}
            onAskAi={handleAskAiFromComponent}
            isLoading={isLoadingTelemetry}
          />
        )}

        {activeTab === 'route' && (
          <RouteAdvisor
            onCalculateRoute={getRouteAdvisory}
            onAskAi={handleAskAiFromComponent}
            tempUnit={tempUnit}
          />
        )}

        {activeTab === 'climate' && (
          <ClimateAnomaly
            initialCity={activeCity}
            onFetchAnomaly={getClimateAnomaly}
            onAskAi={handleAskAiFromComponent}
            tempUnit={tempUnit}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyProtocols
            alerts={telemetry?.alerts || []}
            onAskAi={handleAskAiFromComponent}
            activeCity={activeCity}
          />
        )}
      </main>

      {/* Presentation Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
        onRunDemoQuery={(q) => {
          setActiveTab('chat');
          handleSendMessage(q);
        }}
      />
    </div>
  );
}
