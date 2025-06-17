package com.hsh.project.dto.internal;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewInput {
    private String title;
    private String content;
    private List<String> imageUrls;
    private String videoUrl;
}
