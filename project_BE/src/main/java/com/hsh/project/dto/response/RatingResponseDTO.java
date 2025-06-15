package com.hsh.project.dto.response;

import lombok.Data;

@Data
public class RatingResponseDTO {
    private String status; // "rated" or "updated"
    private Integer userId;
    private Long reviewId;
    private Double stars;
    private Double averageRating;

    public RatingResponseDTO(String status, Integer userId, Long reviewId, Double stars, Double averageRating) {
        this.status = status;
        this.userId = userId;
        this.reviewId = reviewId;
        this.stars = stars;
        this.averageRating = averageRating;
    }
}