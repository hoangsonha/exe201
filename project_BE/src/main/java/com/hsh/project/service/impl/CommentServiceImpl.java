package com.hsh.project.service.impl;

import com.hsh.project.dto.response.CommentResponseDTO;
import com.hsh.project.dto.response.LikeDTO;
import com.hsh.project.dto.response.UserSimpleDTO;
import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.Like;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.exception.CommentNotFoundException;
import com.hsh.project.exception.ReviewNotFoundException;
import com.hsh.project.exception.UserNotFoundException;
import com.hsh.project.mapper.LikeMapper;
import com.hsh.project.repository.CommentRepository;
import com.hsh.project.repository.LikeRepository;
import com.hsh.project.repository.ReviewRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.CommentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private LikeMapper likeMapper;

    @Override
    public CommentResponseDTO createComment(Long reviewId, Long commentId, String content, String userEmail) {
        log.info("Creating comment - reviewId: {}, commentId: {}, content: {}, userEmail: {}", reviewId, commentId, content, userEmail);
        try {
            validateCommentInput(reviewId, commentId, content, userEmail);
            log.debug("Input validation passed");

            User user = findUserByEmail(userEmail);
            log.debug("User found: {}", user.getUserName());

            Comment comment = buildComment(reviewId, commentId, content, user);
            log.debug("Comment built successfully");

            Comment savedComment = commentRepository.save(comment);
            log.debug("Comment saved with ID: {}", savedComment.getCommentID());

            // Commented out to avoid issues
            // createInitialLikeIfNeeded(savedComment, user);

            CommentResponseDTO response = mapToResponseDTO(savedComment);
            log.debug("Response DTO created with ID: {}", response.getCommentID());
            return response;

        } catch (Exception e) {
            log.error("Error in createComment: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void validateCommentInput(Long reviewId, Long commentId, String content, String userEmail) {
        log.debug("Validating input - reviewId: {}, commentId: {}, content: {}, userEmail: {}", reviewId, commentId, content, userEmail);
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be empty");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        if (content.trim().length() > 1000) {
            throw new IllegalArgumentException("Comment content exceeds maximum length of 1000 characters");
        }
        if ((reviewId != null && commentId != null) || (reviewId == null && commentId == null)) {
            throw new IllegalArgumentException("Provide either reviewId or commentId, but not both or neither");
        }
    }

    private User findUserByEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + userEmail);
        }
        return user;
    }

    private Comment buildComment(Long reviewId, Long commentId, String content, User user) {
        Comment.CommentBuilder commentBuilder = Comment.builder()
                .content(content.trim())
                .user(user);

        if (reviewId != null && reviewId > 0) {
            Review review = reviewRepository.findByReviewID(reviewId)
                    .orElseThrow(() -> new ReviewNotFoundException("Review not found with ID: " + reviewId));
            commentBuilder.review(review).parentComment(null);
        } else if (commentId != null && commentId > 0) {
            Comment parentComment = commentRepository.findByCommentID(commentId)
                    .orElseThrow(() -> new CommentNotFoundException("Parent comment not found with ID: " + commentId));
            commentBuilder.parentComment(parentComment).review(parentComment.getReview());
        }

        return commentBuilder.build();
    }

    private CommentResponseDTO mapToResponseDTO(Comment comment) {
        log.debug("Mapping Comment to Response DTO - Comment ID: {}", comment.getCommentID());
        try {
            if (comment == null) {
                log.error("Comment is null");
                throw new IllegalArgumentException("Comment cannot be null");
            }

            User user = comment.getUser();
            if (user == null) {
                log.error("User is null for comment: {}", comment.getCommentID());
                throw new IllegalStateException("Comment must have an associated user");
            }

            UserSimpleDTO userDTO = UserSimpleDTO.builder()
                    .userId(user.getUserId())
                    .userName(user.getUserName())
                    .build();

            List<Like> commentLikes = likeRepository.findByTargetTypeAndTargetId(
                    EnumTargetType.COMMENT, comment.getCommentID());
            int totalLikes = commentLikes != null ? commentLikes.size() : 0;
            List<LikeDTO> likeDTOs = commentLikes != null && likeMapper != null ?
                    likeMapper.toLikeDTOs(commentLikes) : new ArrayList<>();

            return CommentResponseDTO.builder()
                    .commentID(comment.getCommentID())
                    .content(comment.getContent())
                    .user(userDTO)
                    .likes(likeDTOs)
                    .totalLikes(totalLikes)
                    .replies(new ArrayList<>()) // Empty to avoid issues
                    .build();

        } catch (Exception e) {
            log.error("Error in mapToResponseDTO: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<CommentResponseDTO> getCommentsByReviewId(Long reviewId) {
        log.info("Fetching comments for reviewId: {}", reviewId);
        try {
            if (reviewId == null) {
                throw new IllegalArgumentException("Review ID cannot be null");
            }
            List<Comment> comments = commentRepository.findByReviewReviewID(reviewId);
            if (comments == null || comments.isEmpty()) {
                log.warn("No comments found for reviewId: {}", reviewId);
                return new ArrayList<>();
            }
            log.debug("Found {} comments", comments.size());
            return comments.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching comments by reviewId: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<CommentResponseDTO> getCommentsByParentCommentId(Long parentCommentId) {
        log.info("Fetching comments for parentCommentId: {}", parentCommentId);
        try {
            if (parentCommentId == null) {
                throw new IllegalArgumentException("Parent Comment ID cannot be null");
            }
            List<Comment> comments = commentRepository.findByParentComment_CommentID(parentCommentId);
            if (comments == null || comments.isEmpty()) {
                log.warn("No comments found for parentCommentId: {}", parentCommentId);
                return new ArrayList<>();
            }
            log.debug("Found {} comments", comments.size());
            return comments.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching comments by parentCommentId: {}", e.getMessage(), e);
            throw e;
        }
    }
}
