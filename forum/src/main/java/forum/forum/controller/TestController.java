package forum.forum.controller;

import forum.forum.entity.AuthDTO;
import forum.forum.storage.AwsS3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Controller
@RequestMapping("photo")
public class TestController {
    @Autowired
    AwsS3Service s3Service;

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping()
    public ResponseEntity<String> getPhotoAndData(@RequestPart("photo") MultipartFile photo, @RequestPart("data") AuthDTO data){
        return new ResponseEntity<>(
                s3Service.uploadFile(photo, "name1"),
                HttpStatus.OK);
    }
}
