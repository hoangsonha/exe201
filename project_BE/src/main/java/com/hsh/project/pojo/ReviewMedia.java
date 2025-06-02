package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumReviewUploadType;
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
public class ReviewMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "review_id")
    Review review;

    String urlImageGIFVideo;

    @Enumerated(EnumType.STRING)
    EnumReviewUploadType typeUploadReview;

    Integer orderDisplay; // Tuỳ chọn, để sort theo thứ tự hiển thị
}
