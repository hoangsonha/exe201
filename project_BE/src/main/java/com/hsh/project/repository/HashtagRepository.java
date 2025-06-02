package com.hsh.project.repository;

import com.hsh.project.pojo.Hashtag;
import com.hsh.project.pojo.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, Integer> {
    Hashtag findByTag(String name);
}
