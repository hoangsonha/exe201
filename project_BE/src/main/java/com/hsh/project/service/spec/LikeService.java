package com.hsh.project.service.spec;

import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.dto.response.LikeResponseDTO;

public interface LikeService {
    String toggleLike(Integer userId, EnumTargetType targetType, Long targetId);
    long countLikes(EnumTargetType targetType, Long targetId);
    LikeResponseDTO createLike(Integer userId, EnumTargetType targetType, Long targetId, EnumLikeType type);
    String switchLikeHeart(Integer userId, EnumTargetType targetType, Long targetId);
    String toggleHeart(Integer userId, EnumTargetType targetType, Long targetId);
}