package bg.sofia.elando.todolist.repository;

import bg.sofia.elando.todolist.entity.TaskEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;


import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class TaskRepositoryTest {

    private static final String TASK1_TEXT = "task1";
    private static final String TASK2_TEXT = "task2";
    private static final String TASK3_TEXT = "task3";

    @Autowired
    private TaskRepository repo;

    @Autowired
    private TestEntityManager entityManager;

    private TaskEntity entity1;
    private TaskEntity entity2;
    private TaskEntity entity3;

    @BeforeEach
    void setUp() {
        entity1 = persistTask(TASK1_TEXT, 1L);
        entity2 = persistTask(TASK2_TEXT, 2L);
        entity3 = persistTask(TASK3_TEXT, 3L);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void testGetTasksReturnsTasksInDescendingPositionOrder() {
        List<TaskEntity> tasks = repo.getTasks();

        assertEquals(3, tasks.size(), "getTasks should return every task");
        assertEquals(entity3.getId(), tasks.get(0).getId(),
            "getTasks should return the highest position first");
        assertEquals(entity2.getId(), tasks.get(1).getId(),
            "getTasks should return tasks in descending position order");
        assertEquals(entity1.getId(), tasks.get(2).getId(),
            "getTasks should return the lowest position last");
    }

    @Test
    void testFindTaskAboveReturnsNearestHigherPosition() {
        Optional<TaskEntity> above = repo.findTaskAbove(entity1.getPosition());

        assertTrue(above.isPresent(), "findTaskAbove should find a task above the lowest position");
        assertEquals(entity2.getId(), above.get().getId(),
            "findTaskAbove should return the nearest task above, not the highest");
    }

    @Test
    void testFindTaskAboveReturnsEmptyForTopmostTask() {
        Optional<TaskEntity> above = repo.findTaskAbove(entity3.getPosition());

        assertTrue(above.isEmpty(), "findTaskAbove should return empty for the topmost task");
    }

    @Test
    void testFindTaskBelowReturnsNearestLowerPosition() {
        Optional<TaskEntity> below = repo.findTaskBelow(entity3.getPosition());

        assertTrue(below.isPresent(), "findTaskBelow should find a task below the highest position");
        assertEquals(entity2.getId(), below.get().getId(),
            "findTaskBelow should return the nearest task below, not the lowest");
    }

    @Test
    void testFindTaskBelowReturnsEmptyForBottommostTask() {
        Optional<TaskEntity> below = repo.findTaskBelow(entity1.getPosition());

        assertTrue(below.isEmpty(), "findTaskBelow should return empty for the bottommost task");
    }

    private TaskEntity persistTask(String text, Long position) {
        TaskEntity entity = new TaskEntity();
        entity.setText(text);
        entity.setDone(false);

        entityManager.persist(entity);
        entityManager.flush();

        entity.setPosition(position);
        entityManager.flush();

        return entity;
    }

}