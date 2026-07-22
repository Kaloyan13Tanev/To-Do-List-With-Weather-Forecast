import axios from "axios";
import { useState } from "react";
import type { Task } from "../../types";

export function TaskInput({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [taskText, setTaskText] = useState("");

  async function addTask(taskText: string) {
    const response = await axios.post<Task>("/tasks", { text: taskText });
    setTasks((prevTasks) => [response.data, ...prevTasks]);
    setTaskText("");
  }

  return (
    <>
      <textarea
        className="form-control"
        placeholder="Write your task here"
        id="floatingTextarea2"
        style={{ height: "100px" }}
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      ></textarea>
      <button
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
