package com.hsh.project.controller;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.request.CheckSubscription;
import com.hsh.project.dto.request.SubscriptionSMS;
import com.hsh.project.dto.response.StatisticResponseDTO;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.pojo.SubscriptionType;
import com.hsh.project.service.spec.SubscriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Tag(name = "subscriptions", description = "Các hoạt động liên quan đến nâng cấp")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping("/type")
    public ResponseEntity<ObjectResponse> getAllSubscriptionTypeNonPaging() {
        List<SubscriptionType> results = subscriptionService.getAllSubscriptionType();
        return !results.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "get all subscriptions non paging successfully", results))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "get all subscriptions non paging failed", null));
    }

    @GetMapping("/statistic")
    public ResponseEntity<ObjectResponse> getAllStatistic() {
        StatisticResponseDTO results = subscriptionService.getStatistic();
        return results != null
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "get all statistic successfully", results))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "get all statistic failed", null));
    }

    @PostMapping("/pay")
    public ResponseEntity<String> receiveSmsWebhook(@RequestBody SubscriptionSMS request) {
        UserDTO userDTO = subscriptionService.subscribe(request);
        return ResponseEntity.ok("Webhook received");
    }

    @PostMapping("/check-pay")
    public ResponseEntity<ObjectResponse> checkPay(@RequestBody CheckSubscription request) {
        try {
            UserDTO userDTO = subscriptionService.checkSubscribe(request);
            return userDTO != null ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Check pay successfully", userDTO))
                    : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Check pay failed", null));
        } catch (BadRequestException e) {
            log.error("Error check pay", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error check pay", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Check pay failed", null));
        }
    }



}
