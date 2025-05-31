package com.hsh.project.repository;

import com.hsh.project.pojo.Hashtag;
import com.hsh.project.pojo.UserHashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserHashtagRepository extends JpaRepository<UserHashtag, Integer> {
    @Query("SELECT uh.hashtag.hashtagID FROM UserHashtag uh WHERE uh.user.userId = :userId")
    List<Long> findHashtagIdsByUserId(@Param("userId") Long userId);
}
