export interface WorldCity {
  name: string;
  timezone: string;
  country: string;
  emoji: string;
}

export const DEFAULT_WORLD_CITIES: WorldCity[] = [
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brasil', emoji: '🇧🇷' },
  { name: 'Nova York', timezone: 'America/New_York', country: 'EUA', emoji: '🇺🇸' },
  { name: 'Londres', timezone: 'Europe/London', country: 'Reino Unido', emoji: '🇬🇧' },
  { name: 'Paris', timezone: 'Europe/Paris', country: 'França', emoji: '🇫🇷' },
  { name: 'Dubai', timezone: 'Asia/Dubai', country: 'Emirados', emoji: '🇦🇪' },
  { name: 'Tóquio', timezone: 'Asia/Tokyo', country: 'Japão', emoji: '🇯🇵' },
  { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Austrália', emoji: '🇦🇺' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'EUA', emoji: '🇺🇸' },
];

export const EXTRA_WORLD_CITIES: WorldCity[] = [
  { name: 'Chicago', timezone: 'America/Chicago', country: 'EUA', emoji: '🇺🇸' },
  { name: 'Toronto', timezone: 'America/Toronto', country: 'Canadá', emoji: '🇨🇦' },
  { name: 'México City', timezone: 'America/Mexico_City', country: 'México', emoji: '🇲🇽' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', emoji: '🇦🇷' },
  { name: 'Lisboa', timezone: 'Europe/Lisbon', country: 'Portugal', emoji: '🇵🇹' },
  { name: 'Madrid', timezone: 'Europe/Madrid', country: 'Espanha', emoji: '🇪🇸' },
  { name: 'Berlim', timezone: 'Europe/Berlin', country: 'Alemanha', emoji: '🇩🇪' },
  { name: 'Roma', timezone: 'Europe/Rome', country: 'Itália', emoji: '🇮🇹' },
  { name: 'Moscou', timezone: 'Europe/Moscow', country: 'Rússia', emoji: '🇷🇺' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'Índia', emoji: '🇮🇳' },
  { name: 'Singapura', timezone: 'Asia/Singapore', country: 'Singapura', emoji: '🇸🇬' },
  { name: 'Xangai', timezone: 'Asia/Shanghai', country: 'China', emoji: '🇨🇳' },
  { name: 'Seul', timezone: 'Asia/Seoul', country: 'Coreia do Sul', emoji: '🇰🇷' },
  { name: 'Cairo', timezone: 'Africa/Cairo', country: 'Egito', emoji: '🇪🇬' },
  { name: 'Lagos', timezone: 'Africa/Lagos', country: 'Nigéria', emoji: '🇳🇬' },
  { name: 'Joanesburgo', timezone: 'Africa/Johannesburg', country: 'África do Sul', emoji: '🇿🇦' },
  { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'Nova Zelândia', emoji: '🇳🇿' },
  { name: 'Honolulu', timezone: 'Pacific/Honolulu', country: 'EUA (Havaí)', emoji: '🇺🇸' },
];

export const ALL_WORLD_CITIES: WorldCity[] = [...DEFAULT_WORLD_CITIES, ...EXTRA_WORLD_CITIES];
