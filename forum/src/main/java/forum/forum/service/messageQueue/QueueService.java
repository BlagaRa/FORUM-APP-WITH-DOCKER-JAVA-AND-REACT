package forum.forum.service.messageQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class QueueService {
    @Autowired
    private Consumer consumer;

    @Autowired
    private InsertUserSubscriberFunctionalityImpl insertSubFunc;

    @Autowired

    @EventListener(ApplicationReadyEvent.class)
    public void startQueue(){
        System.out.println("Queue started here");
        consumer.startConsuming(insertSubFunc, "forum_const");
    }
}
