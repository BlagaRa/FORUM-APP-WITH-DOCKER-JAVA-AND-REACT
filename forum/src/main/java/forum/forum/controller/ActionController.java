package forum.forum.controller;

import forum.forum.entity.Action;
import forum.forum.entity.AuthDTO;
import forum.forum.handlers.ActionControllerHandler;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/actions")
public class ActionController {
    @Autowired
    ActionControllerHandler actionHandler;

    @PostMapping
    public ResponseEntity<String> add(HttpServletRequest req, @RequestBody Action newEntry) {
        AuthDTO authData = (AuthDTO)req.getAttribute("authData");
        newEntry.setUserId(authData.getId());
        return actionHandler.handelAdd(newEntry);
    }

    @DeleteMapping
    public ResponseEntity<String> delete(HttpServletRequest req, @RequestBody Action newEntry) {
        AuthDTO authData = (AuthDTO)req.getAttribute("authData");
        newEntry.setUserId(authData.getId());
        return actionHandler.handleDelete(newEntry);
    }}
