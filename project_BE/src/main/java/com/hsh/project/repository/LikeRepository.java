package com.hsh.project.repository;

import com.hsh.project.pojo.Like;
import com.hsh.project.pojo.enums.EnumTargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    List<Like> findByTargetTypeAndTargetId(EnumTargetType targetType, Long targetId);
    Optional<Like> findByUserUserIdAndTargetTypeAndTargetId(Integer userId, EnumTargetType targetType, Long targetId);
    @Query("SELECT COUNT(l) FROM Like l WHERE l.targetType = :targetType AND l.targetId = :targetId")
    long countByTargetTypeAndTargetId(EnumTargetType targetType, Long targetId);
}
