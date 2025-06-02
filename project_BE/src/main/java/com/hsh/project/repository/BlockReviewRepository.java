package com.hsh.project.repository;

import com.hsh.project.pojo.BlockReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockReviewRepository extends JpaRepository<BlockReview, Integer> {
    boolean existsByUser_UserIdAndReview_ReviewID(Long userId, Long reviewId);
}
