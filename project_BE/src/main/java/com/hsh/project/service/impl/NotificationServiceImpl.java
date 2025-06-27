package com.hsh.project.service.impl;

import com.hsh.project.dto.response.NotificationDTO;
import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.Notification;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumNotificationType;
import com.hsh.project.repository.NotificationRepository;
import com.hsh.project.service.spec.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void sendNotification(User recipient, String message, EnumNotificationType type, Review review, Comment comment) {
        try {
            if (recipient == null || message == null || type == null) {
                log.error("Invalid notification parameters: recipient={}, message={}, type={}", recipient, message, type);
                return;
            }
            Notification notification = Notification.builder()
                    .content(message)
                    .notificationType(type)
                    .isRead(false)
                    .user(recipient)
                    .review(review)
                    .comment(comment)
                    .build();
            notificationRepository.save(notification);
            log.info("Notification saved for user ID {}: {}", recipient.getUserId(), message);
        } catch (Exception e) {
            log.error("Error saving notification: {}", e.getMessage());
        }
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        try {
            List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
            return notifications.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching notifications for userId {}: {}", userId, e.getMessage());
            return List.of();
        }
    }

    @Override
    public List<NotificationDTO> getUnreadNotificationsForUser(Long userId) {
        try {
            List<Notification> notifications = notificationRepository.findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
            return notifications.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching unread notifications for userId {}: {}", userId, e.getMessage());
            return List.of();
        }
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getNotificationID())
                .recipientUsername(notification.getUser() != null ? notification.getUser().getUserName() : null)
                .message(notification.getContent())
                .notificationType(notification.getNotificationType())
                .reviewId(notification.getReview() != null ? notification.getReview().getReviewID() : null)
                .commentId(notification.getComment() != null ? notification.getComment().getCommentID() : null)
                .createdAt(notification.getCreatedAt())
                .isRead(notification.getIsRead())
                .build();
    }
}