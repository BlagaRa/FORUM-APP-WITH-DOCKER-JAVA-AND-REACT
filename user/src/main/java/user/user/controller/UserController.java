package user.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user.user.entity.AuthDTO;
import user.user.entity.User;
import user.user.repo.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserRepository repo;

    @PatchMapping
    public ResponseEntity<User> update(@RequestBody User newUser){
        // todo: refactor to find by email or not
        Optional<User> oldUserOpt = repo.findById(newUser.getId());
        if(oldUserOpt.isEmpty()) return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        User oldUser = oldUserOpt.get();
        BeanUtils.copyProperties(newUser, oldUser, "id");
        repo.save(oldUser);

        return new ResponseEntity<>(oldUser, HttpStatus.OK);
    }

    @GetMapping("/id")
    public ResponseEntity<Optional<User>> getIdentity(HttpServletRequest req){
        AuthDTO authData = (AuthDTO) req.getAttribute("authData");
        return new ResponseEntity<>(repo.findById(authData.getId()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<User>> get(@PathVariable Long id){ return new ResponseEntity<>(repo.findById(id), HttpStatus.OK);}
    @GetMapping
    public ResponseEntity<List<User>> getAll(HttpServletRequest  req){
        if(!((AuthDTO) req.getAttribute("authData")).getIsAdmin()){
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(repo.findAll(), HttpStatus.OK);
    }
}
