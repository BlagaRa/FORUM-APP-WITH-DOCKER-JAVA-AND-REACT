package user.user.util;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class SmsUtil {
    public static final String ACCOUNT_SID = "_";
    public static final String AUTH_TOKEN = "_";
    public static final String FROM = "+1 9704382457";
    public static Boolean isTwilioInit= false;

    public void sendSms(String to, String content) {
        if(!isTwilioInit){
            Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
            isTwilioInit = true;
        }
        try {
            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(FROM),
                    content
            ).create();
        } catch (Exception e) {
            e.getMessage();
            e.printStackTrace();
        }
    }
}
