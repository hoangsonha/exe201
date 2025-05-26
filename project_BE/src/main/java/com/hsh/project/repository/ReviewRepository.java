package com.hsh.project.repository;

import com.hsh.project.pojo.Hashtag;
import com.hsh.project.pojo.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

}
