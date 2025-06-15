package com.hsh.project.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCommentDTO {
    Long userId;
    String username;
}