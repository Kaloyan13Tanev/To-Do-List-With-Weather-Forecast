package bg.sofia.elando.todolist.dto.converter;

import bg.sofia.elando.todolist.dto.DTO;
import bg.sofia.elando.todolist.model.Task;

public interface DTOConverter<T extends DTO> {

    Task toTask(T dto);

    T toDTO(Task task);

}
