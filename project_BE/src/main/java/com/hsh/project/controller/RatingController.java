package com.hsh.project.controller;

import com.hsh.project.dto.response.RatingResponseDTO;
import com.hsh.project.service.spec.RatingService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.hsh.project.security.CustomAccountDetail;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/ratings")
@RequiredArgsConstructor
@Tag(name = "Rating", description = "Các hoạt động liên quan đến rating")
public class RatingController {

    private final RatingService ratingService;

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/toggle")
    public ResponseEntity<String> toggleRating(
            @RequestParam @Parameter(description = "ID of the review") Long reviewId,
            @RequestParam @Parameter(description = "Rating value (1.0 to 5.0)") Double stars) {

        Integer userId = getCurrentUserId().intValue();
        String result = ratingService.toggleRating(userId, reviewId, stars);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/average")
    public ResponseEntity<Double> calculateAverageRating(
            @RequestParam @Parameter(description = "ID of the review") Long reviewId) {

        Double average = ratingService.calculateAverageRating(reviewId);
        return ResponseEntity.ok(average);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<RatingResponseDTO> createRating(
            @RequestParam @Parameter(description = "ID of the user rating the review") Integer userId,
            @RequestParam @Parameter(description = "ID of the review") Long reviewId,
            @RequestParam @Parameter(description = "Rating value (1.0 to 5.0)") Double stars) {

        RatingResponseDTO response = ratingService.createRating(userId, reviewId, stars);
        return ResponseEntity.ok(response);
    }

        private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomAccountDetail userDetails = (CustomAccountDetail) authentication.getPrincipal();
        return userDetails.getId(); // returns Long
    }
}
