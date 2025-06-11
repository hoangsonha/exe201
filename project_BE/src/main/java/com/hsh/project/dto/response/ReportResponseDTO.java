package com.hsh.project.dto.response;

import com.google.auto.value.AutoValue.Builder;
import com.hsh.project.pojo.Report;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportResponseDTO {
    private Long reportID;
    private String content;
    private String status;
    private Long reviewId;
    private Long userId;

}