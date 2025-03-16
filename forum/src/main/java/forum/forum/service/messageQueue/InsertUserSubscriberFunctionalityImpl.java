package forum.forum.service.messageQueue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import forum.forum.entity.User;
import forum.forum.repository.UserRepository;

import java.util.Optional;

@Service
public class InsertUserSubscriberFunctionalityImpl implements ISubscriberFunctionality {
    @Autowired
    UserRepository userRepo;
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
        userRepo.save(newUser);
    }
}
