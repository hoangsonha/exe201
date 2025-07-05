package com.hsh.project.controller;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.service.spec.HashtagService;
import com.hsh.project.service.spec.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/hashtags")
@RequiredArgsConstructor
@Tag(name = "Hashtag", description = "Các hoạt động liên quan đến chủ đề")
public class HashtagController {

    private final HashtagService hashtagService;

    @Value("${application.default-current-page}")
    private int defaultCurrentPage;

    @Value("${application.default-page-size}")
    private int defaultPageSize;

    @GetMapping("/non-paging")
    public ResponseEntity<ObjectResponse> getAllHashtagsNonPaging() {
        List<HashTagResponseDTO> results = hashtagService.getHashtags();
        return !results.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "get all user non paging successfully", results))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "get all user non paging failed", results));
    }

}
