package com.hsh.project.repository;

import com.hsh.project.pojo.Advertise;
import com.hsh.project.pojo.CheckReviewAI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvertiseRepository extends JpaRepository<Advertise, Integer> {

}
