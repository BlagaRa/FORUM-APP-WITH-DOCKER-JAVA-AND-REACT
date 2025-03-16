package user.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScoreAdjustmentDTO {
    private Long senderId;
    private Integer senderAdjustment = 0;
    private Long authorId;
    private Integer authorAdjustment = 0;

    public ScoreAdjustmentDTO(Integer senderAdjustment, Integer receiverAdjustment) {
        this.senderAdjustment = senderAdjustment;
        this.authorAdjustment = receiverAdjustment;
    }
}
