package forum.forum.service.messageQueue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import forum.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import forum.forum.entity.User;

@Service
public class InsertUserSubscriberFunctionalityImpl implements ISubscriberFunctionality {
    @Autowired
    UserService userService;
    @Override
    public void callBackFunctionality(String message) {
        ObjectMapper objectMapper = new ObjectMapper();
        User newUser;
        try {
            newUser = objectMapper.readValue(message, User.class);
        } catch (JsonProcessingException e) {
            System.out.println(e.getMessage());
            return;
        }
        System.out.println(newUser);
        try {
            userService.save(newUser);
        } catch (Exception ignored) {}
    }
}
