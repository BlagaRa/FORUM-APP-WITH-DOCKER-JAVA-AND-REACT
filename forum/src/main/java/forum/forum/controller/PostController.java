package forum.forum.controller;

import forum.forum.entity.*;
import forum.forum.handlers.PostActionContainerHandler;
import forum.forum.service.PostService;
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
public class PostController  {
    @Autowired
    PostActionContainerHandler handler;
    @Autowired
    AwsS3Service s3Service;

    @PostMapping(value="filtered", consumes="application/json")
    public ResponseEntity<List<PostActionDTO>> pers(HttpServletRequest request, @RequestBody FiltersDTO filters) {
        return new ResponseEntity<>(
                handler.filteredPosts(((AuthDTO)request.getAttribute("authData")).getId(),  filters),
                HttpStatus.OK
        );
    }

    @PostMapping("/ph")
    public ResponseEntity<Post> addWithPhoto(HttpServletRequest request, @RequestPart("photo") MultipartFile photo, @RequestPart("data") Post newEntry) {
        String photoLink = s3Service.uploadFile(photo,  newEntry.getTitle());
        newEntry.setPicture(photoLink);
        return new ResponseEntity<>(
                handler.addPost(((AuthDTO)request.getAttribute("authData")), newEntry),
                HttpStatus.OK
        );
    }

    @PostMapping()
    public ResponseEntity<Post> add(HttpServletRequest request, @RequestBody Post newEntry) {
        return new ResponseEntity<>(
                handler.addPost(((AuthDTO)request.getAttribute("authData")), newEntry),
                HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<Post> update(HttpServletRequest request, @RequestBody Post newEntry){
        return new ResponseEntity<>(
                handler.updatePost(((AuthDTO)request.getAttribute("authData")), newEntry),
                HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<Post>> get(@PathVariable Long id){ return new ResponseEntity<>(handler.get(id), HttpStatus.OK);}

    @DeleteMapping("{id}")
    public ResponseEntity<String> delete(HttpServletRequest req, @PathVariable Long id){

        handler.delete(((AuthDTO) req.getAttribute("authData")), id);
        return new ResponseEntity<>("Deleted post successfuly", HttpStatus.OK);
    }
}
