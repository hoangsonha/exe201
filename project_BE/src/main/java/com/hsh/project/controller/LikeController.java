package com.hsh.project.controller;

import com.hsh.project.dto.response.LikeResponseDTO;
import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.service.spec.LikeService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.hsh.project.security.CustomAccountDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/likes")
@RequiredArgsConstructor
@Tag(name = "Like", description = "Các hoạt động liên quan đến like")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/togglelike")
    public ResponseEntity<String> toggleLike(
            @RequestParam @Parameter(description = "Type of target (REVIEW or COMMENT)") EnumTargetType targetType,
            @RequestParam @Parameter(description = "ID of the target entity") Long targetId) {

        Integer userId = getCurrentUserId().intValue();
        String result = likeService.toggleLike(userId, targetType, targetId);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<Long> countLikes(
            @RequestParam @Parameter(description = "Type of target (REVIEW or COMMENT)") String targetType,
            @RequestParam @Parameter(description = "ID of the target entity") Long targetId) {

        EnumTargetType targetTypeEnum = EnumTargetType.valueOf(targetType.toUpperCase());
        long count = likeService.countLikes(targetTypeEnum, targetId);
        return ResponseEntity.ok(count);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/create-like")
    public ResponseEntity<LikeResponseDTO> createLike(
            @RequestParam @Parameter(description = "ID of the user liking the target") Integer userId,
            @RequestParam @Parameter(description = "Type of target (REVIEW or COMMENT)") EnumTargetType targetType,
            @RequestParam @Parameter(description = "ID of the target entity") Long targetId,
            @RequestParam @Parameter(description = "Type of like (LIKE)") EnumLikeType type) {

        LikeResponseDTO response = likeService.createLike(userId, targetType, targetId, type);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/switch")
    public ResponseEntity<String> switchLikeHeart(
          @RequestParam @Parameter(description = "ID of the user") Integer userId,
          @RequestParam @Parameter(description = "Type of target (REVIEW or COMMENT)") EnumTargetType targetType,
          @RequestParam @Parameter(description = "ID of the target entity") Long targetId) {

        String result = likeService.switchLikeHeart(userId, targetType, targetId);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/toggle-heart")
    public ResponseEntity<String> toggleHeart(
            @RequestParam @Parameter(description = "Type of target (REVIEW or COMMENT)") EnumTargetType targetType,
            @RequestParam @Parameter(description = "ID of the target entity") Long targetId) {

        Integer userId = getCurrentUserId().intValue();
        String result = likeService.toggleHeart(userId, targetType, targetId);
        return ResponseEntity.ok(result);
    }

    private Long getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    CustomAccountDetail userDetails = (CustomAccountDetail) authentication.getPrincipal();
    return userDetails.getId(); // returns Long
}
}

