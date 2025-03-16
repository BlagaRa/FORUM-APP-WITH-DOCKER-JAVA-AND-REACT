package user.user.security.jwtService;

import user.user.entity.AuthDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;


@Service
public class JWTParser extends JWTUtil {
    public AuthDTO validateAndExtractClaims(String token) {
        Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(this.getSecretKey()) // From parent JWTUtil class
                .build()
                .parseSignedClaims(token);

        Claims claims = claimsJws.getPayload();

        AuthDTO user = new AuthDTO();
        user.setId(claims.get("id", Long.class));
        user.setEmail(claims.get("email", String.class));
        user.setIsAdmin(claims.get("isAdmin", Boolean.class));

        return user;
    }
}