import { useEffect, useState } from "react";
import type { Task } from "./types";
import { TaskInput } from "./components/task-input/TaskInput";
import { TaskList } from "./components/task-list/TaskList";
import "./App.css";
import { WeatherForecast } from "./components/weather-forecast/WeatherForecast";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const response = await axios.get<Task[]>("/tasks");
    setTasks(response.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="container app-shell py-3">
      <div className="row fill-row">
        <div className="col-md-3">
          <WeatherForecast />
        </div>
        <div className="col-md-6 fill">
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
        <div className="col-md-3">
          <TaskInput setTasks={setTasks} />
        </div>
      </div>
    </main>
  );
}

export default App;
