export type LocalWeatherStatus =
  | "idle"
  | "unsupported"
  | "needs-permission"
  | "loading"
  | "ready"
  | "denied"
  | "error";

export interface LocalWeather {
  temperatureC: number;
  condition: string;
  weatherCode: number;
  precipitationMm: number;
  cloudCover: number;
  sunriseAt: Date;
  sunsetAt: Date;
  updatedAt: Date;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    precipitation?: number;
    cloud_cover?: number;
  };
  daily?: {
    sunrise?: number[];
    sunset?: number[];
  };
}

function describeCloudCover(cloudCover: number): string {
  if (cloudCover < 15) return "Clear";
  if (cloudCover < 45) return "Mostly clear";
  if (cloudCover < 75) return "Partly cloudy";
  return "Cloudy";
}

export function describeWeatherCode({
  code,
  precipitationMm,
  cloudCover,
}: {
  code: number;
  precipitationMm: number;
  cloudCover: number;
}): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) {
    return precipitationMm > 0 ? "Drizzle" : describeCloudCover(cloudCover);
  }
  if (code >= 61 && code <= 67) {
    return precipitationMm > 0 ? "Rain" : describeCloudCover(cloudCover);
  }
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) {
    return precipitationMm > 0 ? "Showers" : describeCloudCover(cloudCover);
  }
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Weather";
}

export async function fetchLocalWeather({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<LocalWeather> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: "temperature_2m,weather_code,precipitation,cloud_cover",
    daily: "sunrise,sunset",
    timezone: "auto",
    timeformat: "unixtime",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const temperatureC = data.current?.temperature_2m;
  const weatherCode = data.current?.weather_code;
  const precipitationMm = data.current?.precipitation;
  const cloudCover = data.current?.cloud_cover;
  const sunrise = data.daily?.sunrise?.[0];
  const sunset = data.daily?.sunset?.[0];

  if (
    typeof temperatureC !== "number" ||
    typeof weatherCode !== "number" ||
    typeof precipitationMm !== "number" ||
    typeof cloudCover !== "number" ||
    typeof sunrise !== "number" ||
    typeof sunset !== "number"
  ) {
    throw new Error("Open-Meteo response was missing expected weather fields");
  }

  return {
    temperatureC,
    condition: describeWeatherCode({ code: weatherCode, precipitationMm, cloudCover }),
    weatherCode,
    precipitationMm,
    cloudCover,
    sunriseAt: new Date(sunrise * 1000),
    sunsetAt: new Date(sunset * 1000),
    updatedAt: new Date(),
  };
}
