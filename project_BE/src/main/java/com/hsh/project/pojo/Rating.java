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
public class Rating extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long ratingID;

    Double stars;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @ManyToOne
    @JoinColumn(name = "review_id", referencedColumnName = "reviewID")
    Review review;

}
