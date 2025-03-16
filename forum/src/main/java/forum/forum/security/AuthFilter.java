package forum.forum.security;

import forum.forum.entity.AuthDTO;
import forum.forum.security.JWTParser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthFilter extends OncePerRequestFilter {
    @Autowired
    JWTParser jwtParser;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");

        if(request.getMethod().equals("OPTIONS")){
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        Cookie wantedCookie = null;
        Cookie[] cookies = request.getCookies();
        if(cookies == null) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Invalid or Missing Credentials");
            return;
        }

        for(Cookie cookie: cookies) {
            if("jwToken".equals(cookie.getName()))
                wantedCookie = cookie;
        }
        if (wantedCookie == null){
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Invalid or Missing Credentials");
            return;
        }

        AuthDTO authDTO = null;
        try {
            authDTO = jwtParser.validateAndExtractClaims(wantedCookie.getValue());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Invalid or Missing Credentials");
        }
        System.out.println("Cookie valid");
        request.setAttribute("authData", authDTO);

        filterChain.doFilter(request, response);
    }
}
