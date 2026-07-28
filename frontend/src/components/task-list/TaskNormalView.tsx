import axios from "axios";
import type { Task } from "../../types";

export function TaskNormalView({
  task,
  loadTasks,
  setIsEditing,
}: {
  task: Task;
  loadTasks: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  async function changeTaskStatus() {
    await axios.patch<Task>(`/tasks/${task.id}`, {
      done: !task.done,
    });
    await loadTasks();
  }

  async function moveTaskUp(task: Task) {
    await axios.patch<Task[]>(`/tasks/${task.id}/move-up`);
    await loadTasks();
  }

  async function moveTaskDown(task: Task) {
    await axios.patch<Task[]>(`/tasks/${task.id}/move-down`);
    await loadTasks();
  }

  async function deleteTask(task: Task) {
    await axios.delete(`/tasks/${task.id}`);
    await loadTasks();
  }

  return (
    <li
      data-testid="task-normal-view"
      className="list-group-item d-flex align-items-center justify-content-between gap-3"
    >
      <div
        data-testid="task-content"
        className={`task-content d-flex align-items-center gap-3 flex-grow-1 ${
          task.done ? "scratched" : ""
        }`}
        style={{ minWidth: 0 }}
      >
        <input
          data-testid="done-checkbox"
          type="checkbox"
          checked={task.done}
          onChange={changeTaskStatus}
        />
        <span className="task-text text-truncate">{task.text}</span>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <button
          data-testid="move-up-button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => moveTaskUp(task)}
        >
          ↑
        </button>
        <button
          data-testid="move-down-button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => moveTaskDown(task)}
        >
          ↓
        </button>
        <button
          data-testid="edit-button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          data-testid="delete-button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => deleteTask(task)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
