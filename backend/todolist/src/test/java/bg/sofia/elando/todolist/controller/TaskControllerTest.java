package bg.sofia.elando.todolist.controller;

import bg.sofia.elando.todolist.dto.CreateTaskRequest;
import bg.sofia.elando.todolist.dto.PatchTaskRequest;
import bg.sofia.elando.todolist.dto.TaskResponse;
import bg.sofia.elando.todolist.exception.TaskNotFoundException;
import bg.sofia.elando.todolist.mapper.TaskMapper;
import bg.sofia.elando.todolist.model.Task;
import bg.sofia.elando.todolist.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    private static final UUID PUBLIC_ID = UUID.randomUUID();
    private static final UUID PUBLIC_ID_2 = UUID.randomUUID();
    private static final UUID MISSING_ID = UUID.randomUUID();

    private static final String TASK1_TEXT = "task1";
    private static final String TASK2_TEXT = "task2";

    private static final String BASE_PATH = "/tasks";

    private static final String CREATE_TASK_JSON = "{\"text\":\"" + TASK1_TEXT + "\"}";
    private static final String PATCH_TASK_JSON =
        "{\"text\":\"" + TASK2_TEXT + "\",\"done\":true}";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @MockitoBean
    private TaskMapper taskMapper;

    private Task task1;
    private Task task2;

    @BeforeEach
    void setUp() {
        task1 = createTask1();
        task2 = createTask2();

        when(taskMapper.toResponse(task1)).thenReturn(responseOf(task1));
        when(taskMapper.toResponse(task2)).thenReturn(responseOf(task2));
    }

    @Test
    void testGetTaskReturnsTask() throws Exception {
        when(taskService.getTask(task1.getId())).thenReturn(task1);

        mockMvc.perform(get(BASE_PATH + "/{id}", task1.getId()))
            .andExpect(status().isOk())
            .andExpect(taskFields("$", task1));
    }

    @Test
    void testGetTaskReturnsNotFoundForUnknownId() throws Exception {
        when(taskService.getTask(MISSING_ID)).thenThrow(new TaskNotFoundException(MISSING_ID));

        mockMvc.perform(get(BASE_PATH + "/{id}", MISSING_ID))
            .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllTasksReturnsTasks() throws Exception {
        List<Task> tasks = List.of(task1, task2);
        when(taskService.getTasks()).thenReturn(tasks);
        when(taskMapper.toResponses(tasks)).thenReturn(responsesOf(tasks));

        mockMvc.perform(get(BASE_PATH))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(tasks.size()))
            .andExpect(taskFields("$[0]", task1))
            .andExpect(taskFields("$[1]", task2));
    }

    @Test
    void testGetAllTasksReturnsEmptyListWhenNoTasks() throws Exception {
        when(taskService.getTasks()).thenReturn(List.of());
        when(taskMapper.toResponses(List.of())).thenReturn(List.of());

        mockMvc.perform(get(BASE_PATH))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testCreateTaskReturnsCreatedTask() throws Exception {
        when(taskService.createTask(new CreateTaskRequest(TASK1_TEXT))).thenReturn(task1);

        mockMvc.perform(post(BASE_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(CREATE_TASK_JSON))
            .andExpect(status().isCreated())
            .andExpect(taskFields("$", task1));
    }

    @Test
    void testPatchTaskReturnsPatchedTask() throws Exception {
        Task patched = createTask1();
        patched.setText(TASK2_TEXT);
        patched.setDone(true);

        when(taskService.patchTask(task1.getId(), new PatchTaskRequest(true, TASK2_TEXT)))
            .thenReturn(patched);
        when(taskMapper.toResponse(patched)).thenReturn(responseOf(patched));

        mockMvc.perform(patch(BASE_PATH + "/{id}", task1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(PATCH_TASK_JSON))
            .andExpect(status().isOk())
            .andExpect(taskFields("$", patched));
    }

    @Test
    void testPatchTaskReturnsNotFoundForUnknownId() throws Exception {
        when(taskService.patchTask(MISSING_ID, new PatchTaskRequest(true, TASK2_TEXT)))
            .thenThrow(new TaskNotFoundException(MISSING_ID));

        mockMvc.perform(patch(BASE_PATH + "/{id}", MISSING_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(PATCH_TASK_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    void testMoveTaskUpReturnsTasks() throws Exception {
        List<Task> tasks = List.of(task2, task1);
        when(taskService.moveTaskUp(task1.getId())).thenReturn(tasks);
        when(taskMapper.toResponses(tasks)).thenReturn(responsesOf(tasks));

        mockMvc.perform(patch(BASE_PATH + "/{id}/move-up", task1.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(tasks.size()))
            .andExpect(taskFields("$[0]", task2))
            .andExpect(taskFields("$[1]", task1));

        verify(taskService).moveTaskUp(task1.getId());
    }

    @Test
    void testMoveTaskDownReturnsTasks() throws Exception {
        List<Task> tasks = List.of(task1, task2);
        when(taskService.moveTaskDown(task2.getId())).thenReturn(tasks);
        when(taskMapper.toResponses(tasks)).thenReturn(responsesOf(tasks));

        mockMvc.perform(patch(BASE_PATH + "/{id}/move-down", task2.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(tasks.size()))
            .andExpect(taskFields("$[0]", task1))
            .andExpect(taskFields("$[1]", task2));

        verify(taskService).moveTaskDown(task2.getId());
    }

    @Test
    void testDeleteTaskDeletesWhenTaskExists() throws Exception {
        mockMvc.perform(delete(BASE_PATH + "/{id}", task1.getId()))
            .andExpect(status().isNoContent());

        verify(taskService).deleteTask(task1.getId());
    }

    @Test
    void testDeleteTaskReturnsNotFoundForUnknownId() throws Exception {
        doThrow(new TaskNotFoundException(MISSING_ID))
            .when(taskService).deleteTask(MISSING_ID);

        mockMvc.perform(delete(BASE_PATH + "/{id}", MISSING_ID))
            .andExpect(status().isNotFound());
    }

    private ResultMatcher taskFields(String path, Task task) {
        return result -> {
            jsonPath(path + ".id").value(task.getId().toString()).match(result);
            jsonPath(path + ".text").value(task.getText()).match(result);
            jsonPath(path + ".done").value(task.isDone()).match(result);
            jsonPath(path + ".position").doesNotExist().match(result);
        };
    }

    private TaskResponse responseOf(Task task) {
        return new TaskResponse(task.getId(), task.getText(), task.isDone());
    }

    private List<TaskResponse> responsesOf(List<Task> tasks) {
        return tasks.stream().map(this::responseOf).toList();
    }

    private Task createTask1() {
        Task task = new Task();
        task.setId(PUBLIC_ID);
        task.setPosition(1L);
        task.setText(TASK1_TEXT);
        task.setDone(false);
        return task;
    }

    private Task createTask2() {
        Task task = new Task();
        task.setId(PUBLIC_ID_2);
        task.setPosition(2L);
        task.setText(TASK2_TEXT);
        task.setDone(true);
        return task;
    }

}