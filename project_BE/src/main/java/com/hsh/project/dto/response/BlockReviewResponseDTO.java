package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlockReviewResponseDTO {
    Long reviewId;
    boolean isBlocked;
}
