package forum.forum.service.messageQueue;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.springframework.stereotype.Component;

@Component
public abstract class AbstractQueue {
    public final boolean DURABLE = false;
    public final boolean EXCLUSIVE = false;
    public final boolean AUTO_DELETE = false;

    protected ConnectionFactory factory;
    protected Connection connection;
    protected Channel channel;

    public AbstractQueue(QueueConfig queueConfig){
        try {
            System.out.println(queueConfig.url);
            factory = new ConnectionFactory();
            factory.setUri(queueConfig.url);
            factory.setConnectionTimeout(queueConfig.SECONDS);

            connection = factory.newConnection();
            channel = connection.createChannel();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
