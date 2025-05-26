package com.hsh.project.repository;

import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.SavedReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedReviewRepository extends JpaRepository<SavedReview, Integer> {

}
