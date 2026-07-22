package bg.sofia.elando.todolist.mapper;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.dto.TaskResponse;
import bg.sofia.elando.todolist.entity.TaskEntity;
import bg.sofia.elando.todolist.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "done", constant = "false")
    Task toTask(CreateTaskRequest dto);

    List<Task> toTasks(List<TaskEntity> entities);

    Task toTask(TaskEntity entity);

    TaskEntity toEntity(Task task);

    TaskResponse toResponse(Task task);

    List<TaskResponse> toResponses(List<Task> tasks);

}