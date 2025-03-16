package auth.auth.service.messageQueue;

import auth.auth.entity.FullUserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublisherUtil {
    private final static String QUEUE_USER = "user_const";
    private final static String QUEUE_FORUM = "forum_const";
    @Autowired
    Producer producer;

    public void publishFullUser(FullUserDTO fullUser) {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonFullUser = "{}";
        try {
            jsonFullUser = objectMapper.writeValueAsString(fullUser);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return;
        }

        producer.publish(QUEUE_USER, jsonFullUser);
        producer.publish(QUEUE_FORUM, jsonFullUser);
    }
}
