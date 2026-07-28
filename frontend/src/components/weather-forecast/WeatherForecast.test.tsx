import { it, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { WeatherForecast } from "./WeatherForecast";
import { fetchWeatherApi } from "openmeteo";

vi.mock("openmeteo", () => ({ fetchWeatherApi: vi.fn() }));

type WeatherResponse = Awaited<ReturnType<typeof fetchWeatherApi>>[number];

const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;

async function advanceBy(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe("WeatherForecast component", () => {
  function weatherResponse(values: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    code: number;
    maxTemp: number;
    minTemp: number;
  }) {
    const current = [
      values.temperature,
      values.humidity,
      values.windSpeed,
      values.code,
    ];
    const daily = [[values.maxTemp], [values.minTemp]];

    return {
      current: () => ({
        variables: (index: number) => ({ value: () => current[index] }),
      }),
      daily: () => ({
        variables: (index: number) => ({ valuesArray: () => daily[index] }),
      }),
    } as unknown as WeatherResponse;
  }

  const sofiaWeather = weatherResponse({
    temperature: 21.6,
    humidity: 64.4,
    windSpeed: 12.7,
    code: 3,
    maxTemp: 24.5,
    minTemp: 11.2,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchWeatherApi).mockResolvedValue([sofiaWeather]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a loading state before the weather arrives", () => {
    vi.mocked(fetchWeatherApi).mockReturnValue(new Promise(() => {}));

    render(<WeatherForecast />);

    expect(screen.getByTestId("weather-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("weather-forecast")).not.toBeInTheDocument();
  });

  it("renders every weather field once loaded", async () => {
    render(<WeatherForecast />);

    expect(await screen.findByTestId("weather-forecast")).toBeInTheDocument();
    expect(screen.queryByTestId("weather-loading")).not.toBeInTheDocument();
    expect(screen.getByTestId("weather-city")).toHaveTextContent("Sofia");
    expect(screen.getByTestId("weather-temperature")).toHaveTextContent("22°");
    expect(screen.getByTestId("weather-high-low")).toHaveTextContent(
      "H: 25° · L: 11°",
    );
    expect(screen.getByTestId("weather-humidity")).toHaveTextContent("64%");
    expect(screen.getByTestId("weather-wind")).toHaveTextContent("13 km/h");
  });

  it("requests the Sofia forecast from Open-Meteo", async () => {
    render(<WeatherForecast />);
    await screen.findByTestId("weather-forecast");

    expect(fetchWeatherApi).toHaveBeenCalledWith(
      "https://api.open-meteo.com/v1/forecast",
      {
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
      },
    );
  });

  it("refreshes the weather every 15 minutes", async () => {
    vi.useFakeTimers();
    render(<WeatherForecast />);

    expect(fetchWeatherApi).toHaveBeenCalledTimes(1);

    await advanceBy(FIFTEEN_MINUTES);
    expect(fetchWeatherApi).toHaveBeenCalledTimes(2);

    await advanceBy(FIFTEEN_MINUTES - ONE_MINUTE);
    expect(fetchWeatherApi).toHaveBeenCalledTimes(2);

    await advanceBy(ONE_MINUTE);
    expect(fetchWeatherApi).toHaveBeenCalledTimes(3);
  });

  it("stops refreshing after unmount", async () => {
    vi.useFakeTimers();
    const { unmount } = render(<WeatherForecast />);

    expect(fetchWeatherApi).toHaveBeenCalledTimes(1);

    unmount();
    await advanceBy(FIFTEEN_MINUTES);

    expect(fetchWeatherApi).toHaveBeenCalledTimes(1);
  });
});
