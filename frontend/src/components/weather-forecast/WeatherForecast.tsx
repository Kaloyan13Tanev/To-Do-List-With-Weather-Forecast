import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  code: number;
  maxTemp: number;
  minTemp: number;
}

export function WeatherForecast() {
  const [weather, setWeather] = useState<Weather | null>(null);

  const loadWeather = async () => {
    const params = {
      latitude: 42.6975,
      longitude: 23.3241,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "wind_speed_10m",
        "weather_code",
      ],
      daily: ["temperature_2m_max", "temperature_2m_min"],
      timezone: "auto",
      forecast_days: 1,
    };

    const responses = await fetchWeatherApi(
      "https://api.open-meteo.com/v1/forecast",
      params,
    );
    const response = responses[0];

    const current = response.current()!;
    const daily = response.daily()!;

    setWeather({
      temperature: current.variables(0)!.value(),
      humidity: current.variables(1)!.value(),
      windSpeed: current.variables(2)!.value(),
      code: current.variables(3)!.value(),
      maxTemp: daily.variables(0)!.valuesArray()![0],
      minTemp: daily.variables(1)!.valuesArray()![0],
    });
  };

  useEffect(() => {
    loadWeather();
    const id = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) {
    return <div className="card p-3">Loading weather…</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="text-center">
          <h5 className="card-title">Sofia</h5>

          <div className="display-4">{Math.round(weather.temperature)}°</div>

          <div className="text-muted">
            H: {Math.round(weather.maxTemp)}° · L: {Math.round(weather.minTemp)}
            °
          </div>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <span>Humidity</span>
          <span>{Math.round(weather.humidity)}%</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Wind</span>
          <span>{Math.round(weather.windSpeed)} km/h</span>
        </div>
      </div>
    </div>
  );
}
