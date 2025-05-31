package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumNotificationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long notificationID;

    @Column(columnDefinition = "TEXT")
    String content;

    @Enumerated(EnumType.STRING)
    EnumNotificationType notificationType;

    Boolean isRead;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @ManyToOne
    @JoinColumn(name = "review_id", referencedColumnName = "reviewID")
    Review review;

    @ManyToOne
    @JoinColumn(name = "comment_id", referencedColumnName = "commentID")
    Comment comment;

    @ManyToOne
    @JoinColumn(name = "like_id", referencedColumnName = "likeID")
    Like like;

}
