package forum.forum.util;

import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;

@Configuration
public class NegativeScoreAdjusterValues implements IScoreAdjuster{
    private final ArrayList<Integer> negativeQuestionAuthorAdjustment= new ArrayList<>(Arrays.asList(
            -15
    ));
    private final ArrayList<Integer> negativeAnswerAuthorAdjustments = new ArrayList<>(Arrays.asList(
            -25
    ));

    private final ArrayList<Integer> negativeSenderAdjustments = new ArrayList<>(Arrays.asList(
            -15
    ));


    @Override
    public Integer getQuestionAuthorAdjustment(Integer actionCode) {
        return negativeQuestionAuthorAdjustment.get(-1*actionCode-1);
    }

    @Override
    public Integer getAnswerAuthorAdjustment(Integer actionCode) {
        return negativeAnswerAuthorAdjustments.get(-1*actionCode-1);
    }

    @Override
    public Integer getSenderAdjustment(Integer actionCode) {
        return negativeSenderAdjustments.get(-1*actionCode-1);
    }
}
