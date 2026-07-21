import type { Task } from "../../types";
import { TaskListElement } from "./TaskListElement";

export function TaskList({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  return (
    <div className="task-list-container fill">
      <ul className="list-unstyled scroll-area">
        {tasks.map((task) => (
          <TaskListElement
            key={task.id}
            task={task}
            tasks={tasks}
            setTasks={setTasks}
          />
        ))}
      </ul>
    </div>
  );
}
