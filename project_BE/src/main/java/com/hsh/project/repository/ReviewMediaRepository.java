package com.hsh.project.repository;

import com.hsh.project.pojo.ReviewMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewMediaRepository extends JpaRepository<ReviewMedia, Integer> {

    List<ReviewMedia> findByReview_ReviewID(Long reviewReviewID);
}
