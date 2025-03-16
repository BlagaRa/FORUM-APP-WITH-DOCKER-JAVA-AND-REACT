package user.user.messageQueue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import user.user.entity.User;
import user.user.repo.UserRepository;

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

        if(newUser.getId() == null){ // if userId is null just insert user
            userRepo.save(newUser);
            return;
        }

        Optional<User> existingUserOpt = userRepo.findById(newUser.getId());
        if(existingUserOpt.isEmpty()){
            userRepo.save(newUser);
            return;
        }
        /// todo: handle updating the is banned field
        User existingUser = existingUserOpt.get();
        existingUser.setIsBanned(true);
        userRepo.save(existingUser);
    }
}
