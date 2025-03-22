package forum.forum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public abstract class AbstractController<T, R extends JpaRepository<T, Long>>{
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private R repo;

    @PostMapping
    public ResponseEntity<T> add(@RequestBody T newEntry) {
        repo.save(newEntry);
        return new ResponseEntity<>(newEntry, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id){
        repo.deleteById(id);
    }

    @GetMapping
    public ResponseEntity<List<T>> getAll(){
        List<T> list = repo.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<T>> get(@PathVariable Long id){ return new ResponseEntity<>(repo.findById(id), HttpStatus.OK);}
}
