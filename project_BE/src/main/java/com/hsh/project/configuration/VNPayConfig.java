package com.hsh.project.configuration;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.io.UnsupportedEncodingException;
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

    @Value("${vnpay.return.url:http://103.176.24.249:8081/api/v1/payments/callback}")
    private String returnUrl;

    public static final String VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_VERSION = "2.1.0";
    public static final String VNP_COMMAND = "pay";
    public static final String ORDER_TYPE = "2500000"; // Corrected to match your log amount

    @PostConstruct
    public void init() {
        log.info("VNPay Config initialized with tmnCode: {}, hashSecret: {}, returnUrl: {}", tmnCode, hashSecret, returnUrl);
        if (hashSecret == null || hashSecret.trim().isEmpty()) {
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

    // public String hashAllFields(Map<String, String> fields) {
    //     List<String> fieldNames = new ArrayList<>(fields.keySet());
    //     Collections.sort(fieldNames);
    //     StringBuilder sb = new StringBuilder();
    //     for (String fieldName : fieldNames) {
    //         String fieldValue = fields.get(fieldName);
    //         if (fieldValue != null && !fieldValue.isEmpty() && !fieldName.equals("vnp_SecureHash")) {
    //             sb.append(fieldName).append("=").append(fieldValue).append("&"); // No URL encoding, matches first example
    //         }
    //     }
    //     if (sb.length() > 0) {
    //         sb.setLength(sb.length() - 1); // Remove trailing "&"
    //     }
    //     String hashData = sb.toString();
    //     log.info("Hash data string: {}", hashData);
    //     return hmacSHA512(hashData, hashSecret);
    // }

        public String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty() && !fieldName.equals("vnp_SecureHash")) {
                try {
                    sb.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8)).append("&");
                } catch (Exception e) {
                    log.error("Error encoding field {}: {}", fieldName, e.getMessage());
                    throw new RuntimeException("Failed to encode hash data", e);
                }
            }
        }
        if (sb.length() > 0) {
            sb.setLength(sb.length() - 1); // Remove trailing "&"
        }
        String hashData = sb.toString();
        log.info("Hash data string: {}", hashData);
        return hmacSHA512(hashData, hashSecret);
    }

    public static String createQueryString(Map<String, String> params) throws UnsupportedEncodingException {
        TreeMap<String, String> sortedParams = new TreeMap<>(params);
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                query.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
                query.append("=");
                query.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
                query.append("&");
            }
        }
        return query.length() > 0 ? query.substring(0, query.length() - 1) : ""; // Xóa "&" cuối cùng
    }

    // Removed createQueryString as it's not used in the first example; add back if needed with:
    /*
    public static String createQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : new TreeMap<>(params).entrySet()) {
            String fieldValue = entry.getValue();
            if (fieldValue != null && !fieldValue.isEmpty()) {
                try {
                    query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                         .append("=")
                         .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8))
                         .append("&");
                } catch (Exception e) {
                    log.error("Error encoding query parameter {}: {}", entry.getKey(), e.getMessage(), e);
                    throw new RuntimeException("Failed to encode query string", e);
                }
            }
        }
        return query.length() > 0 ? query.substring(0, query.length() - 1) : "";
    }
    */

    public String hmacSHA512(String data, String key) {
        try {
            Mac hmacSHA512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSHA512.init(secretKey);
            byte[] bytes = hmacSHA512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(bytes);
        } catch (Exception e) {
            log.error("Failed to calculate HMAC SHA512: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to calculate HMAC SHA512", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = String.format("%02x", b);
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
