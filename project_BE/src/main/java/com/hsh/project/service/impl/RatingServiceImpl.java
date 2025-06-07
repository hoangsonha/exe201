package com.hsh.project.service.impl;

import com.hsh.project.dto.response.RatingResponseDTO;
import com.hsh.project.pojo.Rating;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.User;
import com.hsh.project.repository.CommentRepository;
import com.hsh.project.repository.RatingRepository;
import com.hsh.project.repository.ReviewRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.RatingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private static final Logger logger = LoggerFactory.getLogger(RatingServiceImpl.class);

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public String toggleRating(Integer userId, Long reviewId, Double stars) {
        // Validate stars
        validateStars(stars);

        Optional<Rating> existing = ratingRepository.findByUserUserIdAndReviewReviewID(userId, reviewId);

        if (existing.isPresent()) {
            // Update existing rating
            Rating rating = existing.get();
            rating.setStars(stars);
            ratingRepository.save(rating);
            return "updated";
        } else {
            // Create new rating
            User user = userRepository.findByUserIdAndDeletedIsFalse(userId)
                    .orElseThrow(() -> new RuntimeException("User not found or deleted"));

            Review review = reviewRepository.findByReviewID(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));

            Rating rating = Rating.builder()
                    .user(user)
                    .review(review)
                    .stars(stars)
                    .build();

            ratingRepository.save(rating);
            return "rated";
        }
    }

    @Override
    public Double calculateAverageRating(Long reviewId) {
        if (reviewId == null || reviewId <= 0) {
            logger.error("Invalid reviewId: {}", reviewId);
            throw new IllegalArgumentException("Review ID must be a positive number");
        }

        List<Rating> ratings = ratingRepository.findByReviewReviewID(reviewId);
        if (ratings.isEmpty()) {
            return 0.0; // No ratings yet
        }

        double sum = ratings.stream()
                .mapToDouble(Rating::getStars)
                .sum();
        double average = sum / ratings.size();

        // Round to 2 decimal places
        return Math.round(average * 100.0) / 100.0;
    }

    @Override
    @Transactional
    public RatingResponseDTO createRating(Integer userId, Long reviewId, Double stars) {
        // Validate inputs
        if (userId == null || userId <= 0) {
            logger.error("Invalid userId: {}", userId);
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        if (reviewId == null || reviewId <= 0) {
            logger.error("Invalid reviewId: {} for userId: {}", reviewId, userId);
            throw new IllegalArgumentException("Review ID must be a positive number");
        }
        validateStars(stars);

        // Validate review existence
        Review review = reviewRepository.findByReviewID(reviewId)
                .orElseThrow(() -> {
                    logger.error("Review not found for reviewId: {}", reviewId);
                    return new RuntimeException("Review not found");
                });

        // Check for existing rating
        Optional<Rating> existing = ratingRepository.findByUserUserIdAndReviewReviewID(userId, reviewId);
        if (existing.isPresent()) {
            // Update existing rating
            Rating rating = existing.get();
            rating.setStars(stars);
            ratingRepository.save(rating);
            logger.info("User {} updated rating for review {} to {}", userId, reviewId, stars);
            return new RatingResponseDTO("updated", userId, reviewId, stars, calculateAverageRating(reviewId));
        }

        // Validate user
        User user = userRepository.findByUserIdAndDeletedIsFalse(userId)
                .orElseThrow(() -> {
                    logger.error("User not found or deleted for userId: {}", userId);
                    return new RuntimeException("User not found or deleted");
                });

        // Create and save rating
        Rating rating = Rating.builder()
                .user(user)
                .review(review)
                .stars(stars)
                .build();

        ratingRepository.save(rating);
        logger.info("User {} rated review {} with {} stars", userId, reviewId, stars);

        return new RatingResponseDTO("rated", userId, reviewId, stars, calculateAverageRating(reviewId));
    }

    private void validateStars(Double stars) {
        if (stars == null) {
            logger.error("Stars value is null");
            throw new IllegalArgumentException("Stars value cannot be null");
        }
        if (stars < 1.0 || stars > 5.0) {
            logger.error("Invalid stars value: {}. Must be between 1.0 and 5.0", stars);
            throw new IllegalArgumentException("Stars value must be between 1.0 and 5.0");
        }
    }
}