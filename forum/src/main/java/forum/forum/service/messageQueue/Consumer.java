package forum.forum.service.messageQueue;

import com.rabbitmq.client.DeliverCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@Configurable
public class Consumer extends AbstractQueue {
    @Autowired
    public Consumer(QueueConfig queueConfig) {
        super(queueConfig);
    }

    public void startConsuming(ISubscriberFunctionality subscriberFunctionality, String route) {
        try {
            channel.queueDeclare(route, DURABLE, EXCLUSIVE, AUTO_DELETE, null);
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
                System.out.println("Cloud_AMPQ: Received message: " + message);
                subscriberFunctionality.callBackFunctionality(message);
            };
            channel.basicConsume(route, true, deliverCallback, consumerTag -> {});
            System.out.println("Consumer started, listening for messages on queue: " + route);
        } catch (Exception e) {
            System.out.println("Error starting consumer: " + e.getMessage());
        }
    }
}
