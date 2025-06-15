package com.hsh.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class FavReviewResponseDTO {
        private String title;
        private String content;
        private String perspective;
    }
