import "./App.css";
import { useState } from "react";
import TaskInput from "./components/TaskInput";
import type { Task } from "./types";

function App() {
  const [taskList, setTaskList] = useState<Task[]>([]);

  return (
    <main>
      <TaskInput />
    </main>
  );
}

export default App;
