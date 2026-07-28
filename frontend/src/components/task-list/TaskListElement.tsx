import { useState } from "react";
import type { Task } from "../../types";
import { TaskNormalView } from "./TaskNormalView";
import { TaskEditView } from "./TaskEditView";

export function TaskListElement({
  task,
  loadTasks,
}: {
  task: Task;
  loadTasks: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  return !isEditing ? (
    <TaskNormalView
      task={task}
      loadTasks={loadTasks}
      setIsEditing={setIsEditing}
    />
  ) : (
    <TaskEditView
      task={task}
      loadTasks={loadTasks}
      editText={editText}
      setEditText={setEditText}
      setIsEditing={setIsEditing}
    />
  );
}
