package forum.forum.controller;

import forum.forum.service.AbstractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public abstract class AbstractController<T, S extends AbstractService<T, ?>>{
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private S service;

    @PostMapping
    public ResponseEntity<T> add(@RequestBody T newEntry) {
        service.save(newEntry);
        return new ResponseEntity<>(newEntry, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id){
        service.deleteById(id);
    }

    @GetMapping
    public ResponseEntity<List<T>> getAll(){
        List<T> list = service.findAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Optional<T>> get(@PathVariable Long id){ return new ResponseEntity<>(service.findById(id), HttpStatus.OK);}
}
