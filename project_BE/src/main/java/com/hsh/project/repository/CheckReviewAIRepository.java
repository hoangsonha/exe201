package com.hsh.project.repository;

import com.hsh.project.pojo.CheckReviewAI;
import com.hsh.project.pojo.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckReviewAIRepository extends JpaRepository<CheckReviewAI, Integer> {

}
