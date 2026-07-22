package bg.sofia.elando.todolist.service;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.dto.PatchTaskRequest;
import bg.sofia.elando.todolist.entity.TaskEntity;
import bg.sofia.elando.todolist.mapper.TaskMapper;
import bg.sofia.elando.todolist.model.Task;
import bg.sofia.elando.todolist.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repo;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository repo, TaskMapper taskMapper) {
        this.repo = repo;
        this.taskMapper = taskMapper;
    }

    @Override
    public List<Task> getTasks() {
        return taskMapper.toTasks(repo.getTasks());
    }

    @Override
    public Task getTask(UUID id) {
        return taskMapper.toTask(
            repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"))
        );
    }

    @Override
    public Task createTask(CreateTaskRequest dto) {
        TaskEntity entity = taskMapper.toEntity(taskMapper.toTask(dto));
        return taskMapper.toTask(repo.save(entity));
    }

    @Override
    public Task patchTask(UUID id, PatchTaskRequest dto) {
        Task task = getTask(id);
        if (dto.done() != null) task.setDone(dto.done());
        if (dto.text() != null) task.setText(dto.text());

        TaskEntity entity = taskMapper.toEntity(task);
        return taskMapper.toTask(repo.save(entity));
    }

    @Override
    @Transactional
    public List<Task> moveTaskUp(UUID id) {
        Task current = getTask(id);

        Optional<TaskEntity> above = repo.findTaskAbove(current.getPosition());
        if (above.isEmpty()) {
            return getTasks();
        }

        swap(current, above.get());
        return getTasks();
    }

    @Override
    @Transactional
    public List<Task> moveTaskDown(UUID id) {
        Task current = getTask(id);

        Optional<TaskEntity> below = repo.findTaskBelow(current.getPosition());
        if (below.isEmpty()) {
            return getTasks();
        }

        swap(current, below.get());
        return getTasks();
    }

    @Override
    public void deleteTask(UUID id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }

        repo.deleteById(id);
    }

    private void swap(Task current, TaskEntity other) {
        Long currentPosition = current.getPosition();

        current.setPosition(other.getPosition());
        other.setPosition(currentPosition);

        repo.save(other);
        repo.save(taskMapper.toEntity(current));
    }

}
