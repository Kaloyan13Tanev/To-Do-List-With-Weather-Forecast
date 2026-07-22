package bg.sofia.elando.todolist.mapper;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.entity.TaskEntity;
import bg.sofia.elando.todolist.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "done", constant = "false")
    Task toTask(CreateTaskRequest dto);

    Task toTask(TaskEntity entity);

    TaskEntity toEntity(Task task);

}