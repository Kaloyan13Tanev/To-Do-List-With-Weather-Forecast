package bg.sofia.elando.todolist.dto;

import java.util.UUID;

public record TaskResponse(UUID id, String text, boolean done) {
}