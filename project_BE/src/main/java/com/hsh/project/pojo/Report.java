package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumReportType;
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
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long reportID;

    @Column(columnDefinition = "TEXT")
    String content;

    @Enumerated(EnumType.STRING)
    EnumReportType status;

    @ManyToOne
    @JoinColumn(name = "comment_id", referencedColumnName = "commentID")
    Comment comment;

    @ManyToOne
    @JoinColumn(name = "review_id", referencedColumnName = "reviewID")
    Review review;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;
}
