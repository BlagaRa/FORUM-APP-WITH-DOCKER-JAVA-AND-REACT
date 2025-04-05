package user.user.messageQueue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import user.user.entity.User;
import user.user.service.UserService;
import user.user.util.EmailUtil;
import user.user.util.SmsUtil;

import java.util.Optional;

@Service
public class InsertUserSubscriberFunctionalityImpl implements ISubscriberFunctionality {
    @Autowired
    UserService userService;
    @Autowired
    EmailUtil emailUtil;
    @Autowired
    SmsUtil smsUtil;
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

        // if userId was not sent through Q just insert user
        if(newUser.getId() == null){
            userService.save(newUser);
            return;
        }

        // if userId was sent through Q BUT doesn't exist in DB just insert user
        Optional<User> existingUserOpt = userService.findById(newUser.getId());
        if(existingUserOpt.isEmpty()){
            userService.save(newUser);
            return;
        }

        // if everything is ok just set  the isBanned field and save
        User existingUser = existingUserOpt.get();
        existingUser.setIsBanned(true);
        userService.save(existingUser);

        System.out.println(existingUser.getEmail() + " " + existingUser.getName());
        smsUtil.sendSms("+1 8777804236", "The account linked to this phone number, with the name " + existingUser.getName() + ",  has been banned.");
        emailUtil.sendEmail(existingUser.getEmail(), "Banning announcement", "The account linked to this email, with the name " + existingUser.getName() + ", has been banned.");
    }
}
