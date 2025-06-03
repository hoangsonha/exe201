package com.hsh.project.service.impl;

import com.hsh.project.dto.response.LikeResponseDTO;
import com.hsh.project.pojo.Like;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.repository.CommentRepository;
import com.hsh.project.repository.LikeRepository;
import com.hsh.project.repository.ReviewRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.LikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService {

    private static final Logger logger = LoggerFactory.getLogger(LikeServiceImpl.class);

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public LikeServiceImpl(LikeRepository likeRepository, UserRepository userRepository,
                           ReviewRepository reviewRepository, CommentRepository commentRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
    }


    @Override
    public String toggleLike(Long userId, EnumTargetType targetType, Long targetId, EnumLikeType type) {
        Optional<Like> existing = likeRepository.findByUserUserIdAndTargetTypeAndTargetId(userId, targetType, targetId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return "unliked";
        } else {
            User user = userRepository.findByUserIdAndDeletedIsFalse(userId)
                    .orElseThrow(() -> new RuntimeException("User not found or deleted"));

            Like like = Like.builder()
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .type(type)
                    .build();

            likeRepository.save(like);
            return "liked";
        }
    }

     @Override
    public long countLikes(EnumTargetType targetType, Long targetId) {
        return likeRepository.findByTargetTypeAndTargetId(targetType, targetId).size();
    }

     @Override
    @Transactional
    public LikeResponseDTO createLike(Long userId, EnumTargetType targetType, Long targetId, EnumLikeType type) {
        // Validate inputs
        if (userId == null || userId <= 0) {
            logger.error("Invalid userId: {}", userId);
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        if (targetType == null) {
            logger.error("Target type is null for userId: {}", userId);
            throw new IllegalArgumentException("Target type cannot be null");
        }
        if (targetId == null || targetId <= 0) {
            logger.error("Invalid targetId: {} for userId: {}", targetId, userId);
            throw new IllegalArgumentException("Target ID must be a positive number");
        }
        if (type == null) {
            logger.error("Like type is null for userId: {} and targetId: {}", userId, targetId);
            throw new IllegalArgumentException("Like type cannot be null");
        }

        // Validate target existence
        if (targetType == EnumTargetType.REVIEW) {
            reviewRepository.findByReviewID(targetId)
                    .orElseThrow(() -> {
                        logger.error("Review not found for targetId: {}", targetId);
                        return new RuntimeException("Review not found");
                    });
        } else if (targetType == EnumTargetType.COMMENT) {
            commentRepository.findByCommentID(targetId)
                    .orElseThrow(() -> {
                        logger.error("Comment not found for targetId: {}", targetId);
                        return new RuntimeException("Comment not found");
                    });
        } else {
            logger.error("Unsupported target type: {} for userId: {}", targetType, userId);
            throw new IllegalArgumentException("Unsupported target type: " + targetType);
        }

        // Check for existing like
        Optional<Like> existing = likeRepository.findByUserUserIdAndTargetTypeAndTargetId(userId, targetType, targetId);
        if (existing.isPresent()) {
            // Unlike: Remove the existing like
            likeRepository.delete(existing.get());
            logger.info("User {} unliked {} with ID {}", userId, targetType, targetId);
            return new LikeResponseDTO("unliked", userId, targetType, targetId, type,
                                   likeRepository.countByTargetTypeAndTargetId(targetType, targetId));
        }

        // Validate user
        User user = userRepository.findByUserIdAndDeletedIsFalse(userId)
                .orElseThrow(() -> {
                    logger.error("User not found or deleted for userId: {}", userId);
                    return new RuntimeException("User not found or deleted");
                });

        // Create and save like
        Like like = Like.builder()
                .user(user)
                .targetType(targetType)
                .targetId(targetId)
                .type(type)
                .build();

        likeRepository.save(like);
        logger.info("User {} liked {} with ID {}", userId, targetType, targetId);

        return new LikeResponseDTO("liked", userId, targetType, targetId, type,
                               likeRepository.countByTargetTypeAndTargetId(targetType, targetId));
    }

}
