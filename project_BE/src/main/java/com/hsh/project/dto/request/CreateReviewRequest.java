package com.hsh.project.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {
    private String title;
    private String content;
    private List<String> hashtags;
    private Integer userId;
}
