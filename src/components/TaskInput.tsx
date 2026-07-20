import { useState } from "react";

function TaskInput() {
  const [taskText, setTaskText] = useState("");

  return (
    <div className="form-floating">
      <textarea
        className="form-control"
        placeholder="Write your task here..."
        id="floatingTextarea2"
        style={{ height: "100px" }}
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      ></textarea>
      <button className="btn btn-primary mt-2">Add Task</button>
      <label htmlFor="floatingTextarea2">Comments</label>
    </div>
  );
}

export default TaskInput;
