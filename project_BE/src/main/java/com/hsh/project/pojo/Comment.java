package com.hsh.project.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long commentID;

    @Column(columnDefinition = "TEXT")
    String content;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @ManyToOne
    @JoinColumn(name = "review_id", referencedColumnName = "reviewID")
    Review review;

    @ManyToOne
    @JoinColumn(name = "parent_comment_id", referencedColumnName = "commentID")
    Comment parentComment;

    @OneToMany(mappedBy = "comment")
    List<Notification> notifications;

    @OneToMany(mappedBy = "comment")
    List<Report> reports;

}
