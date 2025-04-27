package user.user.util.scoreUtil;

public interface IScoreAdjuster {
    Integer getQuestionAuthorAdjustment(Integer actionCode);
    Integer getAnswerAuthorAdjustment(Integer actionCode);
    Integer getSenderAdjustment(Integer actionCode);
}
