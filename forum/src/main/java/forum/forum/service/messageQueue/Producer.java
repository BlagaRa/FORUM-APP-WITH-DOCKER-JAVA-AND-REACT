package forum.forum.service.messageQueue;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Component;

@Component
@Configurable
public class Producer extends AbstractQueue {
    private final String QUEUE = "user_const";

    public Producer(QueueConfig queueConfig) {
        super(queueConfig);
    }

    public void publish(String routingKey, String message){
        try {
            channel.queueDeclare(QUEUE, DURABLE, EXCLUSIVE, AUTO_DELETE, null);
            channel.basicPublish("", routingKey, null, message.getBytes());
            System.out.println("Cloud_AMPQ: Sent message: " + message);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
