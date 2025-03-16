package forum.forum.handlers;

import forum.forum.entity.Action;
import forum.forum.entity.Post;
import forum.forum.entity.ScoreAdjustmentDTO;
import forum.forum.entity.User;
import forum.forum.repository.ActionRepository;
import forum.forum.repository.PostRepository;
import forum.forum.repository.UserRepository;
import forum.forum.service.messageQueue.Producer;
import forum.forum.service.messageQueue.PublishScoreUtil;
import forum.forum.util.ScoreUtil;
import jakarta.transaction.Transactional;
import org.apache.catalina.util.ToStringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ActionControllerHandler {

    @Autowired
    ActionRepository actionRepo;
    @Autowired
    PostRepository postRepo;
    @Autowired
    UserRepository userRepo;
    @Autowired
    ScoreUtil scoreUtil;
    @Autowired
    PublishScoreUtil scorePublisher;

    public ResponseEntity<String> handelAdd(Action action){
        Optional<Post> existingPostOpt = postRepo.findById(action.getPostId());
        if(existingPostOpt.isEmpty()){
            return new ResponseEntity<>(
                    "No such post",
                    HttpStatus.BAD_REQUEST
            );
        }
        Post existingPost = existingPostOpt.get();
        Optional<User> existingSenderOpt = userRepo.findById(action.getUserId());
        if(existingSenderOpt.isEmpty()){
            return new ResponseEntity<>(
                    "No such sender",
                    HttpStatus.BAD_REQUEST
            );
        }
        User existingSender = existingSenderOpt.get();
        if(existingPost.getAuthor() == null) {
            return new ResponseEntity<>(
                    "No such author",
                    HttpStatus.BAD_REQUEST
            );
        }
        if(action.getAction() > 0){
            existingPost.setLikes(existingPost.getLikes() + 1);
        }
        if(action.getAction() < 0){
            existingPost.setDislikes(existingPost.getDislikes() + 1);
        }

        ScoreAdjustmentDTO scoreAdjustment = scoreUtil.getScoreAdjustmentsBasedOnAction(action, existingPost.getAnsweredTo());
        scoreAdjustment.setSenderId(existingSender.getId());
        existingSender.setScore(
                existingSender.getScore() + scoreAdjustment.getSenderAdjustment()
        );
        scoreAdjustment.setAuthorId(existingPost.getAuthor().getId());
        existingPost.getAuthor().setScore(
                existingPost.getAuthor().getScore() + scoreAdjustment.getAuthorAdjustment()
        );

        try{
            actionRepo.save(action);
            postRepo.save(existingPost);
            userRepo.save(existingSender);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(
                    "Action already made",
                    HttpStatus.BAD_REQUEST
            );
        }

        scorePublisher.publishScoreAdjustment(scoreAdjustment);

        return new ResponseEntity<>(
                "Action inserted successfully : Changes made",
                HttpStatus.OK
        );
    }

    @Transactional
    public ResponseEntity<String> handleDelete(Action action){
        actionRepo.deleteByPostIdAndUserId(action.getPostId(), action.getUserId());
        return new ResponseEntity<>(
                "Action deleted successfully",
                HttpStatus.OK
        );
    }
}
