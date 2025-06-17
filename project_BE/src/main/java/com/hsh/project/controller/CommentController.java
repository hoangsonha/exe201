package com.hsh.project.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsh.project.dto.request.CommentRequestDTO;
import com.hsh.project.dto.response.CommentResponseDTO;
import com.hsh.project.service.spec.CommentService;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Tag(name = "Comment", description = "Các hoạt động liên quan đến rating")
public class CommentController {

    private final CommentService commentService;
    private final ObjectMapper objectMapper;

    @PostMapping("/create")
    public ResponseEntity<CommentResponseDTO> createComment(
            @RequestParam(required = false) Long reviewId,
            @RequestParam(required = false) Long commentId,
            @RequestBody CommentRequestDTO requestBody, // Accept raw JSON body as String
            Principal principal) {
        if (principal == null) {
        throw new IllegalStateException("User must be authenticated to create a comment.");
    }

        String content = requestBody.getContent();
        if (content == null || content.trim().isEmpty()) {
            log.warn("Content is null or empty");
            return ResponseEntity.badRequest().body(createErrorResponse("Comment content is required"));
        }

        try {
            CommentResponseDTO response = commentService.createComment(reviewId, commentId, content, principal.getName());
            return ResponseEntity.status(201).body(response); // 201 Created
        } catch (IllegalArgumentException e) {
            log.error("Validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating comment: {}", e.getMessage());
            return ResponseEntity.status(500).body(createErrorResponse("Internal server error"));
        }
    }

    @GetMapping("/by-review")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByReviewId(
            @RequestParam Long reviewId) {
        try {
            log.info("Fetching comments for reviewId: {}", reviewId);
            List<CommentResponseDTO> comments = commentService.getCommentsByReviewId(reviewId);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            log.error("Invalid reviewId: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error fetching comments by reviewId: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/by-parent")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByParentCommentId(
            @RequestParam Long parentCommentId) {
        try {
            log.info("Fetching comments for parentCommentId: {}", parentCommentId);
            List<CommentResponseDTO> comments = commentService.getCommentsByParentCommentId(parentCommentId);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            log.error("Invalid parentCommentId: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error fetching comments by parentCommentId: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByUserId(
            @RequestParam Long userId) {
        try {
            log.info("Fetching comments for userId: {}", userId);
            List<CommentResponseDTO> comments = commentService.getCommentsByUserId(userId);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            log.error("Invalid userId: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error fetching comments by userId: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/parent")
    public ResponseEntity<CommentResponseDTO> getParentCommentById(
            @RequestParam Long commentId) {
        try {
            log.info("Fetching parent comment for commentId: {}", commentId);
            CommentResponseDTO parentComment = commentService.getParentCommentById(commentId);
            if (parentComment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(parentComment);
        } catch (IllegalArgumentException e) {
            log.error("Invalid commentId: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error fetching parent comment: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    private CommentResponseDTO createErrorResponse(String message) {
        CommentResponseDTO response = new CommentResponseDTO();
        response.setCommentID(null);
        response.setContent(message); // Show error message here
        response.setUser(null);
        response.setReplies(null);
        response.setLikes(null);
        response.setTotalLikes(0);
        return response;
    }
}
