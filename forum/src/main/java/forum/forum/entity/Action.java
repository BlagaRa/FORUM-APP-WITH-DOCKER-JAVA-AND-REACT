package forum.forum.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "actions", uniqueConstraints =
        {@UniqueConstraint(columnNames = {"postId", "userId"})}
)
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long postId;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private Integer action;

    public Action() {}
    public Action(Long postId, Long userId, Integer action) {
        this.postId = postId;
        this.userId = userId;
        this.action = action;
    }
}
