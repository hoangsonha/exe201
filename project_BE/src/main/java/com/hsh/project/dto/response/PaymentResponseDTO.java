package com.hsh.project.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

import com.hsh.project.pojo.enums.EnumPaymentStatus;

@Builder
@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Integer userId;
    private String userName;
    private Double amount;
    private EnumPaymentStatus status;
    private String transactionId;
    private LocalDateTime createdAt;
}