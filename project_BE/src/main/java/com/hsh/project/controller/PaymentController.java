package com.hsh.project.controller;

import com.hsh.project.configuration.VNPayConfig;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.response.PaymentResponseDTO;
import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumPaymentStatus;
import com.hsh.project.repository.PaymentRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.PaymentService;
import io.jsonwebtoken.security.InvalidKeyException;
import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentService paymentService;

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/initiate")
    public ResponseEntity<ObjectResponse> createPayment(
            @RequestParam Integer userId,
            @RequestParam Double amount,
            @RequestParam String orderInfo,
            Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ObjectResponse("Fail", "User not authenticated", null));
            }
            User user = userRepository.findByEmail(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ObjectResponse("Fail", "User not found", null));
            }

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            String paymentUrl = paymentService.createPaymentUrl(userId, amount, orderInfo, attributes.getRequest());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Payment initiated", paymentUrl));
        } catch (Exception e) {
            log.error("Error initiating payment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to initiate payment", null));
        }
    }

    @PermitAll
    @GetMapping(value = "/callback")
    public ResponseEntity<ObjectResponse> paymentCallback(HttpServletRequest request) {
        try {
            PaymentResponseDTO payment = paymentService.processPaymentCallback(request);
            if (payment == null) {
                log.warn("PaymentService returned null for callback. Check hash or transaction reference.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ObjectResponse("Fail", "Invalid payment callback", null));
            }
            log.info("Payment processed successfully for transaction reference: {}", request.getParameter("vnp_TxnRef"));
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Payment processed", payment));
        } catch (InvalidKeyException e) {
            log.error("Invalid key error processing payment callback: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Invalid configuration for payment processing", null));
        } catch (Exception e) {
            log.error("Error processing payment callback: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to process payment", null));
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/success")
    public ResponseEntity<ObjectResponse> paymentSuccess(@RequestParam Integer userId, @RequestParam String vnp_TxnRef) {
        try {
            Payment payment = paymentRepository.findByUser_UserIdAndTransactionId(userId.longValue(), vnp_TxnRef)
                    .orElseThrow(() -> new RuntimeException("Payment not found with userId: " + userId + " and txnRef: " + vnp_TxnRef));
            if (payment.getStatus() != EnumPaymentStatus.SUCCESS) {
                throw new RuntimeException("Payment not successful for userId: " + userId);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userId", payment.getUser().getUserId().intValue());
            response.put("amount", payment.getAmount());
            response.put("transactionId", payment.getTransactionId());
            response.put("createdAt", payment.getCreatedAt().toString());
            response.put("userName", payment.getUser().getUserName());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Payment details retrieved", response));
        } catch (Exception e) {
            log.error("Error fetching payment success details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to retrieve payment details", null));
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/history")
    public ResponseEntity<ObjectResponse> getPaymentHistory(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ObjectResponse("Fail", "User not authenticated", null));
            }
            User user = userRepository.findByEmail(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ObjectResponse("Fail", "User not found", null));
            }
            List<PaymentResponseDTO> history = paymentService.getPaymentHistory(user.getUserId().intValue());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Payment history retrieved", history));
        } catch (Exception e) {
            log.error("Error fetching payment history: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to retrieve payment history", null));
        }
    }
}