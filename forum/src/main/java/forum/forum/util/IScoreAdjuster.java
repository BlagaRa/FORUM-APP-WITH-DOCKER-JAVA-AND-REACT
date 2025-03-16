package forum.forum.util;

public interface IScoreAdjuster {
    Integer getQuestionAuthorAdjustment(Integer actionCode);
    Integer getAnswerAuthorAdjustment(Integer actionCode);
    Integer getSenderAdjustment(Integer actionCode);
}
