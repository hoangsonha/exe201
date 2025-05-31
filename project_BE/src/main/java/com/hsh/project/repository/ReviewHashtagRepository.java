package com.hsh.project.repository;

import com.hsh.project.pojo.ReviewHashtag;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ReviewHashtagRepository extends JpaRepository<ReviewHashtag, Integer> {
    @Query("SELECT rh.hashtag.hashtagID FROM ReviewHashtag rh GROUP BY rh.hashtag.hashtagID ORDER BY COUNT(rh.review) DESC")
    List<Long> findTopHashtagIdsByReviewCount(Pageable pageable);

    @Query(value = "SELECT rh.hashtag_id FROM review_hashtag rh GROUP BY rh.hashtag_id ORDER BY COUNT(rh.review_id) DESC LIMIT 5", nativeQuery = true)
    List<Long> findTopHashtagIdsByReviewCountNative();

}
