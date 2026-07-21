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
    <ul className="list-unstyled">
      {tasks.map((task) => (
        <TaskListElement
          key={task.id}
          task={task}
          tasks={tasks}
          setTasks={setTasks}
        />
      ))}
    </ul>
  );
}
