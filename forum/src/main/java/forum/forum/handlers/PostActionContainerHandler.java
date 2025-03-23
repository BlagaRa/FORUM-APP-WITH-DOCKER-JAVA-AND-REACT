package forum.forum.handlers;

import forum.forum.entity.*;
import forum.forum.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostActionContainerHandler {
    @Autowired
    PostService postService;

    public List<PostActionDTO> filteredPosts(Long userId, FiltersDTO filters){
        return postService.findPostsPersonalized(
                userId,
                filters
        );
    }

    public Post addPost(AuthDTO authData, Post newEntry){
        newEntry.setDateTime(new Date());
        newEntry.setAuthor(new User(authData.getId(), null));
        newEntry.setStatus("opened");
        postService.save(newEntry);
        return newEntry;
    }

    public Post updatePost(AuthDTO authData, Post newEntry){
        Optional<Post> oldEntryOpt = postService.findById(newEntry.getId());
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
        postService.save(oldEntry);

        return oldEntry;
    }

    public Optional<Post> get(Long id){ return postService.findById(id);}
}
