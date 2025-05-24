package forum.forum.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "posts")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne()
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    @Column(nullable = false)
    private String status = "Just Posted";
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;
    private String picture;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date dateTime = new Date();
    private Integer likes = 0;
    private Integer dislikes = 0;
    private Long answeredTo;
    @ManyToMany(cascade = {CascadeType.MERGE})
    private List<Tag> tags;
    @OneToMany(mappedBy = "answeredTo")
    private List<Post> comments;
}
