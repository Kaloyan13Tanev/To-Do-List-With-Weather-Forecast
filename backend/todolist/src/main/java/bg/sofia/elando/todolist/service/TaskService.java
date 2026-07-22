package bg.sofia.elando.todolist.service;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.dto.PatchTaskRequest;
import bg.sofia.elando.todolist.model.Task;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    List<Task> getTasks();

    Task getTask(UUID id);

    Task createTask(CreateTaskRequest dto);

    Task patchTask(UUID id, PatchTaskRequest dto);

    List<Task> moveTaskUp(UUID id);

    List<Task> moveTaskDown(UUID id);

    void deleteTask(UUID id);

}