package com.hsh.project.service.spec;

import com.hsh.project.dto.request.BlockReviewRequest;
import com.hsh.project.dto.request.CreateReviewRequest;
import com.hsh.project.dto.response.BlockReviewResponseDTO;
import com.hsh.project.dto.response.ReviewResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewService {
    ReviewResponseDTO getReviewById(Long reviewId);

    List<ReviewResponseDTO> getTopTrendingReviews();

    List<ReviewResponseDTO> searchReview(String search, List<String> hashtags);

    ReviewResponseDTO createReview(CreateReviewRequest request, List<MultipartFile> mediaFiles);

    List<ReviewResponseDTO> getReviewsByUserHashtags(Long userId);

    BlockReviewResponseDTO blockReview(BlockReviewRequest request);

    ReviewResponseDTO saveReview(BlockReviewRequest request);

    ReviewResponseDTO unSaveReview(BlockReviewRequest request);

    List<ReviewResponseDTO> getReviewSavedByUserId(Long userId);

    List<ReviewResponseDTO> getMyReview(Long userId);

}
