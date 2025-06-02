package com.hsh.project.pojo;

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
public class BlockReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long ratingID;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @ManyToOne
    @JoinColumn(name = "review_id", referencedColumnName = "reviewID")
    Review review;
}
