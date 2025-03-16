package auth.auth.service.PasswordService;

import auth.auth.entity.AuthDTO;
import auth.auth.entity.User;
import org.springframework.stereotype.Service;

@Service
public class PasswordMatcher {
    private Boolean isPasswordMatch(String plainPassword, String hashedPassword, PasswordHasher hasher){
        try {
            return hasher.hashPassword(plainPassword).equals(hashedPassword);
        } catch (Exception e){
            System.out.println(e);
            return false;
        }
    }

    public Boolean isMatch(AuthDTO authData, User user, PasswordHasher hasher){
        return (
                authData.getEmail().equals(user.getEmail()) &&
                        isPasswordMatch(authData.getPassword(), user.getPassword(), hasher)
        );
    }
}
