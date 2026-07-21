package bg.sofia.elando.todolist.dto.converter;

import bg.sofia.elando.todolist.dto.CreateTaskRequestDTO;
import bg.sofia.elando.todolist.model.Task;

public class CreateTaskRequestDTOConverter implements DTOConverter<CreateTaskRequestDTO> {

    @Override
    public Task toTask(CreateTaskRequestDTO dto) {
        Task task = new Task();
        task.setText(dto.text());
        return task;
    }

    @Override
    public CreateTaskRequestDTO toDTO(Task task) {
        return new CreateTaskRequestDTO(task.getText());
    }

}
