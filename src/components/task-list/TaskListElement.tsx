import { useState } from "react";
import type { Task } from "../../types";
import { TaskNormalView } from "./TaskNormalView";
import { TaskEditView } from "./TaskEditView";

export function TaskListElement({
  task,
  tasks,
  setTasks,
}: {
  task: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  return !isEditing ? (
    <TaskNormalView
      task={task}
      tasks={tasks}
      setTasks={setTasks}
      setIsEditing={setIsEditing}
    />
  ) : (
    <TaskEditView
      task={task}
      setTasks={setTasks}
      editText={editText}
      setEditText={setEditText}
      setIsEditing={setIsEditing}
    />
  );
}
