package user.user.messageQueue;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import user.user.entity.ScoreAdjustmentDTO;
import user.user.entity.User;
import user.user.repo.UserRepository;

import java.util.Optional;

@Service
public class AdjustScoreSubFunctionalityImpl implements ISubscriberFunctionality{
    @Autowired
    UserRepository userRepo;

    @Override
    public void callBackFunctionality(String message) {
        ObjectMapper objectMapper = new ObjectMapper();
        ScoreAdjustmentDTO scoreAdjustment;
        try {
            scoreAdjustment = objectMapper.readValue(message, ScoreAdjustmentDTO.class);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return;
        }

        Optional<User> existingSenderOpt = userRepo.findById(scoreAdjustment.getSenderId());
        if(existingSenderOpt.isEmpty()){
            return;
        }
        User existingSender = existingSenderOpt.get();
        existingSender.setScore(
                existingSender.getScore() + scoreAdjustment.getSenderAdjustment()
        );
        userRepo.save(existingSender);

        Optional<User> existingAuthorOpt = userRepo.findById(scoreAdjustment.getAuthorId());
        if(existingAuthorOpt.isEmpty()){
            return;
        }
        User existingAuthor = existingAuthorOpt.get();
        existingAuthor.setScore(
                existingAuthor.getScore() + scoreAdjustment.getAuthorAdjustment()
        );
        userRepo.save(existingAuthor);
    }
}
