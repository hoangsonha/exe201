package com.hsh.project.service.impl;

import com.hsh.project.dto.response.ReportResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.mapper.ReportMapper;
import com.hsh.project.pojo.Report;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumReportType; // Import for report status
import com.hsh.project.repository.*;
import com.hsh.project.service.spec.ReportService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReviewRepository reviewRepository;
    private final ReportMapper reportMapper; // Inject the mapper

    @Override
    @Transactional
    public ReportResponseDTO createReportForReview(Long reviewId, String content, User currentUser) {
        if (reviewId == null || reviewId <= 0) {
            log.error("Invalid reviewId: {}", reviewId);
            throw new IllegalArgumentException("Review ID must be a positive number");
        }
        if (content == null || content.trim().isEmpty()) {
            log.error("Report content cannot be empty");
            throw new IllegalArgumentException("Report content is required");
        }

        Review review = reviewRepository.findById(Math.toIntExact(reviewId))
                .orElseThrow(() -> new ElementNotFoundException("Review not found with ID: " + reviewId));

        if (currentUser == null || currentUser.getUserId() == null) {
            log.error("Invalid or null user");
            throw new IllegalArgumentException("Valid user is required");
        }

        Report report = Report.builder()
                .content(content)
                .status(EnumReportType.PENDING)
                .review(review)
                .user(currentUser)
                .build();

        report = reportRepository.save(report);
        log.info("User {} reported review {} with content: {}", currentUser.getUserId(), reviewId, content);

        return reportMapper.toDTO(report);
    }

    @Override
    @Transactional
    public List<ReportResponseDTO> getAllReports() {
        List<Report> reports = reportRepository.findAllByDeletedIsFalse();
        return reportMapper.toDTOs(reports);
    }
}