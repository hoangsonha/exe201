package com.hsh.project.repository;

import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByReview_ReviewID(Long reviewId);
    Optional<Rating> findByUserUserIdAndReviewReviewID(Integer userId, Long reviewId);
    List<Rating> findByReviewReviewID(Long reviewId);
}
