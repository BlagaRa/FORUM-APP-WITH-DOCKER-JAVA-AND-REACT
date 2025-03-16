package forum.forum.util;

import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;

@Configuration
public class PositiveScoreAdjusterValues implements IScoreAdjuster{
    private final ArrayList<Integer> positiveQuestionAuthorAdjustment= new ArrayList<>(Arrays.asList(
            25
    ));
    private final ArrayList<Integer> positiveAnswerAuthorAdjustments = new ArrayList<>(Arrays.asList(
            50
    ));

    private final ArrayList<Integer> positiveSenderAdjustments = new ArrayList<>(Arrays.asList(
            0
    ));


    @Override
    public Integer getQuestionAuthorAdjustment(Integer actionCode) {
        return positiveQuestionAuthorAdjustment.get(actionCode-1);
    }

    @Override
    public Integer getAnswerAuthorAdjustment(Integer actionCode) {
        return positiveAnswerAuthorAdjustments.get(actionCode-1);
    }

    @Override
    public Integer getSenderAdjustment(Integer actionCode) {
        return positiveSenderAdjustments.get(actionCode-1);
    }
}
