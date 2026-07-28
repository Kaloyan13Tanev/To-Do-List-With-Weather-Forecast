import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskListElement } from "./TaskListElement";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import type { Task } from "../../types";

type Props = React.ComponentProps<typeof TaskListElement>;
vi.mock("axios");

describe("TaskListElement component", () => {
  const testTask: Task = { id: "1", text: "Test Task", done: false };

  function renderTask(task: Task, overrides: Partial<Props> = {}) {
    return render(
      <TaskListElement task={task} loadTasks={vi.fn()} {...overrides} />,
      { wrapper: ({ children }) => <ul>{children}</ul> },
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.patch).mockResolvedValue({ data: {} });
  });

  it("starts in the normal view", () => {
    renderTask(testTask);

    expect(screen.getByTestId("task-normal-view")).toBeInTheDocument();
    expect(screen.queryByTestId("task-edit-view")).not.toBeInTheDocument();
  });

  it("switches to the edit view when edit is clicked", async () => {
    renderTask(testTask);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-button"));

    expect(screen.getByTestId("task-edit-view")).toBeInTheDocument();
  });

  it("returns to the normal view after saving", async () => {
    renderTask(testTask);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-button"));
    await user.click(screen.getByTestId("save-button"));

    expect(screen.queryByTestId("task-edit-view")).not.toBeInTheDocument();
  });

  it("returns to the normal view after cancelling", async () => {
    renderTask(testTask);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-button"));
    await user.click(screen.getByTestId("cancel-button"));

    expect(screen.queryByTestId("task-edit-view")).not.toBeInTheDocument();
  });

  it("discards the abandoned draft when edit mode is re-entered", async () => {
    renderTask(testTask);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-button"));

    const input = screen.getByTestId("edit-input");
    await user.clear(input);
    await user.type(input, "Abandoned Draft");
    await user.click(screen.getByTestId("cancel-button"));
    await user.click(screen.getByTestId("edit-button"));

    expect(screen.getByTestId("edit-input")).toHaveValue("Test Task");
  });
});
