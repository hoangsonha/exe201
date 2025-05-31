package com.hsh.project.repository;

import com.hsh.project.pojo.CheckReviewAI;
import com.hsh.project.pojo.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

}
