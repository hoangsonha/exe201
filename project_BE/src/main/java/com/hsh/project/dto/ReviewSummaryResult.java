package com.hsh.project.dto;

import lombok.Data;

@Data
public class ReviewSummaryResult {
    private String perspective;
    private float relevantStar;
    private float objectiveStar;
    private String summary;
}
