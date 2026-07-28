import axios from "axios";
import type { Task } from "../../types";

export function TaskEditView({
  loadTasks,
  task,
  editText,
  setEditText,
  setIsEditing,
}: {
  loadTasks: () => void;
  task: Task;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  async function saveEdit() {
    await axios.patch<Task>(`/tasks/${task.id}`, {
      text: editText,
    });
    await loadTasks();
    setIsEditing(false);
  }

  async function changeTaskStatus() {
    await axios.patch<Task>(`/tasks/${task.id}`, {
      done: !task.done,
    });
    await loadTasks();
  }

  function cancelEdit() {
    setEditText(task.text);
    setIsEditing(false);
  }

  return (
    <li
      data-testid="task-edit-view"
      className="list-group-item d-flex align-items-center justify-content-between gap-3"
    >
      <div className="task-content d-flex align-items-center gap-3 flex-grow-1">
        <input
          data-testid="done-checkbox"
          type="checkbox"
          checked={task.done}
          onChange={changeTaskStatus}
        />

        <input
          data-testid="edit-input"
          className="form-control form-control-sm flex-grow-1"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap">
        <button
          data-testid="save-button"
          className="btn btn-sm btn-success"
          onClick={saveEdit}
        >
          Save
        </button>
        <button
          data-testid="cancel-button"
          className="btn btn-sm btn-secondary"
          onClick={cancelEdit}
        >
          Cancel
        </button>
      </div>
    </li>
  );
}
