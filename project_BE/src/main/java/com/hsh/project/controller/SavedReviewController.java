package com.hsh.project.controller;

import com.hsh.project.dto.response.FavReviewResponseDTO;
import com.hsh.project.pojo.Review;
import com.hsh.project.service.spec.SavedReviewService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/saved-reviews")
@RequiredArgsConstructor
@Tag(name = "Saved Review", description = "Các hoạt động liên quan đến lưu trữ review")
public class SavedReviewController {

    private final SavedReviewService savedReviewService;

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/toggle-favorite")
    public ResponseEntity<String> toggleFavorite(
            @RequestParam @Parameter(description = "ID of the user") Integer userId,
            @RequestParam @Parameter(description = "ID of the review") Long reviewId) {

        String result = savedReviewService.toggleFavorite(userId, reviewId);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/favorited-reviews/{userId}")
    public List<FavReviewResponseDTO> handleToggleAndGetFavorites(@PathVariable Integer userId, @RequestParam(required = false) Long reviewId) {
        // If reviewId is provided, assume it's a toggle context for that specific review
        if (reviewId != null && reviewId > 0) {
            toggleFavorite(userId, reviewId); // Perform toggle if reviewId is specified
        }
        return savedReviewService.getAllFavoritedReviews(userId, true); // Fetch all updated favorited reviews
    }
}
