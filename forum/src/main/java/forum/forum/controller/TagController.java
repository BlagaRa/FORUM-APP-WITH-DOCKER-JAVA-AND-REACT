package forum.forum.controller;

import forum.forum.entity.Tag;
import forum.forum.service.TagService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tags")
public class TagController extends AbstractController<Tag, TagService>{
}
