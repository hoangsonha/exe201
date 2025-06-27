package com.hsh.project.dto.response;

import com.hsh.project.pojo.enums.EnumNotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String recipientUsername;
    private String message;
    private EnumNotificationType notificationType;
    private Long reviewId;
    private Long commentId;
    private LocalDateTime createdAt;
    private Boolean isRead;
}