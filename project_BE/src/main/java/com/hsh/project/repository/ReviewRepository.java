package com.hsh.project.repository;

import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.enums.EnumReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT DISTINCT rh.review FROM ReviewHashtag rh WHERE rh.hashtag.hashtagID IN :hashtagIds ORDER BY FUNCTION('RAND')")
    List<Review> findDistinctReviewsByHashtagIds(@Param("hashtagIds") List<Long> hashtagIds);
    Optional<Review> findByReviewID(Long reviewid);
    List<Review> findByUserUserId(Long userId);
    @Query("SELECT DISTINCT r FROM Review r " +
            "JOIN r.reviewHashtags rh " +
            "JOIN rh.hashtag h " +
            "WHERE r.status = 'PUBLISHED' " +
            "AND (:search IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND h.tag IN :hashtags")
    List<Review> findByTitleContainingAndHashtags(@Param("search") String search, @Param("hashtags") List<String> hashtags);

    @Query("SELECT DISTINCT r FROM Review r " +
            "JOIN r.reviewHashtags rh " +
            "JOIN rh.hashtag h " +
            "WHERE r.status = 'PUBLISHED' " +
            "AND h.tag IN :hashtags")
    List<Review> findByHashtagsIn(@Param("hashtags") List<String> hashtags);

    List<Review> findByTitleContainingIgnoreCaseAndStatus(String title, EnumReviewStatus status);
}
