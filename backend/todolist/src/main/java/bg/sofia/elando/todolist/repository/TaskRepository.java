package bg.sofia.elando.todolist.repository;

import bg.sofia.elando.todolist.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
}
