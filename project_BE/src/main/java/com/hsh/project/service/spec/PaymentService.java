package com.hsh.project.service.spec;

import com.hsh.project.dto.request.PaymentRequestDTO;
import com.hsh.project.dto.response.PaymentResponseDTO;

import io.jsonwebtoken.security.InvalidKeyException;
import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface PaymentService {
    public String createPaymentUrl(Integer userId, Double amount, String orderInfo, HttpServletRequest request);
    List<PaymentResponseDTO> getPaymentHistory(Integer userId);
    public PaymentResponseDTO processPaymentCallback(HttpServletRequest request);
}