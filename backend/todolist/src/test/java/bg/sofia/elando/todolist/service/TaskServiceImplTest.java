package bg.sofia.elando.todolist.service;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.dto.PatchTaskRequest;
import bg.sofia.elando.todolist.entity.TaskEntity;
import bg.sofia.elando.todolist.exception.TaskNotFoundException;
import bg.sofia.elando.todolist.mapper.TaskMapper;
import bg.sofia.elando.todolist.model.Task;
import bg.sofia.elando.todolist.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceImplTest {

    private static final UUID PUBLIC_ID = UUID.randomUUID();
    private static final UUID PUBLIC_ID_2 = UUID.randomUUID();
    private static final UUID PUBLIC_ID_3 = UUID.randomUUID();

    @Mock
    private TaskRepository repo;
    @Mock(strictness = Mock.Strictness.LENIENT)
    private TaskMapper mapper;

    private Task task1;
    private Task task2;
    private TaskServiceImpl taskService;

    private TaskEntity entity1;
    private TaskEntity entity2;

    @BeforeEach
    void setUp() {
        taskService = new TaskServiceImpl(repo, mapper);

        task1 = createTask1();
        task2 = createTask2();
        entity1 = createEntity1();
        entity2 = createEntity2();

        routeMapper();
    }

    @Test
    void testGetTaskReturnsWhenTaskExists() {
        when(repo.findById(PUBLIC_ID)).thenReturn(Optional.of(entity1));

        Task test = taskService.getTask(PUBLIC_ID);

        assertEquals(task1, test,
            "getTask should return the task with the given id");
    }

    @Test
    void testGetTaskNonExistentThrows() {
        when(repo.findById(PUBLIC_ID)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getTask(PUBLIC_ID),
            "getTask should throw when no task with the given id exists");
    }

    @Test
    void testGetTasksReturnsAllTasks() {
        List<Task> tasks = List.of(task1, task2);
        List<TaskEntity> entities = List.of(entity1, entity2);

        when(repo.getTasks()).thenReturn(entities);

        List<Task> test = taskService.getTasks();

        assertEquals(tasks, test, "getTasks should return all tasks");
        // TODO: ask whether task order should be checked
    }

    @Test
    void testCreateTaskReturnsWhenTaskCreated() {
        CreateTaskRequest dto = new CreateTaskRequest(task1.getText());

        when(mapper.toTask(dto)).thenReturn(task1);
        when(repo.save(entity1)).thenReturn(entity1);

        Task test = taskService.createTask(dto);

        verify(repo).save(entity1);
        assertEquals(task1, test, "createTask should return the created task");
    }

    @Test
    void testPatchTaskReturnsWhenTaskPatched() {
        PatchTaskRequest dto = new PatchTaskRequest(true, "updated task");

        when(repo.findById(entity1.getId())).thenReturn(Optional.of(entity1));
        when(repo.save(entity1)).thenReturn(entity1);

        Task test = taskService.patchTask(entity1.getId(), dto);

        verify(repo).save(entity1);
        assertEquals(dto.text(), test.getText(), "patchTask should apply the new text");
        assertEquals(dto.done(), test.isDone(), "patchTask should apply the new done flag");
    }

    @Test
    void testPatchTaskThrowsWhenTaskNonExistent() {
        PatchTaskRequest dto = new PatchTaskRequest(true, "updated task");

        when(repo.findById(entity1.getId())).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.patchTask(entity1.getId(), dto),
            "patchTask should throw when no task with the given id exists");
    }

    @Test
    void testPatchTaskTextOnly() {
        PatchTaskRequest dto = new PatchTaskRequest(null, "updated task");

        when(repo.findById(entity1.getId())).thenReturn(Optional.of(entity1));
        when(repo.save(entity1)).thenReturn(entity1);

        Task test = taskService.patchTask(entity1.getId(), dto);

        assertEquals(dto.text(), test.getText(), "patchTask should apply the new text");
        assertFalse(test.isDone(), "patchTask should leave done unchanged when null");
    }

    @Test
    void testPatchTaskDoneOnly() {
        PatchTaskRequest dto = new PatchTaskRequest(true, null);

        when(repo.findById(entity1.getId())).thenReturn(Optional.of(entity1));
        when(repo.save(entity1)).thenReturn(entity1);

        Task test = taskService.patchTask(entity1.getId(), dto);

        assertEquals(dto.done(), test.isDone(), "patchTask should apply the new done flag");
        assertEquals(entity1.getText(), test.getText(), "patchTask should leave text unchanged when null");
    }

    // TODO: Test for the method being transactional?

    @Test
    void testMoveTaskUpSwapsPositions() {
        Task task3 = createTask3();
        TaskEntity entity3 = createEntity3();

        List<Task> tasks = List.of(task3, task2, task1);
        List<TaskEntity> taskEntities = List.of(entity2, entity3, entity1);

        when(mapper.toEntity(task3)).thenReturn(entity3);
        when(mapper.toTasks(taskEntities)).thenReturn(tasks);

        when(repo.findById(entity2.getId())).thenReturn(Optional.of(entity2));
        when(repo.findTaskAbove(entity2.getPosition())).thenReturn(Optional.of(entity3));
        when(repo.getTasks()).thenReturn(taskEntities);

        List<Task> test = taskService.moveTaskUp(entity2.getId());

        verify(repo).save(entity2);
        verify(repo).save(entity3);
        verify(repo, never()).save(entity1);

        assertEquals(3L, entity2.getPosition(),
            "moveTaskUp should give the moved task the position above");
        assertEquals(2L, entity3.getPosition(),
            "moveTaskUp should give the task above the original position");
        assertEquals(1L, entity1.getPosition(), "moveTaskUp should leave other tasks unchanged");
        assertEquals(tasks, test, "moveTaskUp should return the reordered list");
    }

    @Test
    void testMoveTaskUpThrowsWhenTaskNonExistent() {
        when(repo.findById(PUBLIC_ID)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.moveTaskUp(PUBLIC_ID),
            "moveTaskUp should throw when no task with the given id exists");

        verify(repo, never()).save(any());
        verify(repo, never()).findTaskAbove(any());
    }

    @Test
    void testMoveTaskUpDoesNothingWhenNoTaskAbove() {
        Task task3 = createTask3();
        TaskEntity entity3 = createEntity3();
        List<Task> tasks = List.of(task3, task2, task1);
        List<TaskEntity> entities = List.of(entity3, entity2, entity1);

        when(mapper.toTasks(entities)).thenReturn(tasks);

        when(mapper.toTask(entity3)).thenReturn(task3);
        when(mapper.toTask(entity3)).thenReturn(task3);
        when(repo.findById(PUBLIC_ID_3)).thenReturn(Optional.of(entity3));
        when(repo.findTaskAbove(entity3.getPosition())).thenReturn(Optional.empty());
        when(repo.getTasks()).thenReturn(entities);

        List<Task> test = taskService.moveTaskUp(PUBLIC_ID_3);

        verify(repo, never()).save(any());

        assertEquals(3L, entity3.getPosition(),
            "moveTaskUp should not change the position of the topmost task");
        assertEquals(tasks, test, "moveTaskUp should return the unchanged list when there is no task above");
    }

    @Test
    void testMoveTaskDownSwapsPositions() {
        Task task3 = createTask3();
        TaskEntity entity3 = createEntity3();

        List<Task> tasks = List.of(task3, task1, task2);
        List<TaskEntity> taskEntities = List.of(entity3, entity1, entity2);

        when(mapper.toTask(entity3)).thenReturn(task3);
        when(mapper.toTasks(taskEntities)).thenReturn(tasks);

        when(repo.findById(entity2.getId())).thenReturn(Optional.of(entity2));
        when(repo.findTaskBelow(entity2.getPosition())).thenReturn(Optional.of(entity1));
        when(repo.getTasks()).thenReturn(taskEntities);

        List<Task> test = taskService.moveTaskDown(entity2.getId());

        verify(repo).save(entity2);
        verify(repo).save(entity1);
        verify(repo, never()).save(entity3);

        assertEquals(1L, entity2.getPosition(),
            "moveTaskDown should give the moved task the position below");
        assertEquals(2L, entity1.getPosition(),
            "moveTaskDown should give the task below the original position");
        assertEquals(3L, entity3.getPosition(), "moveTaskDown should leave other tasks unchanged");
        assertEquals(tasks, test, "moveTaskDown should return the reordered list");
    }

    @Test
    void testMoveTaskDownDoesNothingWhenNoTaskBelow() {
        Task task3 = createTask3();
        TaskEntity entity3 = createEntity3();
        List<Task> tasks = List.of(task3, task2, task1);
        List<TaskEntity> entities = List.of(entity3, entity2, entity1);

        when(mapper.toTasks(entities)).thenReturn(tasks);

        when(repo.findById(PUBLIC_ID)).thenReturn(Optional.of(entity1));
        when(repo.findTaskBelow(entity1.getPosition())).thenReturn(Optional.empty());
        when(repo.getTasks()).thenReturn(entities);

        List<Task> test = taskService.moveTaskDown(PUBLIC_ID);

        verify(repo, never()).save(any());

        assertEquals(1L, entity1.getPosition(),
            "moveTaskDown should not change the position of the bottom most task");
        assertEquals(tasks, test, "moveTaskDown should return the unchanged list when there is no task below");
    }

    @Test
    void testMoveTaskDownThrowsWhenTaskNonExistent() {
        when(repo.findById(PUBLIC_ID)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.moveTaskDown(PUBLIC_ID),
            "moveTaskDown should throw when no task with the given id exists");

        verify(repo, never()).save(any());
        verify(repo, never()).findTaskAbove(any());
    }

    @Test
    void testDeleteTaskDeletesWhenTaskExists() {
        when(repo.existsById(entity1.getId())).thenReturn(true);

        taskService.deleteTask(entity1.getId());

        verify(repo).deleteById(entity1.getId());
    }

    @Test
    void testDeleteTaskThrowsWhenTaskNonExistent() {
        when(repo.existsById(entity1.getId())).thenReturn(false);

        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTask(entity1.getId()),
            "deleteTask should throw when no task with the given id exists");
    }

    private Task createTask1() {
        Task task = new Task();
        task.setId(PUBLIC_ID);
        task.setPosition(1L);
        task.setText("task1");
        task.setDone(false);
        return task;
    }

    private Task createTask2() {
        Task task = new Task();
        task.setId(PUBLIC_ID_2);
        task.setPosition(2L);
        task.setText("task2");
        task.setDone(true);
        return task;
    }

    private Task createTask3() {
        Task task = new Task();
        task.setId(PUBLIC_ID_3);
        task.setPosition(3L);
        task.setText("task3");
        task.setDone(false);
        return task;
    }

    private TaskEntity createEntity1() {
        TaskEntity entity = new TaskEntity();
        entity.setId(PUBLIC_ID);
        entity.setPosition(1L);
        entity.setText("task1");
        entity.setDone(false);
        return entity;
    }

    private TaskEntity createEntity2() {
        TaskEntity entity = new TaskEntity();
        entity.setId(PUBLIC_ID_2);
        entity.setPosition(2L);
        entity.setText("task2");
        entity.setDone(true);
        return entity;
    }

    private TaskEntity createEntity3() {
        TaskEntity entity = new TaskEntity();
        entity.setId(PUBLIC_ID_3);
        entity.setPosition(3L);
        entity.setText("task3");
        entity.setDone(false);
        entity.setPosition(3L);
        return entity;
    }

    private void routeMapper() {
        when(mapper.toTask(entity1)).thenReturn(task1);
        when(mapper.toTask(entity2)).thenReturn(task2);
        when(mapper.toEntity(task1)).thenReturn(entity1);
        when(mapper.toEntity(task2)).thenReturn(entity2);
        when(mapper.toTasks(List.of(entity1, entity2))).thenReturn(List.of(task1, task2));
    }

}
