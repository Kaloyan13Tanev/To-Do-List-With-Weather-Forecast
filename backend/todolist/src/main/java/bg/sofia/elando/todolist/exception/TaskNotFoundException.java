package bg.sofia.elando.todolist.exception;

import java.util.UUID;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(UUID id) {
        super("Task not found: " + id);
    }

    public TaskNotFoundException(String message) {
        super(message);
    }

    public TaskNotFoundException(String message, Throwable e) {
        super(message, e);
    }

    public TaskNotFoundException(Throwable e) {
        super(e);
    }

}