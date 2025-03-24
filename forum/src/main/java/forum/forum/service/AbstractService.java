package forum.forum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import software.amazon.awssdk.annotations.NotNull;

import java.util.List;
import java.util.Optional;

public abstract class AbstractService<T, R extends JpaRepository<T, Long>>{
    @Autowired
    R repo;

    public Optional<T> findById(Long id){
        return repo.findById(id);
    }

    public List<T> findAll(){
        return repo.findAll();
    }

    public T save(T newEntry){
        return repo.save(newEntry);
    }

    public void deleteById(Long id){
        repo.deleteById(id);
    }
}