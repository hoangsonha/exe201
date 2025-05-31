package com.hsh.project.service.spec;

import com.hsh.project.pojo.Like;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.repository.LikeRepository;
import com.hsh.project.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    public String toggleLike(Long userId, EnumTargetType targetType, Long targetId, EnumLikeType type) {
        Optional<Like> existing = likeRepository.findByUserUserIdAndTargetTypeAndTargetId(userId, targetType, targetId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return "unliked";
        } else {
            User user = userRepository.findByUserIdAndDeletedIsFalse(userId)
                    .orElseThrow(() -> new RuntimeException("User not found or deleted"));

            Like like = Like.builder()
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .type(type)
                    .build();

            likeRepository.save(like);
            return "liked";
        }
    }

    public long countLikes(EnumTargetType targetType, Long targetId) {
        return likeRepository.countByTargetTypeAndTargetId(targetType, targetId);
    }
}