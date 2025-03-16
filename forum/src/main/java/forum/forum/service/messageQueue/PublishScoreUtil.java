package forum.forum.service.messageQueue;

import com.fasterxml.jackson.databind.ObjectMapper;
import forum.forum.entity.ScoreAdjustmentDTO;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublishScoreUtil {
    private static final String QUEUE = "adjust_score";
    @Autowired
    Producer producer;

    public void publishScoreAdjustment(ScoreAdjustmentDTO scoreAdjustment){
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonScoreAdjustment = "{}";
        try{
            jsonScoreAdjustment = objectMapper.writeValueAsString(scoreAdjustment);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return;
        }

        producer.publish(QUEUE, jsonScoreAdjustment);
    }
}
