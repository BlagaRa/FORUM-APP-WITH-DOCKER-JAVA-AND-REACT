package auth.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/// TODO: maybe insert the whole user here

@Getter
@Setter
@ToString
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(name = "is_admin", nullable = false)
    private Boolean isAdmin = false;
    @Column(name = "is_banned", nullable = false)
    private Boolean isBanned = false;
    @Column(name = "password", nullable = false)
    private String password;

    public User() {}
    public User(Long id, String email, Boolean isAdmin, Boolean isBanned) {
        this.id = id;
        this.email = email;
        this.isAdmin = isAdmin;
        this.isBanned = isBanned;
    }
}
