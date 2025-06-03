package com.hsh.project.controller;

import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.service.spec.LikeService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;

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
    @PostMapping("/toggle")
    public ResponseEntity<String> toggleLike(
            @RequestParam Long userId,
            @RequestParam EnumTargetType targetType,
            @RequestParam Long targetId,
            @RequestParam EnumLikeType type) {

        String result = likeService.toggleLike(userId, targetType, targetId, type);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<Long> countLikes(
            @RequestParam String targetType,
            @RequestParam Long targetId) {

        EnumTargetType targetTypeEnum = EnumTargetType.valueOf(targetType.toUpperCase());

        long count = likeService.countLikes(targetTypeEnum, targetId);
        return ResponseEntity.ok(count);
    }
}