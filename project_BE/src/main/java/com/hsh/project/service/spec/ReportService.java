package com.hsh.project.service.spec;

import java.util.List;

import com.hsh.project.dto.response.ReportResponseDTO;
import com.hsh.project.pojo.User;

public interface ReportService {
      ReportResponseDTO createReportForReview(Long reviewId, String content, User currentUser);
      List<ReportResponseDTO> getAllReports();
}
