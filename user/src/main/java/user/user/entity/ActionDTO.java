package user.user.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActionDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private Integer action;

    public ActionDTO() {}

    public ActionDTO(Long id, Long postId, Long userId, Integer action) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.action = action;
    }
}
