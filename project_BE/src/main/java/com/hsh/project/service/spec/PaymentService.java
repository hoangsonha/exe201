package com.hsh.project.service.spec;

import com.hsh.project.dto.request.PaymentRequestDTO;
import com.hsh.project.dto.response.PaymentResponseDTO;

import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface PaymentService {
    String initiatePayment(Integer userId, Double amount, String orderInfo, String returnUrl, HttpServletRequest request);
    PaymentResponseDTO processPaymentCallback(String vnp_TmnCode, String vnp_Amount, String vnp_BankCode, 
                                            String vnp_BankTranNo, String vnp_CardType, String vnp_OrderInfo, 
                                            String vnp_PayDate, String vnp_ResponseCode, String vnp_TransactionNo, 
                                            String vnp_TxnRef, String vnp_SecureHash);
    List<PaymentResponseDTO> getPaymentHistory(Integer userId);
}