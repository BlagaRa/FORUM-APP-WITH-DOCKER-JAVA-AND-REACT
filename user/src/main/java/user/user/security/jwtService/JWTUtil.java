package user.user.security.jwtService;

import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;

@Service
public class JWTUtil {
    private final SecretKey secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode("secretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecret"));

    public SecretKey getSecretKey() {
        return secretKey;
    }
}
