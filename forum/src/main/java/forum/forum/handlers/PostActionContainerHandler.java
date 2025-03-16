package forum.forum.handlers;

import forum.forum.entity.*;
import forum.forum.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostActionContainerHandler {
    public List<PostActionDTO> filteredPosts(PostRepository postRepository, Long userId, FiltersDTO filters){
        Boolean ignoreTags = false;
        if(filters.getTags() == null) {
            ignoreTags = true;
            filters.setTags(new ArrayList<>());
        }
        return postRepository.findPostsPersonalized(
                userId,
                filters.getAnswerId(),
                filters.getTags(),
                ignoreTags,
                filters.getTitleQuery()
        );
    }

    public Post addPost(PostRepository postRepo, AuthDTO authData, Post newEntry){
        newEntry.setDateTime(new Date());
        newEntry.setAuthor(new User(authData.getId(), null));
        newEntry.setStatus("opened");
        postRepo.save(newEntry);
        return newEntry;
    }

    public Post updatePost(PostRepository postRepo, AuthDTO authData, Post newEntry){
        Optional<Post> oldEntryOpt = postRepo.findById(newEntry.getId());
        if(oldEntryOpt.isEmpty()) return null;
        Post oldEntry = oldEntryOpt.get();

        if(!authData.getId().equals(oldEntry.getAuthor().getId())){
            return null;
        }

        if(newEntry.getTitle() != null){
            oldEntry.setTitle(newEntry.getTitle());
        }
        if(newEntry.getText() != null){
            oldEntry.setText(newEntry.getText());
        }
        postRepo.save(oldEntry);

        return oldEntry;
    }
}
