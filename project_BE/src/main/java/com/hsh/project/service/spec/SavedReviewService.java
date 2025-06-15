package com.hsh.project.service.spec;

import com.hsh.project.dto.response.FavReviewResponseDTO;
import com.hsh.project.pojo.Review;
import java.util.List;

public interface SavedReviewService {
    String toggleFavorite(Integer userId, Long reviewId);
    List<FavReviewResponseDTO> getAllFavoritedReviews(Integer userId, boolean isToggleContext);
}