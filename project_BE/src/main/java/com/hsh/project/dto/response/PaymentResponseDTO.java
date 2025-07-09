package com.hsh.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.hsh.project.pojo.enums.EnumPaymentStatus;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Long paymentId;
    private Integer userId;
    private String userName;
    private Double amount;
    private EnumPaymentStatus status;
    private String transactionId;
    private LocalDateTime createdAt;

    
}