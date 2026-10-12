export interface WeatherData {
  temp: number;
  pressure: number;
  condition: string;
}

export interface AlmanacVerdict {
  fishingScore: number;
  fishingAdvice: string;
  plantingAdvice: string;
  plantingTrigger: string;
  moonPhase: string;
}

export interface PublicApiItem {
  id: string;
  name: string;
  url: string;
  description: string;
  auth: string;
  https: boolean;
  cors: string;
  category: string;
}
