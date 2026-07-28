import { it, expect, describe, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TaskList } from "./TaskList";
import userEvent from "@testing-library/user-event";
import type { Task } from "../../types";

describe("TaskList component", () => {
  const firstTask: Task = { id: "1", text: "First Task", done: false };
  const secondTask: Task = { id: "2", text: "Second Task", done: false };

  function renderTasks(tasks: Task[]) {
    return render(<TaskList tasks={tasks} loadTasks={vi.fn()} />);
  }

  it("renders a row for each task, in the given order", () => {
    renderTasks([firstTask, secondTask]);

    const rows = screen.getAllByTestId("task-normal-view");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText("First Task")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Second Task")).toBeInTheDocument();
  });

  it("renders no rows when there are no tasks", () => {
    renderTasks([]);

    expect(screen.queryAllByTestId("task-normal-view")).toHaveLength(0);
  });

  it("keeps edit mode with its task when the list is reordered", async () => {
    const { rerender } = renderTasks([firstTask, secondTask]);

    const user = userEvent.setup();
    await user.click(screen.getAllByTestId("edit-button")[1]);

    rerender(<TaskList tasks={[secondTask, firstTask]} loadTasks={vi.fn()} />);

    const rows = screen.getAllByTestId(/task-(normal|edit)-view/);
    expect(rows[0]).toHaveAttribute("data-testid", "task-edit-view");
    expect(within(rows[0]).getByTestId("edit-input")).toHaveValue(
      "Second Task",
    );
    expect(rows[1]).toHaveAttribute("data-testid", "task-normal-view");
  });
});
