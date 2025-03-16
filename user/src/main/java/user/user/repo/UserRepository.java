package user.user.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import user.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> { }
