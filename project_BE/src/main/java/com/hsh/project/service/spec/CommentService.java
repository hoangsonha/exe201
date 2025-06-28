package com.hsh.project.service.spec;

import java.util.List;

import com.hsh.project.dto.response.*;
import com.hsh.project.pojo.User;

public interface CommentService {
  CommentResponseDTO createComment(Long reviewId, Long commentId, String content, String userEmail);
  List<CommentResponseDTO> getCommentsByReviewId(Long reviewId);
  List<CommentResponseDTO> getCommentsByParentCommentId(Long parentCommentId);
  List<CommentResponseDTO> getCommentsByUserId(Long userId);
  CommentResponseDTO updateComment(Long commentId, String content, String userEmail);
  CommentResponseDTO deleteComment(Long commentId, String userEmail);
  CommentResponseDTO getParentCommentById(Long commentId);
  String getReviewOwnerUsername(Long reviewId);
  void sendCommentNotification(Long reviewId, Long commentId, String commenterUsername, CommentResponseDTO newComment, User commenter);
}
