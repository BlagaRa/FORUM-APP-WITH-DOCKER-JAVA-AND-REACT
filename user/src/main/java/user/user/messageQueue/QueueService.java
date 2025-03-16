package user.user.messageQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class QueueService {
    @Autowired
    private Consumer consumerUserConst;
    @Autowired
    private Consumer consumerUserScore;

    @Autowired
    InsertUserSubscriberFunctionalityImpl insertSubFunc;
    @Autowired
    AdjustScoreSubFunctionalityImpl scoreSubFunc;

    @EventListener(ApplicationReadyEvent.class)
    public void startQueue(){
        System.out.println("Queue started here");
        consumerUserConst.startConsuming(insertSubFunc, "user_const");
        consumerUserScore.startConsuming(scoreSubFunc, "adjust_score");
    }
}
