package auth.auth.service.PasswordService;

import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;

@Service
public class PasswordHasher {
    private final static byte[] SALT = "9b2389f06978fe3ef6dd57f8720fc1dbe6a2d8e9265d3795ed2ee2df6bd760a0"
            .getBytes(StandardCharsets.UTF_8);
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256; // Increase security
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256"; // More secure than SHA-1

    public String hashPassword(String password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        KeySpec spec = new PBEKeySpec(password.toCharArray(), SALT, ITERATIONS, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);
        return HexUtils.toHexString(factory.generateSecret(spec).getEncoded());
    }
}
