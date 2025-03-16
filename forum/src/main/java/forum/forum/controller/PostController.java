package forum.forum.controller;

import forum.forum.entity.*;
import forum.forum.repository.PostRepository;
import forum.forum.handlers.PostActionContainerHandler;
import forum.forum.storage.AwsS3Service;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
//@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.163.178:3000"}, allowCredentials = "true")
public class PostController  {
    @Autowired
    PostRepository postRepo;
    @Autowired
    PostActionContainerHandler handler;
    @Autowired
    AwsS3Service s3Service;

    @PostMapping(value="filtered", consumes="application/json")
    public ResponseEntity<List<PostActionDTO>> pers(HttpServletRequest request, @RequestBody FiltersDTO filters) {
        return new ResponseEntity<>(
                handler.filteredPosts(this.postRepo, ((AuthDTO)request.getAttribute("authData")).getId(),  filters),
                HttpStatus.OK
        );
    }

    @PostMapping("/ph")
    public ResponseEntity<Post> addWithPhoto(HttpServletRequest request, @RequestPart("photo") MultipartFile photo, @RequestPart("data") Post newEntry) {
        String photoLink = s3Service.uploadFile(photo,  newEntry.getTitle());
        newEntry.setPicture(photoLink);
        return new ResponseEntity<>(
                handler.addPost(postRepo, ((AuthDTO)request.getAttribute("authData")), newEntry),
                HttpStatus.OK
        );
    }

    @PostMapping()
    public ResponseEntity<Post> add(HttpServletRequest request, @RequestBody Post newEntry) {
        return new ResponseEntity<>(
                handler.addPost(postRepo, ((AuthDTO)request.getAttribute("authData")), newEntry),
                HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<Post> update(HttpServletRequest request, @RequestBody Post newEntry){
        return new ResponseEntity<>(
                handler.updatePost(postRepo, ((AuthDTO)request.getAttribute("authData")), newEntry),
                HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<Post>> get(@PathVariable Long id){ return new ResponseEntity<>(postRepo.findById(id), HttpStatus.OK);}
}
