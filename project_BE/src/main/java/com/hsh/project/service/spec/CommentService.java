package com.hsh.project.service.spec;

import java.util.List;

import com.hsh.project.dto.response.*;

public interface CommentService {
  CommentResponseDTO createComment(Long reviewId, Long commentId, String content, String userEmail);
  List<CommentResponseDTO> getCommentsByReviewId(Long reviewId);
  List<CommentResponseDTO> getCommentsByParentCommentId(Long parentCommentId);
  List<CommentResponseDTO> getCommentsByUserId(Long userId);
  CommentResponseDTO getParentCommentById(Long commentId);
}
