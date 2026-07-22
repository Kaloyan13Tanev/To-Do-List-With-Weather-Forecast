package bg.sofia.elando.todolist.repository;

import bg.sofia.elando.todolist.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {

    @Query("select t from TaskEntity t order by t.position desc")
    List<TaskEntity> getTasks();

    @Query("select t from TaskEntity t where t.position > :position order by t.position asc limit 1")
    Optional<TaskEntity> findTaskAbove(Long position);

    @Query("select t from TaskEntity t where t.position < :position order by t.position desc limit 1")
    Optional<TaskEntity> findTaskBelow(Long position);

}
