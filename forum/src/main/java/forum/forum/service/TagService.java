package forum.forum.service;

import forum.forum.entity.Tag;
import forum.forum.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TagService extends AbstractService<Tag, TagRepository>{
    public Optional<Tag> findByName(String name) {
        return repo.findByName(name);
    }
}
