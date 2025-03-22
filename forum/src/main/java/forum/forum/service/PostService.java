package forum.forum.service;

import forum.forum.entity.FiltersDTO;
import forum.forum.entity.Post;
import forum.forum.entity.PostActionDTO;
import forum.forum.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService extends AbstractService<Post, PostRepository> {
    public List<PostActionDTO> findPostsPersonalized(Long userId, FiltersDTO filters){
        return repo.findPostsPersonalized(
                userId,
                filters.getAnswerId(),
                filters.getTags(),
                filters.getTags() == null || filters.getTags().isEmpty(),
                filters.getTitleQuery()
        );
    }

}
