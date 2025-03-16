package user.user.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import user.user.entity.ActionDTO;
import user.user.entity.ScoreAdjustmentDTO;

@Service
public class ScoreUtil {
    @Autowired
    PositiveScoreAdjusterValues positiveScoreAdjusterValues;

    @Autowired
    NegativeScoreAdjusterValues negativeScoreAdjusterValues;

    public ScoreAdjustmentDTO adjustUsersScoreBaseOnAction(ActionDTO action, Long postParentId){
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
