package auth.auth.service.messageQueue;

import com.rabbitmq.client.BuiltinExchangeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Component;

@Component
@Configurable
public class Producer extends AbstractQueue {
    @Autowired
    public Producer(QueueConfig queueConfig) {
        super(queueConfig);
    }

    public void publish(String routingKey, String message){
        try {
            channel.basicPublish("", routingKey, null, message.getBytes());
            System.out.println("Cloud_AMPQ: Sent message: " + message);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
