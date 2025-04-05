package user.user.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import user.user.util.EmailUtil;
import user.user.util.SmsUtil;

//@RestController
//@RequestMapping("email")
public class TestCommController {
//    @Autowired
    EmailUtil emailUtil;
//    @Autowired
    SmsUtil smsUtil;

    @GetMapping("email/{to}")
    public ResponseEntity<String> sendEmail(@PathVariable String to){
        emailUtil.sendEmail(to, "TestCommController", "TestCommController");
        return ResponseEntity.ok("Email sent");
    }

    @GetMapping("sms/{to}")
    public ResponseEntity<String> sendSms(@PathVariable String to){
        smsUtil.sendSms(to, "TestCommController");
        return ResponseEntity.ok("Sms sent");
    }
}
