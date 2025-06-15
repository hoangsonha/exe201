package com.hsh.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;

public class CommentCreateDTO {
    @Positive(message = "Review ID must be a positive number")
    private Long reviewId;

    @Positive(message = "Comment ID must be a positive number")
    private Long commentId;

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 1000, message = "Comment content exceeds maximum length of 1000 characters")
    private String content;

    // Getters and setters
    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}