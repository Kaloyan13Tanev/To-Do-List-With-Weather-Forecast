import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskEditView } from "./TaskEditView";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import type { Task } from "../../types";

type Props = React.ComponentProps<typeof TaskEditView>;
vi.mock("axios");

describe("TaskEditView component", () => {
  const testTask: Task = { id: "1", text: "Test Task", done: false };

  function renderTask(task: Task, overrides: Partial<Props> = {}) {
    return render(
      <TaskEditView
        task={task}
        editText={task.text}
        setEditText={vi.fn()}
        loadTasks={vi.fn()}
        setIsEditing={vi.fn()}
        {...overrides}
      />,
      { wrapper: ({ children }) => <ul>{children}</ul> },
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.patch).mockResolvedValue({ data: {} });
  });

  it("displays the edit text in the input", () => {
    renderTask(testTask, { editText: "Edited Task" });

    expect(screen.getByTestId("edit-input")).toHaveValue("Edited Task");
  });

  it("makes checkbox reflect task done status", () => {
    const task: Task = { id: "1", text: "Test Task", done: true };
    renderTask(task);

    expect(screen.getByTestId("done-checkbox")).toBeChecked();
  });

  it("renders the save and cancel buttons", () => {
    renderTask(testTask);

    expect(screen.getByTestId("save-button")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
  });

  it("updates the edit text when typing", async () => {
    const setEditText = vi.fn();

    renderTask(testTask, { setEditText });

    const input = screen.getByTestId("edit-input");
    const user = userEvent.setup();
    await user.type(input, "!");

    expect(setEditText).toHaveBeenCalledWith("Test Task!");
  });

  it("saves the task and reloads the list", async () => {
    const loadTasks = vi.fn();
    const setIsEditing = vi.fn();

    renderTask(testTask, { editText: "Edited Task", loadTasks, setIsEditing });

    const saveButton = screen.getByTestId("save-button");
    const user = userEvent.setup();
    await user.click(saveButton);

    expect(axios.patch).toHaveBeenCalledWith(`/tasks/${testTask.id}`, {
      text: "Edited Task",
    });
    expect(loadTasks).toHaveBeenCalled();
    expect(setIsEditing).toHaveBeenCalledWith(false);
  });

  it("changes done status when checkbox is clicked", async () => {
    const loadTasks = vi.fn();

    renderTask(testTask, { loadTasks });

    const checkbox = screen.getByTestId("done-checkbox");
    const user = userEvent.setup();
    await user.click(checkbox);

    expect(axios.patch).toHaveBeenCalledWith(`/tasks/${testTask.id}`, {
      done: true,
    });
    expect(loadTasks).toHaveBeenCalled();
  });

  it("restores the original text when cancel is clicked", async () => {
    const setEditText = vi.fn();
    const setIsEditing = vi.fn();
    const loadTasks = vi.fn();

    renderTask(testTask, {
      editText: "Edited Task",
      setEditText,
      setIsEditing,
      loadTasks,
    });

    const cancelButton = screen.getByTestId("cancel-button");
    const user = userEvent.setup();
    await user.click(cancelButton);

    expect(setEditText).toHaveBeenCalledWith(testTask.text);
    expect(setIsEditing).toHaveBeenCalledWith(false);
    expect(axios.patch).not.toHaveBeenCalled();
    expect(loadTasks).not.toHaveBeenCalled();
  });
});
