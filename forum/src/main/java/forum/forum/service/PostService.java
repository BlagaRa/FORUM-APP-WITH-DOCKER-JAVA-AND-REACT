package forum.forum.service;

import forum.forum.entity.FiltersDTO;
import forum.forum.entity.Post;
import forum.forum.entity.PostActionDTO;
import forum.forum.entity.Tag;
import forum.forum.repository.ActionRepository;
import forum.forum.repository.PostRepository;
import forum.forum.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService extends AbstractService<Post, PostRepository> {
    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ActionRepository actionRepository;

    public Post insertPost(Post newEntry) {
        newEntry.setStatus("opened");
        for(int i = 0; i < newEntry.getTags().size(); i++){ // handle quick tag insertion
            Tag tag = newEntry.getTags().get(i);
            if(tag.getId() != null) {
                continue;
            }
            try {
                newEntry.getTags().set(i, tagRepository.save(tag));
            } catch (Exception e) {
                newEntry.getTags().set(i, tagRepository.findByName(tag.getName()).orElse(null));
            }
        }
        return repo.save(newEntry);
    }

    public List<PostActionDTO> findPostsPersonalized(Long userId, FiltersDTO filters){
        Boolean ignoreTags = false;
        if(filters.getTags() == null) {
            ignoreTags = true;
            filters.setTags(new ArrayList<>());
        }
        return repo.findPostsPersonalized(
                userId,
                filters.getAnswerId(),
                filters.getTags(),
                ignoreTags,
                filters.getTitleQuery()
        );
    }

    public void deletePost(Long postId) {
        actionRepository.deleteByPostId(postId);
        repo.deleteById(postId);
    }
}
