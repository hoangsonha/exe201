package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumReviewStatus;
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
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long reviewID;

    String title;

    @Column(columnDefinition = "TEXT")
    String content;

    String urlImageGIFVideo;

    String perspective;

    Integer viewCount;

    @Enumerated(EnumType.STRING)
    EnumReviewStatus status;

    Float relevantStar;

    Float objectiveStar;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @OneToMany(mappedBy = "review")
    List<Notification> notifications;

    @OneToMany(mappedBy = "review")
    List<Comment> comments;

    @OneToMany(mappedBy = "review")
    List<HistoryPoint> historyPoints;

    @OneToMany(mappedBy = "review")
    List<SavedReview> savedReviews;

    @OneToMany(mappedBy = "review")
    List<Report> reports;

    @OneToMany(mappedBy = "review")
    List<ReviewHashtag> reviewHashtags;

    @OneToMany(mappedBy = "review")
    List<Rating> ratings;

    @OneToOne(mappedBy = "review")
    CheckReviewAI checkReviewAI;

}
