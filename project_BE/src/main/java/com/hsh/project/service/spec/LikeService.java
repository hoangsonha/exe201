package com.hsh.project.service.spec;

import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.dto.response.LikeResponseDTO;

public interface LikeService {
    String toggleLike(Long userId, EnumTargetType targetType, Long targetId, EnumLikeType type);
    long countLikes(EnumTargetType targetType, Long targetId);
    LikeResponseDTO createLike(Long userId, EnumTargetType targetType, Long targetId, EnumLikeType type);
}