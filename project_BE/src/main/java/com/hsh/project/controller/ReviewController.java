package com.hsh.project.controller;

import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.request.BlockReviewRequest;
import com.hsh.project.dto.request.CreateReviewRequest;
import com.hsh.project.dto.response.BlockReviewResponseDTO;
import com.hsh.project.dto.response.ReviewResponseDTO;
import com.hsh.project.dto.response.UserSimpleDTO;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.service.spec.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Review", description = "Các hoạt động liên quan đến review")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/search")
    public ResponseEntity<ObjectResponse> searchReview(@RequestParam(name = "search", required = false) String search,
                                                       @RequestParam(name = "hashtags", required = false) List<String> hashtags) {
        List<ReviewResponseDTO> user = reviewService.searchReview(search, hashtags);
        return !user.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Search review successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Fail", "Search review failed", null));
    }

    // get all review when user not login in homepage by the most interact of hashtag and have the most using hashtag
    @GetMapping("/top-trending")
    public ResponseEntity<ObjectResponse> getAllReviewGlobal() {
        List<ReviewResponseDTO> user = reviewService.getTopTrendingReviews();
        return !user.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Get top trending successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Fail", "Get top trending failed", null));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReview(@RequestPart("review") CreateReviewRequest request,
                                          @RequestPart(value = "mediaFiles", required = false) List<MultipartFile> mediaFiles) {
            ReviewResponseDTO reviewResponseDTO = reviewService.createReview(request, mediaFiles);
        return reviewResponseDTO != null ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Create review successfully", reviewResponseDTO)) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ObjectResponse("Failed", "Create review failed", null));
    }

    // return reviewID when block successfully
    @PostMapping("/block")
    public ResponseEntity<ObjectResponse> blockReview(@RequestBody BlockReviewRequest request) {
        try {
            BlockReviewResponseDTO result = reviewService.blockReview(request);
            return result != null ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Block review successfully", result)) :
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "Block review successfully", null));
        } catch (BadRequestException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Failed", "Block review failed", null));
        }
    }

    // return reviewID when block successfully
    @PostMapping("/saved")
    public ResponseEntity<ObjectResponse> saveReview(@RequestBody BlockReviewRequest request) {
        try {
            ReviewResponseDTO result = reviewService.saveReview(request);
            return result != null ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Save review successfully", result)) :
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "Save review successfully", null));
        } catch (BadRequestException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Failed", "Save review failed", null));
        }
    }

    // return reviewID when block successfully
    @PostMapping("/unsaved")
    public ResponseEntity<ObjectResponse> unSaveReview(@RequestBody BlockReviewRequest request) {
        try {
            ReviewResponseDTO result = reviewService.unSaveReview(request);
            return result != null ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "UnSave review successfully", result)) :
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "UnSave review successfully", null));
        } catch (BadRequestException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Failed", "UnSave review failed", null));
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{id}/creator")
    public ResponseEntity<ObjectResponse> getReviewCreator(@PathVariable("id") long id) {
        try {
            log.info("Fetching creator for review ID: {}", id);
            UserSimpleDTO creator = reviewService.getReviewCreatorById(id);
            if (creator == null) {
                log.warn("No creator found for review ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ObjectResponse("Fail", "Creator not found for review ID " + id, null));
            }
            log.info("Creator found for review ID {}: user ID {}, username: {}", id, creator.getUserId(), creator.getUserName());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Creator retrieved successfully", creator));
        } catch (ElementNotFoundException e) {
            log.error("Review not found for ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error fetching creator for review ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to retrieve creator", null));
        }
    }

}
