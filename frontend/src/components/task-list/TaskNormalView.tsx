import axios from "axios";
import type { Task } from "../../types";

export function TaskNormalView({
  task,
  tasks,
  setTasks,
  setIsEditing,
}: {
  task: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  async function changeTaskStatus() {
    const response = await axios.patch<Task>(`/tasks/${task.id}`, {
      done: !task.done,
    });
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, done: response.data.done } : t,
    );
    setTasks(updatedTasks);
  }

  async function moveTaskUp(task: Task) {
    const response = await axios.patch<Task[]>(`/tasks/${task.id}/move-up`);
    setTasks(response.data);
  }

  async function moveTaskDown(task: Task) {
    const response = await axios.patch<Task[]>(`/tasks/${task.id}/move-down`);
    setTasks(response.data);
  }

  async function deleteTask(task: Task) {
    await axios.delete(`/tasks/${task.id}`);
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
  }

  return (
    <li className="list-group-item d-flex align-items-center justify-content-between gap-3">
      <div
        className={`task-content d-flex align-items-center gap-3 flex-grow-1 ${
          task.done ? "scratched" : ""
        }`}
        style={{ minWidth: 0 }}
      >
        <input
          type="checkbox"
          checked={task.done}
          onChange={changeTaskStatus}
        />
        <span className="task-text text-truncate">{task.text}</span>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => moveTaskUp(task)}
        >
          ↑
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => moveTaskDown(task)}
        >
          ↓
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => deleteTask(task)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
