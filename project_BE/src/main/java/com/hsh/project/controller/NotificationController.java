package com.hsh.project.controller;

import com.hsh.project.dto.response.NotificationDTO;
import com.hsh.project.pojo.Notification;
import com.hsh.project.pojo.User;
import com.hsh.project.repository.NotificationRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/my-notifications")
    public ResponseEntity<List<NotificationDTO>> getMyNotifications(Principal principal) {
        try {
            if (principal == null) {
                log.warn("User not authenticated");
                return ResponseEntity.status(401).build();
            }
            User user = userRepository.findByEmail(principal.getName());
            if (user == null) {
                log.error("User not found with email: {}", principal.getName());
                return ResponseEntity.status(404).build();
            }
            log.info("Fetching notifications for user: {}", user.getUserName());
            List<NotificationDTO> notifications = notificationService.getNotificationsForUser(user.getUserId());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching notifications for user with email {}: {}", principal.getName(), e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/my-unread-notifications")
    public ResponseEntity<List<NotificationDTO>> getMyUnreadNotifications(Principal principal) {
        try {
            if (principal == null) {
                log.warn("User not authenticated");
                return ResponseEntity.status(401).build();
            }
            User user = userRepository.findByEmail(principal.getName());
            if (user == null) {
                log.error("User not found with email: {}", principal.getName());
                return ResponseEntity.status(404).build();
            }
            log.info("Fetching unread notifications for user: {}", user.getUserName());
            List<NotificationDTO> notifications = notificationService.getUnreadNotificationsForUser(user.getUserId());
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching unread notifications for user with email {}: {}", principal.getName(), e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id, Principal principal) {
        try {
            if (principal == null) {
                log.warn("User not authenticated");
                return ResponseEntity.status(401).build();
            }
            User user = userRepository.findByEmail(principal.getName());
            if (user == null) {
                log.error("User not found with email: {}", principal.getName());
                return ResponseEntity.status(404).build();
            }
            
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + id));
            
            if (!notification.getUser().getUserId().equals(user.getUserId())) {
                log.warn("User {} attempted to mark notification {} owned by another user", user.getUserId(), id);
                return ResponseEntity.status(403).build();
            }

            notification.setIsRead(true);
            notificationRepository.save(notification);
            log.info("Notification {} marked as read for user: {}", id, user.getUserName());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Error marking notification as read: {}", e.getMessage());
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}