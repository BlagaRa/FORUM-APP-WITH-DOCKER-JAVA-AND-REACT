package auth.auth.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FullUserDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Boolean isAdmin = false;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer score = 0;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Boolean isBanned = false;
    private String picture;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public FullUserDTO() {
    }
    public FullUserDTO(Long id, String name, String email, String phoneNumber, Boolean isAdmin, Integer score, Boolean isBanned, String picture, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.isAdmin = isAdmin;
        this.score = score;
        this.isBanned = isBanned;
        this.picture = picture;
        this.password = password;
    }
}