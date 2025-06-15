package com.hsh.project.service.impl;

import com.hsh.project.dto.response.FavReviewResponseDTO;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.SavedReview;
import com.hsh.project.pojo.User;
import com.hsh.project.repository.ReviewRepository;
import com.hsh.project.repository.SavedReviewRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.SavedReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedReviewServiceImpl implements SavedReviewService {

    private static final Logger logger = LoggerFactory.getLogger(SavedReviewServiceImpl.class);

    private final SavedReviewRepository savedReviewRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional
    public String toggleFavorite(Integer userId, Long reviewId) {
        if (userId == null || userId <= 0) {
            logger.error("Invalid userId: {}", userId);
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        if (reviewId == null || reviewId <= 0) {
            logger.error("Invalid reviewId: {} for userId: {}", reviewId, userId);
            throw new IllegalArgumentException("Review ID must be a positive number");
        }

        // Validate user and review existence
        User user = userRepository.findByUserIdAndDeletedIsFalse(userId)
                .orElseThrow(() -> {
                    logger.error("User not found or deleted for userId: {}", userId);
                    return new RuntimeException("User not found or deleted");
                });

        reviewRepository.findByReviewID(reviewId)
                .orElseThrow(() -> {
                    logger.error("Review not found for reviewId: {}", reviewId);
                    return new RuntimeException("Review not found");
                });

        // Check for existing saved review
        Optional<SavedReview> existing = savedReviewRepository.findByUserUserIdAndReviewReviewID(userId, reviewId);

        if (existing.isPresent()) {
            SavedReview savedReview = existing.get();
            savedReview.setStatus(!savedReview.getStatus()); // Toggle status
            savedReviewRepository.save(savedReview);
            logger.info("User {} toggled favorite status for review {} to {}", userId, reviewId, savedReview.getStatus());
            return savedReview.getStatus() ? "favorited" : "unfavorited";
        } else {
            SavedReview savedReview = SavedReview.builder()
                    .user(user)
                    .review(Review.builder().reviewID(reviewId).build()) // Partial Review object with just reviewID
                    .status(true) // Default to favorited on creation
                    .build();
            savedReviewRepository.save(savedReview);
            logger.info("User {} favorited review {}", userId, reviewId);
            return "favorited";
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavReviewResponseDTO> getAllFavoritedReviews(Integer userId, boolean isToggleContext) {
        if (userId == null || userId <= 0) {
            logger.error("Invalid userId: {}", userId);
            throw new IllegalArgumentException("User ID must be a positive number");
        }

        // Only proceed if called from toggleFavorite context
        if (!isToggleContext) {
            return List.of(); // Return empty list if not in toggle context
        }

        userRepository.findByUserIdAndDeletedIsFalse(userId)
                .orElseThrow(() -> {
                    logger.error("User not found or deleted for userId: {}", userId);
                    return new RuntimeException("User not found or deleted");
                });

        // Fetch all SavedReview entries for the user where status is true (favorited)
        List<SavedReview> favoritedReviews = savedReviewRepository.findByUserUserIdAndStatus(userId, true);
        if (favoritedReviews.isEmpty()) {
            return List.of(); // Return empty list instead of null
        }

        // Map SavedReview to FavReviewResponseDTO using the associated Review
        return favoritedReviews.stream()
                .map(savedReview -> {
                    Review review = savedReview.getReview();
                    return FavReviewResponseDTO.builder()
                            .title(review.getTitle())
                            .content(review.getContent())
                            .perspective(review.getPerspective())
                            .build();
                })
                .collect(Collectors.toList());
    }
}