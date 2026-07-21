import { useState } from "react";
import type { Task } from "./types";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/task-list/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <main>
      <TaskInput setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </main>
  );
}

export default App;
