package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LikeDTO {
     Long likeID;
     String targetType;  // COMMENT / REVIEW
     Long targetId;
     String type;
     UserSimpleDTO user;
}
