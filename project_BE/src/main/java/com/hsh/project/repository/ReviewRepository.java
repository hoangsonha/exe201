package com.hsh.project.repository;

import com.hsh.project.pojo.Review;
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

}
