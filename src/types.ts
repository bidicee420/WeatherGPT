export interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  admin1?: string; // state/region
  elevation?: number;
  timezone?: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparent_temperature: number;
  relative_humidity: number;
  precipitation: number;
  weather_code: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m?: number;
  uv_index: number;
  cloud_cover?: number;
  is_day: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max: number[];
}

export interface AirQualityData {
  time: string[];
  european_aqi?: number[];
  us_aqi?: number[];
  pm10?: number[];
  pm2_5?: number[];
  ozone?: number[];
  nitrogen_dioxide?: number[];
  current?: {
    us_aqi: number;
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    nitrogen_dioxide: number;
    uv_index?: number;
  };
}

export interface FullWeatherTelemetry {
  location: Coordinates;
  current: CurrentWeatherData;
  hourly: HourlyWeatherData;
  daily: DailyWeatherData;
  airQuality?: AirQualityData;
  alerts?: WeatherAlert[];
}

export interface WeatherAlert {
  id: string;
  event: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  headline: string;
  description: string;
  instruction?: string;
  effective: string;
  expires: string;
  emergencyChecklist?: {
    title: string;
    items: string[];
  };
}

export interface RouteWaypointWeather {
  city: string;
  coordinates: Coordinates;
  distanceFromStartKm?: number;
  estimatedArrivalHours?: number;
  temperature: number;
  condition: string;
  weatherCode: number;
  precipitationProb: number;
  windSpeed: number;
  hazardLevel: 'safe' | 'caution' | 'warning' | 'severe';
  hazardDetails: string;
}

export interface RouteTravelAdvisory {
  origin: string;
  destination: string;
  totalDistanceKm: number;
  estimatedDriveHours: number;
  overallCondition: string;
  overallHazard: 'safe' | 'caution' | 'warning' | 'severe';
  summary: string;
  routeStops: RouteWaypointWeather[];
  safetyRecommendations: string[];
}

export interface ClimateAnomalyData {
  location: Coordinates;
  targetDateOrMonth: string;
  currentTempMax: number;
  currentTempMin: number;
  currentPrecip: number;
  baseline10YrTempMax: number;
  baseline10YrTempMin: number;
  baseline10YrPrecip: number;
  tempAnomaly: number; // +2.4 C above average
  precipAnomalyPercent: number;
  trendSummary: string;
  yearlyHistory: {
    year: number;
    avgTempMax: number;
    avgTempMin: number;
    totalPrecip: number;
  }[];
}

export interface ToolInvocationLog {
  name: string;
  args: Record<string, unknown>;
  timestamp: string;
  status: 'running' | 'completed' | 'failed';
  resultSummary?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolInvocations?: ToolInvocationLog[];
  telemetryPayload?: {
    type: 'current_weather' | 'route_advisory' | 'climate_anomaly' | 'emergency_alert';
    data: FullWeatherTelemetry | RouteTravelAdvisory | ClimateAnomalyData | WeatherAlert[];
  };
  suggestedFollowups?: string[];
}

export interface PitchSlide {
  id: number;
  section: string;
  title: string;
  subtitle: string;
  points: string[];
  demoQuery?: string;
  badge: string;
}
