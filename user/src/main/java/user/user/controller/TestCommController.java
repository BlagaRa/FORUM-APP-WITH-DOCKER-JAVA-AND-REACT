package user.user.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import user.user.util.EmailUtil;

@RestController
@RequestMapping("email")
public class TestEmailController {
    @Autowired
    EmailUtil emailUtil;

    @GetMapping("send/{to}")
    public ResponseEntity<String> send(@PathVariable String to){
        emailUtil.sendEmail(to, "TestEmailController", "TestEmailController");
        return ResponseEntity.ok("Email sent");
    }
}
