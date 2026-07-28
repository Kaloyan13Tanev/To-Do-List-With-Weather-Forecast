import axios from "axios";
import { useState } from "react";
import type { Task } from "../../types";

export function TaskInput({ loadTasks }: { loadTasks: () => void }) {
  const [taskText, setTaskText] = useState("");

  async function addTask(taskText: string) {
    await axios.post<Task>("/tasks", { text: taskText });
    await loadTasks();
    setTaskText("");
  }

  return (
    <>
      <textarea
        data-testid="input-area"
        className="form-control"
        placeholder="Write your task here"
        id="floatingTextarea2"
        style={{ height: "100px" }}
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      ></textarea>
      <button
        data-testid="add-button"
        className="btn btn-success w-100"
        onClick={async () => {
          addTask(taskText);
        }}
      >
        Add Task
      </button>
    </>
  );
}
