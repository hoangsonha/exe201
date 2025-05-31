package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponseDTO {
     Long reviewID;
     String title;
     String content;
     String perspective;
     Integer viewCount;
     String status;
     Float relevantStar;
     Float objectiveStar;

     List<CommentResponseDTO> comments;   // lồng nhau
     List<RatingDTO> ratings;            // danh sách đánh giá
     List<LikeDTO> likes;
     List<ReviewMediaDTO> reviewMedias;

     Boolean isSaved;
//     Boolean isBlocked;

}
