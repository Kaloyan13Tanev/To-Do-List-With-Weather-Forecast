import { useState } from "react";
import type { Task } from "./types";
import { TaskInput } from "./components/task-input/TaskInput";
import { TaskList } from "./components/task-list/TaskList";
import "./App.css";
import { WeatherForecast } from "./components/weather-forecast/WeatherForecast";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <main>
      <TaskInput setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
      <WeatherForecast />
    </main>
  );
}

export default App;
