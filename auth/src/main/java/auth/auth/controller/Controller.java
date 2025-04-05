package auth.auth.controller;

import auth.auth.entity.AuthDTO;
import auth.auth.entity.FullUserDTO;
import auth.auth.entity.User;
import auth.auth.service.PasswordService.PasswordHasher;
import auth.auth.service.JWTService.JWTGenerator;
import auth.auth.service.JWTService.JWTParser;
import auth.auth.service.PasswordService.PasswordMatcher;
import auth.auth.service.UserService;
import auth.auth.service.messageQueue.PublisherUtil;
import auth.auth.storage.AwsS3Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
public class Controller {
    @Autowired
    private JWTParser jwtParser;
    @Autowired
    private JWTGenerator jwtGenerator;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordHasher passwordHasher;
    @Autowired
    private PasswordMatcher passwordMatcher;
    @Autowired
    private PublisherUtil pubUtil;
    @Autowired
    private AwsS3Service s3Service;

    @PostMapping("/ban/{id}")
    public ResponseEntity<String> portRes(@CookieValue("jwToken") String token, @PathVariable("id") Long userId){
//        todo:
//            - check if requester is admin
//            - get bannable user form db
//            - set banned user isBanned to true
//            - save into data
//            - send through Q

        if (token == null){
            return new ResponseEntity<>("Access Denied: Missing Credentials", HttpStatus.FORBIDDEN);
        }

        User user = null;
        try {
            user = jwtParser.validateAndExtractClaims(token);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Access Denied: Invalid Credentials", HttpStatus.FORBIDDEN);
        }

        System.out.println("Cookie valid");
        if(!user.getIsAdmin()){
            return new ResponseEntity<>("Access Denied: Not Admin", HttpStatus.UNAUTHORIZED);
        }

        Optional<User> bannableUserOpt = userService.findById(userId);
        User bannableUser = null;
        if(bannableUserOpt.isEmpty()){
            return new ResponseEntity<>("No such user", HttpStatus.NOT_FOUND);
        }
        bannableUser = bannableUserOpt.get();

        bannableUser.setIsBanned(true);
        FullUserDTO fullUser = new FullUserDTO();
        fullUser.setId(userId);
        pubUtil.publishFullUser(fullUser);
        userService.save(bannableUser);

        /// also send through Q

        return new ResponseEntity<>("Banned user successfully", HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse rsp){
        Cookie cookie = new Cookie("jwToken", "");
        cookie.setMaxAge(0);
        rsp.addCookie(cookie);
        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(HttpServletResponse rsp, @RequestBody AuthDTO authData){
        User user;
        Optional<User> optUser = userService.findByEmail(authData.getEmail());

        if(optUser.isEmpty()) {
            return new ResponseEntity<>("Nonexistent user" , HttpStatus.BAD_REQUEST);
        }
        else {
            user = optUser.get();
        }

        if(user.getIsBanned()){
            return new ResponseEntity<>("Banned user" , HttpStatus.FORBIDDEN);
        }

        if(
            !passwordMatcher.isMatch(authData, user, passwordHasher)
        ) return new ResponseEntity<>("Invalid credentials" , HttpStatus.BAD_REQUEST);

        String token = jwtGenerator.generateToken(user);
        rsp.addCookie(new Cookie("jwToken", token));

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    // todo:
    //      - implement a make admin
    //      - take the same steps as for a ban

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestPart("data") FullUserDTO fullUser, @RequestPart("photo") MultipartFile photo){
        String pictureLink = null;
        if (!photo.isEmpty()){
            pictureLink = s3Service.uploadFile(photo, fullUser.getEmail());
        }
        User user = new User();
        try {
            user.setEmail(fullUser.getEmail());
            user.setPassword(passwordHasher.hashPassword(fullUser.getPassword()));
            user.setIsAdmin(false);
        } catch(Exception e){
            System.out.println(e);
            return new ResponseEntity<>("Invalid credentials" , HttpStatus.BAD_REQUEST);
        }

        try {
            userService.save(user);
        } catch(Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Email already in use" , HttpStatus.BAD_REQUEST);
        }

        fullUser.setPicture(pictureLink);
        pubUtil.publishFullUser(fullUser);

        return new ResponseEntity<>("User signed-up successfully", HttpStatus.OK);
    }
}
