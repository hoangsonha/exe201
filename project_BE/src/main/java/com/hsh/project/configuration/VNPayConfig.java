package com.hsh.project.configuration;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
@Slf4j
public class VNPayConfig {
    @Value("${vnpay.tmn.code:28Y7O1J5}")
    private String tmnCode;

    @Value("${vnpay.hash.secret:85LBO963AVD9X30N4LKD3SGWA53GZZNE}")
    private String hashSecret;

    @Value("${vnpay.return.url:http://localhost:8081/api/v1/payments/callback}")
    private String returnUrl;

    public static final String VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_VERSION = "2.1.0";
    public static final String VNP_COMMAND = "pay";
    public static final String ORDER_TYPE = "250000"; // Updated to a likely valid value (verify with VNPay)

    @PostConstruct
    public void init() {
        log.info("VNPay Config initialized with tmnCode: {}, hashSecret: {}, returnUrl: {}", tmnCode, hashSecret, returnUrl);
        if (hashSecret == null || hashSecret.isEmpty()) {
            throw new IllegalStateException("VNPay hash secret is not properly injected");
        }
    }

    public String getTmnCode() {
        return tmnCode;
    }

    public String getHashSecret() {
        return hashSecret;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        log.info("Client IP Address: {}", ipAddress);
        return ipAddress;
    }

    public String getCurrentDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        return sdf.format(new Date());
    }

    public String hashAllFields(Map<String, String> fields) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : new TreeMap<>(fields).entrySet()) {
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();
            if (fieldValue != null && !fieldValue.isEmpty() && !fieldName.equals("vnp_SecureHash")) {
                sb.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8)).append("&");
            }
        }
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1); // Remove trailing "&"
        }
        log.info("Hash data string: {}", sb);
        return hmacSHA512(sb.toString(), hashSecret);
    }

    public static String createQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : new TreeMap<>(params).entrySet()) {
            String fieldValue = entry.getValue();
            if (fieldValue != null && !fieldValue.isEmpty()) {
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                     .append("=")
                     .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8))
                     .append("&");
            }
        }
        String result = query.length() > 0 ? query.substring(0, query.length() - 1) : "";
        log.info("Query String: {}", result);
        return result;
    }

    public static String hmacSHA512(String data, String key) {
        try {
            Mac hmacSHA512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSHA512.init(secretKey);
            byte[] bytes = hmacSHA512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA512", e);
        }
    }
}