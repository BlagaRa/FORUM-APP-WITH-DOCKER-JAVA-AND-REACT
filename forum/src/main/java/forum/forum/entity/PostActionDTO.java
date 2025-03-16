package forum.forum.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class PostActionDTO implements Serializable {
    private Post post;
    private Action action;

    public PostActionDTO() {
    }

    public PostActionDTO(Post post, Action action) {
        this.post = post;
        this.action = action;
    }
}
