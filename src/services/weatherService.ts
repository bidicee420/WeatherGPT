import {
  FullWeatherTelemetry,
  ChatMessage,
  RouteTravelAdvisory,
  ClimateAnomalyData,
  PitchSlide,
} from '../types';

export async function sendWeatherQuery(
  prompt: string,
  history: ChatMessage[] = []
): Promise<{
  content: string;
  toolInvocations?: any[];
  telemetryPayload?: any;
  suggestedFollowups?: string[];
}> {
  const formattedHistory = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const res = await fetch('/api/weather/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      conversationHistory: formattedHistory,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Query failed' }));
    throw new Error(errData.error || `HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getQuickWeather(
  city?: string,
  lat?: number,
  lon?: number
): Promise<FullWeatherTelemetry> {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (lat !== undefined && lon !== undefined) {
    params.set('lat', lat.toString());
    params.set('lon', lon.toString());
  }

  const res = await fetch(`/api/weather/quick-lookup?${params.toString()}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Lookup failed' }));
    throw new Error(errData.error || `HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getRouteAdvisory(
  origin: string,
  destination: string,
  waypoints: string[] = []
): Promise<RouteTravelAdvisory> {
  const res = await fetch('/api/weather/route-advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, waypoints }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Route calculation failed' }));
    throw new Error(errData.error || `HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getClimateAnomaly(
  city?: string,
  lat?: number,
  lon?: number
): Promise<ClimateAnomalyData> {
  const res = await fetch('/api/weather/climate-anomaly', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, lat, lon }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Climate anomaly failed' }));
    throw new Error(errData.error || `HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getPitchDeck(): Promise<{
  title: string;
  tagline: string;
  slides: PitchSlide[];
}> {
  const res = await fetch('/api/weather/hackathon-pitch');
  if (!res.ok) {
    throw new Error('Failed to load pitch deck');
  }
  return await res.json();
}
