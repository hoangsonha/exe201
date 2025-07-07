package com.hsh.project.service.impl;

import com.hsh.project.configuration.VNPayConfig;
import com.hsh.project.dto.request.PaymentRequestDTO;
import com.hsh.project.dto.response.PaymentResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.enums.*;
import com.hsh.project.pojo.User;
import com.hsh.project.repository.PaymentRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final UserRepository userRepository;
    @Autowired
    private VNPayConfig vnpayConfig;

    @Autowired
    private PaymentRepository paymentRepository;


    @Override
    public String initiatePayment(Integer userId, Double amount, String orderInfo, String returnUrl, HttpServletRequest request) {
        try {
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
            params.put("vnp_ReturnUrl", returnUrl != null ? returnUrl : vnpayConfig.getReturnUrl());
            params.put("vnp_IpAddr", vnpayConfig.getIpAddress(request));

            log.info("VNPay Parameters: {}", params);
            String hashData = vnpayConfig.hashAllFields(params);
            params.put("vnp_SecureHash", hashData);
            log.info("Generated vnp_SecureHash: {}", hashData);

            String queryString = VNPayConfig.createQueryString(params);
            String paymentUrl = VNPayConfig.VNPAY_URL + "?" + queryString;
            log.info("Generated Payment URL: {}", paymentUrl);

            return paymentUrl;
        } catch (Exception e) {
            log.error("Error generating payment URL: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initiate VNPay payment", e);
        }
    }
    
    @Override
    public PaymentResponseDTO processPaymentCallback(String vnp_TmnCode, String vnp_Amount, String vnp_BankCode,
                                                    String vnp_BankTranNo, String vnp_CardType, String vnp_OrderInfo,
                                                    String vnp_PayDate, String vnp_ResponseCode, String vnp_TransactionNo,
                                                    String vnp_TxnRef, String vnp_SecureHash) {
        log.info("Processing payment callback for transaction reference: {}", vnp_TxnRef);

        // Verify secure hash
        Map<String, String> params = new HashMap<>();
        params.put("vnp_TmnCode", vnp_TmnCode);
        params.put("vnp_Amount", vnp_Amount);
        params.put("vnp_BankCode", vnp_BankCode);
        params.put("vnp_BankTranNo", vnp_BankTranNo);
        params.put("vnp_CardType", vnp_CardType);
        params.put("vnp_OrderInfo", vnp_OrderInfo);
        params.put("vnp_PayDate", vnp_PayDate);
        params.put("vnp_ResponseCode", vnp_ResponseCode);
        params.put("vnp_TransactionNo", vnp_TransactionNo);
        params.put("vnp_TxnRef", vnp_TxnRef);

        StringBuilder data = new StringBuilder();
        TreeMap<String, String> sortedParams = new TreeMap<>(params);
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            data.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        String signData = data.toString();
        if (signData.endsWith("&")) {
            signData = signData.substring(0, signData.length() - 1);
        }
        String calculatedHash = hmacSHA512(vnpayConfig.getHashSecret(), signData);

        if (!calculatedHash.equals(vnp_SecureHash)) {
            log.warn("Secure hash mismatch for transaction reference: {}", vnp_TxnRef);
            return null;
        }

        long paymentId;
        try {
            paymentId = Long.parseLong(vnp_TxnRef);
        } catch (NumberFormatException e) {
            log.error("Invalid transaction reference: {}", vnp_TxnRef, e);
            return null;
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ElementNotFoundException("Payment not found with ID: " + paymentId));
        
        EnumPaymentStatus status = determinePaymentStatus(vnp_ResponseCode);
        payment.setStatus(status);
        payment.setTransactionId(vnp_TransactionNo);
        paymentRepository.save(payment);

        return mapToPaymentResponseDTO(payment);
    }

    private EnumPaymentStatus determinePaymentStatus(String responseCode) {
        return switch (responseCode) {
            case "00" -> EnumPaymentStatus.SUCCESS;
            case "01" -> EnumPaymentStatus.CANCELLED;
            default -> EnumPaymentStatus.FAILED;
        };
    }

    @Override
    public List<PaymentResponseDTO> getPaymentHistory(Integer userId) {
        log.info("Fetching payment history for userId: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ElementNotFoundException("User not found with ID: " + userId));
        List<Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user);
        return payments.stream().map(this::mapToPaymentResponseDTO).toList();
    }

    private PaymentResponseDTO mapToPaymentResponseDTO(Payment payment) {
        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .userId(payment.getUser().getUserId().intValue())
                .userName(payment.getUser().getUserName())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC-SHA512", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    
}