package com.hsh.project.repository;

import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.Hashtag;
import com.hsh.project.pojo.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByReview_ReviewID(Long reviewId);
    Optional<Comment> findByCommentID(Long commentId);
    List<Comment> findByParentCommentCommentID(Long parentCommentId);
    List<Comment> findByParentCommentIsNull();
    List<Comment> findByReviewReviewID(Long reviewID);
    List<Comment> findByParentComment_CommentID(Long parentCommentId);
    List<Comment> findByUserUserId(Long userId);
}
