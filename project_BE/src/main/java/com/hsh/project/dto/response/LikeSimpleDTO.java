package com.hsh.project.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeSimpleDTO {
    Long likeId;
    Long userId;
}