package com.hsh.project.service.spec;


import com.hsh.project.dto.response.RatingResponseDTO;


public interface RatingService {
    String toggleRating(Integer userId, Long reviewId, Double stars); // Toggle or update rating
    Double calculateAverageRating(Long reviewId); // Calculate average rating for a review
    RatingResponseDTO createRating(Integer userId, Long reviewId, Double stars); // Create or update a rating
}