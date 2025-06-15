package com.hsh.project.controller;

import com.hsh.project.dto.request.ReportRequestDTO;
import com.hsh.project.dto.response.ReportResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.exception.UserNotFoundException;
import com.hsh.project.pojo.User;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository; 

    @PostMapping("/reviews/{reviewId}")
    @PreAuthorize("hasRole('USER') or hasRole('PREMIUM')")
    public ResponseEntity<ReportResponseDTO> createReportForReview(
            @PathVariable Long reviewId,
            @RequestBody ReportRequestDTO request,
            Principal principal) {
        if (request == null || request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User currentUser = userRepository.findByEmail(principal.getName());
        if (currentUser == null) {
            throw new UserNotFoundException("User not found with email: " + principal.getName());
        }
        ReportResponseDTO response = reportService.createReportForReview(reviewId, request.getContent(), currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<ReportResponseDTO>> getAllReports() {
        List<ReportResponseDTO> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }
}