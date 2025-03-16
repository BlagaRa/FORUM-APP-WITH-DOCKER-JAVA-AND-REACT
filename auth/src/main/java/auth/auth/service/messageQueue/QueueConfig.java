package auth.auth.service.messageQueue;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfig { // TODO: needs renaming
    public final int SECONDS = 3000;

    @Value("${amqp.url}")
    public String url;

    @Value("${amqp.password}")
    public String password;
}

