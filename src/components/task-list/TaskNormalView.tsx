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
  function changeTaskStatus() {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, done: !t.done } : t,
    );
    setTasks(updatedTasks);
  }

  function moveTaskUp(task: Task) {
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index > 0) {
      const newTasks = [...tasks];
      [newTasks[index - 1], newTasks[index]] = [
        newTasks[index],
        newTasks[index - 1],
      ];
      setTasks(newTasks);
    }
  }

  function moveTaskDown(task: Task) {
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [
        newTasks[index + 1],
        newTasks[index],
      ];
      setTasks(newTasks);
    }
  }

  function deleteTask(task: Task) {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
  }

  return (
    <li className="list-group-item d-flex align-items-center justify-content-between gap-3">
      <div
        className={`task-content d-flex align-items-center gap-3 flex-grow-1 ${
          task.done ? "scratched" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={task.done}
          onChange={changeTaskStatus}
        />
        <span className="task-text flex-grow-1">{task.text}</span>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap">
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
