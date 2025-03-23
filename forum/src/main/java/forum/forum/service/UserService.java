package forum.forum.service;

import forum.forum.entity.User;
import forum.forum.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService extends AbstractService<User, UserRepository> {
}
