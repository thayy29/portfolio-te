import { useState, useEffect } from 'react';
import type { WeatherData } from '../types';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current=temperature_2m,weather_code&timezone=America/Sao_Paulo'
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
          });
        }
      })
      .catch(() => setWeather({ temperature: 24, weatherCode: 0 }));
  }, []);

  return weather;
}
