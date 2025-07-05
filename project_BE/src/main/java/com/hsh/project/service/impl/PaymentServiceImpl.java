package com.hsh.project.service.impl;

import com.hsh.project.dto.response.PaymentResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.enums.*;
import com.hsh.project.pojo.User;
import com.hsh.project.repository.PaymentRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    // VNPay sandbox credentials (replace with your actual sandbox credentials)
    private static final String VNPAY_HOST = "https://sandbox.vnpayment.vn";
    private static final String VNPAY_TMN_CODE = "YOUR_TMN_CODE"; // Obtain from VNPay sandbox
    private static final String VNPAY_HASH_SECRET = "YOUR_HASH_SECRET"; // Obtain from VNPay sandbox
    private static final String VNPAY_RETURN_URL = "http://localhost:8080/api/v1/payments/callback"; // Adjust as needed

    @Override
    public String initiatePayment(Integer userId, Double amount, String orderInfo, String returnUrl) {
        log.info("Initiating payment for userId: {}, amount: {}, orderInfo: {}", userId, amount, orderInfo);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ElementNotFoundException("User not found with ID: " + userId));

        // Create payment record with PENDING status
        Payment payment = Payment.builder()
                .user(user)
                .amount(amount)
                .status(EnumPaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);

        // VNPay payment parameters
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", VNPAY_TMN_CODE);
        vnpParams.put("vnp_Amount", String.valueOf((long) (amount * 100))); // Amount in VND (multiply by 100)
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", payment.getPaymentId().toString());
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl != null ? returnUrl : VNPAY_RETURN_URL);
        vnpParams.put("vnp_IpAddr", "127.0.0.1"); // Should be the client's IP in production

        // Sort and create secure hash
        StringBuilder data = new StringBuilder();
        TreeMap<String, String> sortedParams = new TreeMap<>(vnpParams);
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            data.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        String signData = data.toString();
        if (signData.endsWith("&")) {
            signData = signData.substring(0, signData.length() - 1);
        }
        String secureHash = hmacSHA512(VNPAY_HASH_SECRET, signData);
        vnpParams.put("vnp_SecureHash", secureHash);

        // Build payment URL
        StringBuilder paymentUrl = new StringBuilder(VNPAY_HOST + "/paymentv2/vpcpay.html?");
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            paymentUrl.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        String url = paymentUrl.toString();
        if (url.endsWith("&")) {
            url = url.substring(0, url.length() - 1);
        }

        log.info("Payment URL generated: {}", url);
        return url;
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
        String calculatedHash = hmacSHA512(VNPAY_HASH_SECRET, signData);

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