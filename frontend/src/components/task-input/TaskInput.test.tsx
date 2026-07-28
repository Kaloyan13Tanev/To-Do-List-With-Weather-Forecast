import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskInput } from "./TaskInput";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import type { Task } from "../../types";

type Props = React.ComponentProps<typeof TaskInput>;
vi.mock("axios");

describe("TaskInput component", () => {
  const newTask: Task = { id: "1", text: "New Task", done: false };

  function renderTaskInput(overrides: Partial<Props> = {}) {
    return render(<TaskInput loadTasks={vi.fn()} {...overrides} />);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.post).mockResolvedValue({ data: newTask });
  });

  it("renders whole input form", () => {
    renderTaskInput();

    expect(screen.getByTestId("input-area")).toBeInTheDocument();
    expect(screen.getByTestId("add-button")).toBeInTheDocument();
  });

  it("saves the task in the form then empties input area", async () => {
    const loadTasks = vi.fn();
    renderTaskInput({ loadTasks });

    const user = userEvent.setup();
    const inputArea = screen.getByTestId("input-area");
    await user.type(inputArea, "New Task");
    await user.click(screen.getByTestId("add-button"));

    expect(axios.post).toHaveBeenCalledWith("/tasks", { text: "New Task" });
    expect(loadTasks).toHaveBeenCalled();
    expect(inputArea).toHaveValue("");
  });
});
