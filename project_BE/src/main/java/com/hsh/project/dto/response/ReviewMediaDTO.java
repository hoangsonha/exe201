package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewMediaDTO {
    Long id;
    String urlImageGIFVideo;
    String typeUploadReview;
    Integer orderDisplay;
}
