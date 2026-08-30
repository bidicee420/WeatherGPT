import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudHail,
  Wind,
  Tornado,
  Eye,
  Thermometer,
  Droplets,
  Compass,
  Zap,
  ShieldAlert,
  SunMedium
} from 'lucide-react';

export interface WeatherConditionInfo {
  label: string;
  description: string;
  icon: typeof Sun;
  gradient: string;
  badgeColor: string;
  isSevere: boolean;
}

export function getWeatherCondition(code: number, isDay = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright sunshine and calm skies' : 'Starlit and calm atmospheric conditions',
        icon: isDay ? Sun : SunMedium,
        gradient: isDay ? 'from-amber-500/20 via-orange-500/10 to-transparent' : 'from-indigo-900/30 via-slate-900 to-transparent',
        badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        isSevere: false,
      };
    case 1:
    case 2:
      return {
        label: isDay ? 'Partly Cloudy' : 'Partly Cloudy Night',
        description: 'Scattered clouds with mild solar radiation',
        icon: CloudSun,
        gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
        badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
        isSevere: false,
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense stratus cloud canopy',
        icon: Cloud,
        gradient: 'from-slate-600/20 via-slate-700/10 to-transparent',
        badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
        isSevere: false,
      };
    case 45:
    case 48:
      return {
        label: 'Fog / Low Visibility',
        description: 'Thick fog layer, reduced horizontal visibility',
        icon: CloudFog,
        gradient: 'from-zinc-500/20 via-zinc-700/10 to-transparent',
        badgeColor: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
        isSevere: false,
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Fine liquid precipitation droplets',
        icon: CloudDrizzle,
        gradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
        badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        isSevere: false,
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Sub-zero freezing drizzle with icing risk on roadways',
        icon: CloudSnow,
        gradient: 'from-cyan-400/20 via-indigo-500/10 to-transparent',
        badgeColor: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30',
        isSevere: true,
      };
    case 61:
    case 63:
      return {
        label: 'Rain',
        description: 'Steady rainfall with moderate ground saturation',
        icon: CloudRain,
        gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
        badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        isSevere: false,
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Intense precipitation with localized pooling risk',
        icon: CloudRain,
        gradient: 'from-indigo-600/30 via-blue-700/20 to-transparent',
        badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        isSevere: false,
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Hazardous black ice conditions on road surfaces',
        icon: CloudSnow,
        gradient: 'from-cyan-500/30 via-slate-800 to-transparent',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        isSevere: true,
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowfall',
        description: 'Solid crystalline precipitation accumulation',
        icon: CloudSnow,
        gradient: 'from-cyan-300/20 via-blue-900/20 to-transparent',
        badgeColor: 'bg-cyan-300/10 text-cyan-200 border-cyan-300/30',
        isSevere: false,
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Violent Rain Showers',
        description: 'Sudden convective downpours and squalls',
        icon: CloudRain,
        gradient: 'from-blue-700/30 via-indigo-900/20 to-transparent',
        badgeColor: 'bg-blue-400/20 text-blue-200 border-blue-400/40',
        isSevere: false,
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers / Squalls',
        description: 'Gusty intermittent heavy snow squalls',
        icon: CloudSnow,
        gradient: 'from-slate-400/20 via-cyan-900/20 to-transparent',
        badgeColor: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
        isSevere: true,
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Convective storm system with lightning and gusts',
        icon: CloudLightning,
        gradient: 'from-purple-600/30 via-amber-600/10 to-transparent',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        isSevere: true,
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm & Hail',
        description: 'Severe convective supercell with damaging hail potential',
        icon: CloudHail,
        gradient: 'from-rose-600/30 via-purple-700/20 to-transparent',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        isSevere: true,
      };
    default:
      return {
        label: 'Variable Conditions',
        description: 'Mixed atmospheric metrics',
        icon: Cloud,
        gradient: 'from-slate-700/20 to-transparent',
        badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
        isSevere: false,
      };
  }
}

export function formatTemperature(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWindSpeed(kmh: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getAqiStatus(usAqi: number): { label: string; color: string; desc: string } {
  if (usAqi <= 50) return { label: 'Good', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', desc: 'Air quality is satisfactory with low health risk.' };
  if (usAqi <= 100) return { label: 'Moderate', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', desc: 'Acceptable; sensitive individuals may experience minor irritation.' };
  if (usAqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', desc: 'General public not likely affected; active children and adults with respiratory issues should limit prolonged outdoor exertion.' };
  if (usAqi <= 200) return { label: 'Unhealthy', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10', desc: 'Everyone may begin to experience health effects.' };
  if (usAqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', desc: 'Health alert: increased risk for everyone.' };
  return { label: 'Hazardous', color: 'text-red-500 border-red-500/40 bg-red-500/20', desc: 'Emergency health warning: serious impacts on entire population.' };
}

export function getUvCategory(uvIndex: number): { label: string; color: string; recommendation: string } {
  if (uvIndex <= 2) return { label: 'Low', color: 'text-emerald-400', recommendation: 'Minimal protection required. Safe for normal outdoor exposure.' };
  if (uvIndex <= 5) return { label: 'Moderate', color: 'text-yellow-400', recommendation: 'Wear sunglasses and SPF 30+ sunscreen. Seek shade during midday.' };
  if (uvIndex <= 7) return { label: 'High', color: 'text-amber-400', recommendation: 'Protection essential. Hat, sunglasses, sunscreen, and cover up.' };
  if (uvIndex <= 10) return { label: 'Very High', color: 'text-rose-400', recommendation: 'Extra precautions. Avoid midday sun exposure between 11 AM - 4 PM.' };
  return { label: 'Extreme', color: 'text-purple-400', recommendation: 'Take all precautions. Unprotected skin can burn in minutes.' };
}
