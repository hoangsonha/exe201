package com.hsh.project.service.spec;

import com.hsh.project.dto.response.NotificationDTO;
import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumNotificationType;

import java.util.List;

public interface NotificationService {
    void sendNotification(User recipient, String message, EnumNotificationType type, Review review, Comment comment);
    List<NotificationDTO> getNotificationsForUser(Long userId);
    List<NotificationDTO> getUnreadNotificationsForUser(Long userId);
}