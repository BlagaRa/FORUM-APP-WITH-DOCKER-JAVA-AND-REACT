package auth.auth.service.JWTService;

import auth.auth.entity.AuthDTO;
import auth.auth.entity.User;
import io.jsonwebtoken.*;
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
