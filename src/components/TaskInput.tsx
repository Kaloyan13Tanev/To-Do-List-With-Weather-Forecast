function TaskInput() {
  return (
    <>
      <label htmlFor="task-input" className="form-label">
        Write your task here:
      </label>
      <textarea className="form-control" id="task-input" rows={3}></textarea>
    </>
  );
}

export default TaskInput;
