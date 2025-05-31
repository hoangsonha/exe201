package com.hsh.project.repository;

import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.SavedReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedReviewRepository extends JpaRepository<SavedReview, Integer> {
    boolean existsByUser_UserIdAndReview_ReviewIDAndStatusTrue(Long userId, Long reviewId);

    List<SavedReview> findByUserUserIdAndStatusTrue(Long userId);

    boolean existsByUser_UserIdAndReview_ReviewID(Long userUserId, Long reviewReviewID);

    SavedReview findByUser_UserIdAndReview_ReviewID(Long userUserId, Long reviewReviewID);
}
