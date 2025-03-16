package auth.auth.service.messageQueue;

import com.rabbitmq.client.BuiltinExchangeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class QueueService {
    @Autowired
    private Consumer consumer;

    /// Todo: refactor using exchange bindings
    @EventListener(ApplicationReadyEvent.class)
    public void startQueue() {
        System.out.println("Queue started here");
        consumer.startConsuming();
    }
}
