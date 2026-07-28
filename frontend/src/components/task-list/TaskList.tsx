import type { Task } from "../../types";
import { TaskListElement } from "./TaskListElement";

export function TaskList({
  tasks,
  loadTasks,
}: {
  tasks: Task[];
  loadTasks: () => void;
}) {
  return (
    <div className="task-list-container fill">
      <ul className="list-unstyled scroll-area">
        {tasks.map((task) => (
          <TaskListElement key={task.id} task={task} loadTasks={loadTasks} />
        ))}
      </ul>
    </div>
  );
}
