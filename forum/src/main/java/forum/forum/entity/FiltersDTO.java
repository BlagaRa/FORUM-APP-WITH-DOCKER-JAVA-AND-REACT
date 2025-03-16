package forum.forum.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.core.metrics.StartupStep;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FiltersDTO {
    /// TODO: fix this awful naming
    private Long answerId;
    private String titleSearch;
    private String textsSearch;
    private List<Tag> tags;
    private String titleQuery;
}
