package com.hsh.project.service.impl;

import com.hsh.project.configuration.VNPayConfig;
import com.hsh.project.dto.request.PaymentRequestDTO;
import com.hsh.project.dto.response.PaymentResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.enums.EnumPaymentStatus;
import com.hsh.project.repository.PaymentRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);
    private static final AtomicInteger TRANSACTION_COUNTER = new AtomicInteger(0);
    private static final int VNP_TXNREF_LENGTH = 37;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    @Autowired
    private VNPayConfig vnpayConfig;

    @Transactional
    public String createPaymentUrl(Integer userId, Double amount, String orderInfo, HttpServletRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Generate a unique vnp_TxnRef with milliseconds and a persistent counter
            String timestamp = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
            int counter = TRANSACTION_COUNTER.getAndIncrement();
            String vnp_TxnRefBase = userId + "_" + timestamp + "_" + counter;

            // Ensure vnp_TxnRef is exactly 37 characters
            String vnp_TxnRef = String.format("%-" + VNP_TXNREF_LENGTH + "s", vnp_TxnRefBase).replace(' ', '0');
            if (vnp_TxnRef.length() > VNP_TXNREF_LENGTH) {
                vnp_TxnRef = vnp_TxnRef.substring(0, VNP_TXNREF_LENGTH);
            }

            // Enhanced duplicate check with detailed logging
            log.debug("Starting duplicate check for vnp_TxnRef: {}", vnp_TxnRef);
            Optional<Payment> existingPayment = paymentRepository.findByTransactionId(vnp_TxnRef);
            log.debug("Duplicate check result for vnp_TxnRef {}: {}", vnp_TxnRef, existingPayment.isPresent());
            if (existingPayment.isPresent()) {
                log.warn("Duplicate vnp_TxnRef detected: {}. Regenerating...", vnp_TxnRef);
                return createPaymentUrl(userId, amount, orderInfo, request); // Recursive call
            }

            // Create and save payment record first
            Payment payment = new Payment();
            payment.setUser(user);
            payment.setAmount(amount);
            payment.setTransactionId(vnp_TxnRef);
            payment.setStatus(EnumPaymentStatus.PENDING);
            Payment savedPayment = paymentRepository.save(payment);
            log.info("Saved payment with transactionId: {} and ID: {}", savedPayment.getTransactionId(), savedPayment.getPaymentId());

            // Verify save success
            Optional<Payment> verifiedPayment = paymentRepository.findByTransactionId(vnp_TxnRef);
            if (!verifiedPayment.isPresent()) {
                throw new RuntimeException("Failed to verify saved payment with transactionId: " + vnp_TxnRef);
            }
            log.info("Verified saved payment with transactionId: {}", vnp_TxnRef);

            String paymentAmount = String.valueOf((long) (amount * 100)); // VNPay uses VND * 100

            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", VNPayConfig.VNP_VERSION);
            vnpParams.put("vnp_Command", VNPayConfig.VNP_COMMAND);
            vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
            vnpParams.put("vnp_Amount", paymentAmount);
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", vnp_TxnRef);
            vnpParams.put("vnp_OrderInfo", orderInfo != null ? orderInfo : "Payment for user " + userId);
            vnpParams.put("vnp_OrderType", VNPayConfig.ORDER_TYPE);
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            vnpParams.put("vnp_IpAddr", vnpayConfig.getIpAddress(request));
            vnpParams.put("vnp_CreateDate", vnpayConfig.getCurrentDateTime());

            String hashData = vnpayConfig.hashAllFields(vnpParams);
            vnpParams.put("vnp_SecureHash", hashData);

            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
                try {
                    query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                         .append("=")
                         .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                         .append("&");
                } catch (Exception e) {
                    log.error("Error encoding query parameter {}: {}", entry.getKey(), e.getMessage(), e);
                    throw new RuntimeException("Failed to encode payment URL parameters", e);
                }
            }
            query.setLength(query.length() - 1); // Remove trailing "&"

            String paymentUrl = VNPayConfig.VNPAY_URL + "?" + query;
            log.info("Generated payment URL for user {} with vnp_TxnRef {}: {}", userId, vnp_TxnRef, paymentUrl);

            return paymentUrl;
        } catch (Exception e) {
            log.error("Error in createPaymentUrl for user {}: {}", userId, e.getMessage(), e);
            throw e; // Re-throw to ensure it propagates to the controller
        }
    }

    @Override
    public PaymentResponseDTO processPaymentCallback(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
            if (entry.getValue() != null && entry.getValue().length > 0) {
                params.put(entry.getKey(), entry.getValue()[0]);
            }
        }

        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_SecureHash = params.get("vnp_SecureHash");

        if (vnp_TxnRef == null || vnp_ResponseCode == null || vnp_SecureHash == null) {
            log.warn("Missing required parameters: vnp_TxnRef={}, vnp_ResponseCode={}, vnp_SecureHash={}", vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash);
            throw new RuntimeException("Missing required payment callback parameters");
        }

        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHash");
        String calculatedHash = vnpayConfig.hashAllFields(fields);

        log.info("Received vnp_SecureHash: {}", vnp_SecureHash);
        log.info("Calculated Hash: {}", calculatedHash);
        log.info("All params for hash: {}", fields);

        if (!calculatedHash.equals(vnp_SecureHash)) {
            log.warn("Secure hash mismatch for transaction reference: {}. Expected: {}, Got: {}", vnp_TxnRef, vnp_SecureHash, calculatedHash);
            throw new RuntimeException("Invalid payment signature");
        }

        Integer userId;
        try {
            userId = Integer.parseInt(vnp_TxnRef.split("_")[0]);
        } catch (Exception e) {
            log.error("Invalid transaction reference format: {}", vnp_TxnRef, e);
            throw new RuntimeException("Invalid transaction reference: " + vnp_TxnRef, e);
        }

        Payment payment = paymentRepository.findByUser_UserIdAndTransactionId(userId.longValue(), vnp_TxnRef)
                .orElseThrow(() -> new ElementNotFoundException("Payment not found with userId: " + userId + " and txnRef: " + vnp_TxnRef));

        if ("00".equals(vnp_ResponseCode)) {
            payment.setStatus(EnumPaymentStatus.SUCCESS); // Changed to PAID to match BookingStatus
            payment.setTransactionId(params.get("vnp_TransactionNo")); // Update with VNPay transaction ID
            paymentRepository.save(payment);
            log.info("Payment successful for user ID: {}, transaction reference: {}", userId, vnp_TxnRef);
        } else {
            payment.setStatus(EnumPaymentStatus.FAILED);
            paymentRepository.save(payment);
            log.warn("Payment failed with code: {} for user ID: {}", vnp_ResponseCode, userId);
            throw new RuntimeException("Payment failed with code: " + vnp_ResponseCode + " for user ID: " + userId);
        }

        return mapToPaymentResponseDTO(payment);
    }

    @Override
    public List<PaymentResponseDTO> getPaymentHistory(Integer userId) {
        log.info("Fetching payment history for userId: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ElementNotFoundException("User not found with ID: " + userId));
        List<Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user);
        return payments.stream().map(this::mapToPaymentResponseDTO).toList();
    }

    private EnumPaymentStatus determinePaymentStatus(String responseCode) {
        return switch (responseCode) {
            case "00" -> EnumPaymentStatus.SUCCESS;
            case "01" -> EnumPaymentStatus.CANCELLED;
            default -> EnumPaymentStatus.FAILED;
        };
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

    private String bytesToHex(byte[] bytes) {
        return bytesToHex(bytes, 0, bytes.length);
    }

    private String bytesToHex(byte[] bytes, int offset, int length) {
        if (bytes == null || offset < 0 || length < 0 || offset + length > bytes.length) {
            return "";
        }
        StringBuilder hexString = new StringBuilder();
        for (int i = offset; i < offset + length && i < bytes.length; i++) {
            String hex = String.format("%02x", bytes[i]);
            hexString.append(hex);
        }
        return hexString.toString();
    }
}