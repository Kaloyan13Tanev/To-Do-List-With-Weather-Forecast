package bg.sofia.elando.todolist.controller;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.dto.PatchTaskRequest;
import bg.sofia.elando.todolist.dto.TaskResponse;
import bg.sofia.elando.todolist.mapper.TaskMapper;
import bg.sofia.elando.todolist.service.TaskService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @GetMapping("/{id}")
    public TaskResponse getTask(@PathVariable UUID id) {
        return taskMapper.toResponse(taskService.getTask(id));
    }

    @GetMapping
    public List<TaskResponse> getTasks() {
        return taskMapper.toResponses(taskService.getTasks());
    }

    @PostMapping
    public TaskResponse createTask(@RequestBody CreateTaskRequest createTaskRequest) {
        return taskMapper.toResponse(taskService.createTask(createTaskRequest));
    }

    @PatchMapping("/{id}")
    public TaskResponse patchTask(@PathVariable UUID id, @RequestBody PatchTaskRequest patchTaskRequest) {
        return taskMapper.toResponse(taskService.patchTask(id, patchTaskRequest));
    }

    @PatchMapping("/{id}/move-up")
    public List<TaskResponse> moveTaskUp(@PathVariable UUID id) {
        return taskMapper.toResponses(taskService.moveTaskUp(id));
    }

    @PatchMapping("/{id}/move-down")
    public List<TaskResponse> moveTaskDown(@PathVariable UUID id) {
        return taskMapper.toResponses(taskService.moveTaskDown(id));
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
    }

}