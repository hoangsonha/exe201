package com.hsh.project.repository;

import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserOrderByCreatedAtDesc(User user);

    Optional<Payment> findByUser_UserIdAndTransactionId(Long userId, String transactionId);

    Optional<Payment> findByTransactionId(String transactionId);
}