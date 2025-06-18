package com.hsh.project.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hsh.project.pojo.enums.EnumReviewStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long reviewID;

    String title;

    @Column(columnDefinition = "TEXT")
    String content;

    String perspective;

    Integer viewCount;

    @Enumerated(EnumType.STRING)
    EnumReviewStatus status;

    Float relevantStar;

    Float objectiveStar;

    String summary;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @OneToMany(mappedBy = "review")
    List<Notification> notifications;

    @OneToMany(mappedBy = "review")
    List<Comment> comments;

    @OneToMany(mappedBy = "review")
    List<HistoryPoint> historyPoints;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    List<ReviewMedia> reviewMedias;

    @OneToMany(mappedBy = "review")
    List<SavedReview> savedReviews;

    @OneToMany(mappedBy = "review")
    List<Report> reports;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    List<ReviewHashtag> reviewHashtags;

    @OneToMany(mappedBy = "review")
    List<Rating> ratings;

    @OneToMany(mappedBy = "review")
    List<BlockReview> blockReviews;

    @OneToOne(mappedBy = "review")
    CheckReviewAI checkReviewAI;

    @OneToMany
    @JoinColumn(name = "targetId", referencedColumnName = "reviewID", insertable = false, updatable = false)
    @Where(clause = "target_type = 'REVIEW'")
    List<Like> likes;

}
