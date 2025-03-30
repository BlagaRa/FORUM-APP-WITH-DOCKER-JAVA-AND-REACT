package user.user.util;

import org.apache.commons.mail.Email;
import org.apache.commons.mail.SimpleEmail;
import org.apache.commons.mail.DefaultAuthenticator;
import org.springframework.stereotype.Service;

@Service
public class EmailUtil {
    public void sendEmail(String to, String subject, String body) {
        Email email = new SimpleEmail();
        email.setHostName("smtp.gmail.com");
        email.setSmtpPort(465);
        email.setAuthenticator(new DefaultAuthenticator("koathbaht@gmail.com", "jruilktdupjokrdm"));
        email.setSSLOnConnect(true);
        try {
            email.setFrom("koathbaht@gmail.com");
            email.setSubject(subject);
            email.setMsg(body);
            email.addTo(to);
            email.send();
        } catch (Exception e) {
            e.getMessage() ;
            e.printStackTrace();
        }
    }
}
