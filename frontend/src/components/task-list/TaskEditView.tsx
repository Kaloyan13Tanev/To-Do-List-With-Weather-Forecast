import axios from "axios";
import type { Task } from "../../types";

export function TaskEditView({
  setTasks,
  task,
  editText,
  setEditText,
  setIsEditing,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  task: Task;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  async function saveEdit() {
    const response = await axios.patch<Task>(`/tasks/${task.id}`, {
      text: editText,
    });
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, text: response.data.text } : t,
      ),
    );
    setIsEditing(false);
  }

  function cancelEdit() {
    setEditText(task.text);
    setIsEditing(false);
  }

  return (
    <li className="list-group-item d-flex align-items-center justify-content-between gap-3">
      <div className="task-content d-flex align-items-center gap-3 flex-grow-1">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() =>
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
            )
          }
        />

        <input
          className="form-control form-control-sm flex-grow-1"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap">
        <button className="btn btn-sm btn-success" onClick={saveEdit}>
          Save
        </button>
        <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </li>
  );
}
