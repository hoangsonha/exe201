package com.hsh.project.controller;

import com.hsh.project.configuration.VNPayConfig;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.request.PaymentRequestDTO;
import com.hsh.project.dto.response.PaymentResponseDTO;
import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumPaymentStatus;
import com.hsh.project.repository.PaymentRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.PaymentService;

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

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Autowired
    private VNPayConfig vnpayConfig;


    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @PostMapping("/initiate")
    public ResponseEntity<ObjectResponse> initiatePayment(
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

            Map<String, String> params = new TreeMap<>(); // Use TreeMap for sorted parameters
            params.put("vnp_Version", VNPayConfig.VNP_VERSION);
            params.put("vnp_Command", VNPayConfig.VNP_COMMAND);
            params.put("vnp_TmnCode", vnpayConfig.getTmnCode());
            params.put("vnp_Amount", String.valueOf((long) (amount * 100))); // Correct amount (VND * 100)
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_TxnRef", userId + "_" + vnpayConfig.getCurrentDateTime());
            params.put("vnp_OrderInfo", orderInfo != null ? orderInfo : "Payment for user " + userId);
            params.put("vnp_OrderType", VNPayConfig.ORDER_TYPE);
            params.put("vnp_Locale", "vn");
            params.put("vnp_CreateDate", vnpayConfig.getCurrentDateTime());
            params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            params.put("vnp_IpAddr", vnpayConfig.getIpAddress(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest()));

            log.info("VNPay Parameters: {}", params);
            String hashData = vnpayConfig.hashAllFields(params);
            params.put("vnp_SecureHash", hashData);
            log.info("Generated vnp_SecureHash: {}", hashData);

            String querytekijString = VNPayConfig.createQueryString(params);
            String paymentUrl = VNPayConfig.VNPAY_URL + "?" + querytekijString;
            log.info("Generated Payment URL: {}", paymentUrl);

            user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            Payment payment = new Payment();
            payment.setUser(user);
            payment.setAmount(amount);
            payment.setStatus(EnumPaymentStatus.PENDING);
            payment.setTransactionId(params.get("vnp_TxnRef"));
            paymentRepository.save(payment);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Payment initiated", paymentUrl));
        } catch (Exception e) {
            log.error("Error initiating payment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to initiate payment", null));
        }
    }

    @GetMapping("/callback")
    public ResponseEntity<ObjectResponse> processPaymentCallback(
            @RequestParam String vnp_Amount,
            @RequestParam String vnp_BankCode,
            @RequestParam String vnp_BankTranNo,
            @RequestParam String vnp_CardType,
            @RequestParam String vnp_OrderInfo,
            @RequestParam String vnp_PayDate,
            @RequestParam String vnp_ResponseCode,
            @RequestParam String vnp_TransactionNo,
            @RequestParam String vnp_TxnRef,
            @RequestParam String vnp_SecureHash // Add this parameter
    ) {
        try {
            PaymentResponseDTO payment = paymentService.processPaymentCallback(
                    "28Y7O1J5", vnp_Amount, vnp_BankCode, vnp_BankTranNo, vnp_CardType,
                    vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TransactionNo, vnp_TxnRef, vnp_SecureHash.trim() // Pass the received hash
            );
            if (payment == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ObjectResponse("Fail", "Invalid payment callback", null));
            }
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Payment processed", payment));
        } catch (Exception e) {
            log.error("Error processing payment callback: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ObjectResponse("Fail", "Failed to process payment", null));
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