import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskNormalView } from "./TaskNormalView";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import type { Task } from "../../types";

type Props = React.ComponentProps<typeof TaskNormalView>;
vi.mock("axios");

describe("TaskNormalView component", () => {
  const testTask: Task = { id: "1", text: "Test Task", done: false };

  function renderTask(task: Task, overrides: Partial<Props> = {}) {
    return render(
      <TaskNormalView
        task={task}
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
    vi.mocked(axios.delete).mockResolvedValue({ data: {} });
  });

  it("does not scratch an incomplete task", () => {
    renderTask(testTask);

    expect(screen.getByTestId("task-content")).not.toHaveClass("scratched");
  });

  it("displays task text correctly", () => {
    renderTask(testTask);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("makes checkbox reflect task done status", () => {
    const task: Task = { id: "1", text: "Test Task", done: true };
    renderTask(task);

    expect(screen.getByTestId("done-checkbox")).toBeChecked();
  });

  it("marks a completed task as scratched", () => {
    const task: Task = { id: "1", text: "Test Task", done: true };
    renderTask(task);

    expect(screen.getByTestId("task-content")).toHaveClass("scratched");
  });

  it("renders all API endpoint buttons", () => {
    renderTask(testTask);

    expect(screen.getByTestId("move-up-button")).toBeInTheDocument();
    expect(screen.getByTestId("move-down-button")).toBeInTheDocument();
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
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

  it("deletes the task and reloads the list", async () => {
    const loadTasks = vi.fn();

    renderTask(testTask, { loadTasks });

    const deleteButton = screen.getByTestId("delete-button");
    const user = userEvent.setup();
    await user.click(deleteButton);

    expect(axios.delete).toHaveBeenCalledWith(`/tasks/${testTask.id}`);
    expect(loadTasks).toHaveBeenCalled();
  });

  it("moves the task up and reloads the list", async () => {
    const loadTasks = vi.fn();

    renderTask(testTask, { loadTasks });

    const moveUpButton = screen.getByTestId("move-up-button");
    const user = userEvent.setup();
    await user.click(moveUpButton);

    expect(axios.patch).toHaveBeenCalledWith(`/tasks/${testTask.id}/move-up`);
    expect(loadTasks).toHaveBeenCalled();
  });

  it("moves the task down and reloads the list", async () => {
    const loadTasks = vi.fn();

    renderTask(testTask, { loadTasks });

    const moveDownButton = screen.getByTestId("move-down-button");
    const user = userEvent.setup();
    await user.click(moveDownButton);

    expect(axios.patch).toHaveBeenCalledWith(`/tasks/${testTask.id}/move-down`);
    expect(loadTasks).toHaveBeenCalled();
  });

  it("does not reload the list when entering edit mode", async () => {
    const loadTasks = vi.fn();
    const setIsEditing = vi.fn();

    renderTask(testTask, { loadTasks, setIsEditing });

    const editButton = screen.getByTestId("edit-button");
    const user = userEvent.setup();
    await user.click(editButton);

    expect(setIsEditing).toHaveBeenCalledWith(true);
    expect(loadTasks).not.toHaveBeenCalled();
  });
});
