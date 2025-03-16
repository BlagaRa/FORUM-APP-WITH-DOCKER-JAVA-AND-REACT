package auth.auth.service.JWTService;

import auth.auth.entity.AuthDTO;
import auth.auth.entity.User;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTGenerator extends JWTUtil {
    public String generateToken(User userData) {
        Map<String, Object> claims = extractClaims(userData);
        return Jwts.builder()
                .claims(claims)
                .signWith(this.getSecretKey())
                .compact();
    }

    private Map<String, Object> extractClaims(Object object) {
        Map<String, Object> claims = new HashMap<>();
        Field[] fields = object.getClass().getDeclaredFields();

        for (Field field : fields) {
            field.setAccessible(true);
            try {
                claims.put(field.getName(), field.get(object));
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Error extracting claims via reflection", e);
            }
            field.setAccessible(false);
        }
        claims.remove("password");
        return claims;
    }
}
