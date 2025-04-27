package forum.forum.service;

import forum.forum.entity.Action;
import forum.forum.repository.ActionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ActionService extends AbstractService<Action, ActionRepository> {
    public Optional<Action> findByPostIdAndUserId(Long postId, Long userId) {
        return repo.findByPostIdAndUserId(postId, userId);
    }

    public void deleteByPostIdAndUserId(Long postId, Long userId){
        repo.deleteByPostIdAndUserId(postId, userId);
    }
}
