package auth.auth.service.JWTService;

import auth.auth.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;


@Service
public class JWTParser extends JWTUtil {
    public User validateAndExtractClaims(String token) {
        // Verify and parse the token
        Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(this.getSecretKey()) // From parent JWTUtil class
                .build()
                .parseSignedClaims(token);

        // Extract claims
        Claims claims = claimsJws.getPayload();

        // Create and populate User object
        User user = new User();
        user.setId(claims.get("id", Long.class));
        user.setEmail(claims.get("email", String.class));
        user.setIsAdmin(claims.get("isAdmin", Boolean.class));

        return user;
    }
}