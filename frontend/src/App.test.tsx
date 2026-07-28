import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import App from "./App";
import type { Task } from "./types";

vi.mock("axios");
vi.mock("./components/weather-forecast/WeatherForecast", () => ({
  WeatherForecast: () => <div data-testid="weather-forecast" />,
}));

describe("App component", () => {
  const firstTask: Task = { id: "1", text: "First Task", done: false };
  const secondTask: Task = { id: "2", text: "Second Task", done: false };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.get).mockResolvedValue({ data: [firstTask, secondTask] });
  });

  it("loads the tasks from the server on mount", async () => {
    render(<App />);

    expect(await screen.findByText("First Task")).toBeInTheDocument();
    expect(screen.getByText("Second Task")).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith("/tasks");
  });

  it("renders the weather panel and the task input", async () => {
    render(<App />);
    await screen.findByText("First Task");

    expect(screen.getByTestId("weather-forecast")).toBeInTheDocument();
    expect(screen.getByTestId("input-area")).toBeInTheDocument();
  });
});
