package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumGenderType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "User")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long userId;

    @Column(nullable = false)
    String userName;

    @Column(nullable = false)
    String password;

    @Enumerated(EnumType.STRING)
    EnumGenderType gender; // Enum (Male, Female, Other)

    @Column(unique = true, nullable = false)
    String email;

    @Column(unique = true)
    String phone;

    @Column
    String rating;

    @Column(columnDefinition = "nvarchar(1000)")
    String avatar;

    @Builder.Default
    boolean enabled = true;

    @Builder.Default
    boolean nonLocked = true;

    @Column(length = 2048)
    String accessToken;

    @Column(length = 2048)
    String refreshToken;

    @Column
    Integer point;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role; // Enum (ADMIN, USER, PREMIUM, ...)

    @Column(length = 6)
    String codeVerify;

    // Relationships

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<UserSubscription> subscriptions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Payment> payments;

    @OneToMany(mappedBy = "user")
    List<Review> reviews;

    @OneToMany(mappedBy = "user")
    List<Comment> comments;

    @OneToMany(mappedBy = "user")
    List<Notification> notifications;

    @OneToMany(mappedBy = "user")
    List<HistoryPoint> historyPoints;

    @OneToMany(mappedBy = "user")
    List<UserLegalAcceptance> userLegalAcceptances;

    @OneToMany(mappedBy = "user")
    List<Like> likes;

    @OneToMany(mappedBy = "user")
    List<SavedReview> savedReviews;

    @OneToMany(mappedBy = "user")
    List<Report> reports;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<UserHashtag> userHashtags = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    List<Rating> ratings;

    @OneToMany(mappedBy = "user")
    List<BlockReview> blockReviews;

}
