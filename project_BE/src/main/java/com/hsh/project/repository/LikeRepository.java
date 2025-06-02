package com.hsh.project.repository;

import com.hsh.project.pojo.Like;
import com.hsh.project.pojo.enums.EnumTargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    List<Like> findByTargetTypeAndTargetId(EnumTargetType targetType, Long targetId);
}
