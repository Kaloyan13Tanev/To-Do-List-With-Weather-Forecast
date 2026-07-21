import { useState } from "react";
import type { Task } from "../../types";

export function TaskInput({
  setTasks,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [taskText, setTaskText] = useState("");

  function addTask(task: Task) {
    setTasks((prevTasks) => [task, ...prevTasks]);
  }

  function handleTaskSubmition(task: Task) {
    if (task.text.trim() != "") {
      addTask(task);
      setTaskText("");
    }
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
        onClick={() => {
          // call HTTP post method
          handleTaskSubmition({
            id: crypto.randomUUID(),
            text: taskText,
            done: false,
          });
        }}
      >
        Add Task
      </button>
      <label htmlFor="floatingTextarea2"></label>
    </>
  );
}
