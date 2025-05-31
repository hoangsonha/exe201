package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponseDTO {
    private Long commentID;
    private String content;
    private UserSimpleDTO user;

    private List<CommentResponseDTO> replies;
    List<LikeDTO> likes;
    int totalLikes;
}
