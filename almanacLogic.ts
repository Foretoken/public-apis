// utils/almanacLogic.ts

interface WeatherData {
  temp: number; // Current temperature in F
  pressure: number; // Barometric pressure in hPa
  condition: string; // e.g., 'Clear', 'Rain', 'Snow'
}

interface AlmanacVerdict {
  fishingScore: number; // 1 to 10
  fishingAdvice: string;
  plantingAdvice: string;
  plantingTrigger: string; // Used to trigger specific Amazon Affiliates
  moonPhase: string;
}

/**
 * Calculates the current Moon Phase based on the date.
 */
function getMoonPhase(date: Date): string {
  const lp = 2551443;
  const now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 35, 0);
  const newMoon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  const daysIntoCycle = Math.floor(phase / (24 * 3600));

  if (daysIntoCycle === 0 || daysIntoCycle === 29) return "New Moon";
  if (daysIntoCycle > 0 && daysIntoCycle < 7) return "Waxing Crescent";
  if (daysIntoCycle === 7) return "First Quarter";
  if (daysIntoCycle > 7 && daysIntoCycle < 14) return "Waxing Gibbous";
  if (daysIntoCycle === 14 || daysIntoCycle === 15) return "Full Moon";
  if (daysIntoCycle > 15 && daysIntoCycle < 22) return "Waning Gibbous";
  if (daysIntoCycle === 22) return "Last Quarter";
  return "Waning Crescent";
}

/**
 * Main function to generate the daily Almanac Verdict for Tazewell (Zone 7a/7b)
 */
export function generateDailyAlmanac(currentDate: Date, weather: WeatherData): AlmanacVerdict {
  // Safety check: Default values if weather data is missing
  const safeWeather = {
    temp: weather?.temp ?? 60,
    pressure: weather?.pressure ?? 1013,
    condition: weather?.condition ?? 'Clear'
  };

  const moonPhase = getMoonPhase(currentDate);
  const month = currentDate.getMonth() + 1; 
  const day = currentDate.getDate();

  // 1. --- PLANTING LOGIC (Zone 7a/7b Tazewell, VA) ---
  let plantingAdvice = "";
  let plantingTrigger = "none";

  if (month >= 11 || month <= 2) {
    plantingAdvice = "Winter dormancy. Too cold for outdoor planting. Focus on soil prep or indoor seed starting.";
    plantingTrigger = "Indoor_Seeds";
  } else if (month === 3 || (month === 4 && day < 15)) {
    plantingAdvice = "Approaching last frost (April 15). Safe for peas and radishes. Keep warm-weather crops inside!";
    plantingTrigger = "Cold_Hardy_Seeds";
  } else if ((month === 4 && day >= 15) || month === 5 || month === 6) {
    plantingAdvice = "Peak planting season! No frost risk. Ideal time for tomatoes, peppers, and summer squash.";
    plantingTrigger = "Summer_Garden_Kits";
  } else if (month === 7 || month === 8) {
    if (safeWeather.temp > 85) {
      plantingAdvice = "High heat alert. Water deeply at the roots. Postpone any new transplants until it cools.";
      plantingTrigger = "Irrigation_Hoses";
    } else {
      plantingAdvice = "Mid-summer harvest. Great window to start your fall kale, broccoli, and carrots.";
      plantingTrigger = "Harvest_Tools";
    }
  } else if (month === 9 || month === 10) {
    plantingAdvice = "Fall harvest is here! Prepare for the first frost (Oct 15). Perfect time to plant garlic bulbs.";
    plantingTrigger = "Fall_Prep";
  }

  // 2. --- FISHING LOGIC ---
  let fishingScore = 5; 
  let fishingAdvice = "Fair conditions for local fishing today.";

  if (moonPhase === "Full Moon" || moonPhase === "New Moon") fishingScore += 3;
  if (moonPhase.includes("Quarter")) fishingScore -= 1;

  if (safeWeather.pressure >= 1010 && safeWeather.pressure <= 1022) {
    fishingScore += 2;
  } else if (safeWeather.pressure < 1005) {
    fishingScore += 1;
    fishingAdvice = "Pressure is dropping. Fish are likely feeding aggressively ahead of the front!";
  } else if (safeWeather.pressure > 1025) {
    fishingScore -= 2;
    fishingAdvice = "High pressure system. Fish may be sluggish; try slow-moving lures in deeper water.";
  }

  if (safeWeather.condition === "Rain") fishingScore += 1;
  if (safeWeather.condition === "Snow" || safeWeather.temp < 35) {
    fishingScore -= 4;
    fishingAdvice = "Freezing temperatures. Fishing will be slow; bundle up and stay safe near the water.";
  }

  fishingScore = Math.max(1, Math.min(10, fishingScore));

  if (fishingScore >= 8) {
    fishingAdvice = `Excellent conditions! The ${moonPhase} and pressure align for a great day on the Clinch River.`;
  } else if (fishingScore === 10) {
    fishingAdvice = `PERFECT 10! The ${moonPhase} and barometric pressure are ideal. Grab your gear and go!`;
  }

  return { fishingScore, fishingAdvice, plantingAdvice, plantingTrigger, moonPhase };
}
