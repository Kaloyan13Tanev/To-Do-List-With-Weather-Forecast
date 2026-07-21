package bg.sofia.elando.todolist.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
public class Task {

    public Task() {
        done = false;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String text;
    private boolean done;

}
