package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumAICheckType;
import com.hsh.project.pojo.enums.EnumAISentimentType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckReviewAI extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @OneToOne
    @JoinColumn(name = "review_id", referencedColumnName = "reviewID")
    Review review;

    @Enumerated(EnumType.STRING)
    EnumAISentimentType sentiment; // POSITIVE, NEGATIVE, NEUTRAL

    @Enumerated(EnumType.STRING)
    EnumAICheckType type; // AI or STAFF

    Integer relevance;

    Integer objectivity;

    LocalDateTime checkedAt;

    Double point;

    String brefContent;
}
