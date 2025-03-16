package forum.forum.util;

import forum.forum.entity.Action;
import forum.forum.entity.ScoreAdjustmentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScoreUtil {
    @Autowired
    PositiveScoreAdjusterValues positiveScoreAdjusterValues;

    @Autowired
    NegativeScoreAdjusterValues negativeScoreAdjusterValues;

    /// todo: maybe change how parameters are passed, maybe through a dto
        // post parent id is here to tell if it's a question or answer
    public ScoreAdjustmentDTO getScoreAdjustmentsBasedOnAction(Action action, Long postParentId){
        IScoreAdjuster adjusterMethod =
                action.getAction() < 0 ? negativeScoreAdjusterValues : positiveScoreAdjusterValues;

        return adjustUsersScoreBaseOnAction(action.getAction(), postParentId, adjusterMethod);
    }

    private ScoreAdjustmentDTO adjustUsersScoreBaseOnAction(Integer actionCode, Long postParentId, IScoreAdjuster adjuster) {
        Integer receiverAdjustment;
        if(postParentId != null){
            receiverAdjustment = adjuster.getAnswerAuthorAdjustment(actionCode);
        }
        else {
            receiverAdjustment = adjuster.getQuestionAuthorAdjustment(actionCode);
        }
        Integer senderAdjustment = adjuster.getSenderAdjustment(actionCode);

        return new ScoreAdjustmentDTO(senderAdjustment, receiverAdjustment);
    }
}
