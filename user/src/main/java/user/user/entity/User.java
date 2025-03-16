package user.user.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "users") // Specifies the table name in the database
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String phoneNumber;
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Boolean isAdmin = false;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer score = 0;
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Boolean isBanned = false;
    private String picture;

    public User() {}

    public User(Long id, String name, String email, String phoneNumber, Boolean isAdmin, Integer score, Boolean isBanned, String picture) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.isAdmin = isAdmin;
        this.score = score;
        this.isBanned = isBanned;
        this.picture = picture;
    }

//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPhoneNumber() {
//        return phoneNumber;
//    }
//
//    public void setPhoneNumber(String phoneNumber) {
//        this.phoneNumber = phoneNumber;
//    }
//
//    public Boolean getAdmin() {
//        return isAdmin;
//    }
//
//    public void setAdmin(Boolean admin) {
//        isAdmin = admin;
//    }
//
//    public Integer getScore() {
//        return score;
//    }
//
//    public void setScore(Integer score) {
//        this.score = score;
//    }
//
//    public Boolean getBanned() {
//        return isBanned;
//    }
//
//    public void setBanned(Boolean banned) {
//        isBanned = banned;
//    }
//
//    public String getPicture() {
//        return picture;
//    }
//
//    public void setPicture(String picture) {
//        this.picture = picture;
//    }
}
