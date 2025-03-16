package auth.auth.repo;

import auth.auth.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDAO {
    @Autowired
    UserRepository userRepo;
//    public void save(User user){
//        user.
//        userRepo.save(user);
//    }
    public Optional<User> findByUsername(String username){
        return userRepo.findByEmail(username);
    }
}
