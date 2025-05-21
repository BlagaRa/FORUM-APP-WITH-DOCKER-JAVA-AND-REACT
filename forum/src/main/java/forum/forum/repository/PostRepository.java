package forum.forum.repository;

import forum.forum.entity.Post;
import forum.forum.entity.PostActionDTO;
import forum.forum.entity.Tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    /// TODO: add preprocess vectorization of the title to improve performance
    @Query("SELECT new forum.forum.entity.PostActionDTO(p, a) " +
            "FROM Post p LEFT JOIN Action a ON p.id = a.postId AND a.userId = :userId " +
            "LEFT JOIN p.tags t "  +
            "WHERE " +
            "((:answerToId IS NULL AND p.answeredTo IS NULL) OR p.answeredTo = :answerToId) " +
            "AND (:ignoreTags = true OR t IN :tags) " +
            "AND (:titleQuery IS NULL or :titleQuery = '' OR CAST(fts(p.title, :titleQuery) AS BOOLEAN))"
    )
    List<PostActionDTO> findPostsPersonalized(
            @Param("userId") Long userId,
            @Param("answerToId") Long answeredToId,
            @Param("tags") List<Tag> tags,
            @Param("ignoreTags")  Boolean ignoreTags,
            @Param("titleQuery") String titleQuery);
}