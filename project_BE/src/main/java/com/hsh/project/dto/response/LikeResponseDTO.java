package com.hsh.project.dto.response;

import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LikeResponseDTO {
    private String status;
    private Long userId;
    private EnumTargetType targetType;
    private Long targetId;
    private EnumLikeType likeType;
    private long totalLikes;
}