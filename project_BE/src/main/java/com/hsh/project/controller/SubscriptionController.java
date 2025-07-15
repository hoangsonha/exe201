package com.hsh.project.controller;

import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.pojo.SubscriptionType;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.UserSubscription;
import com.hsh.project.repository.SubscriptionTypeRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.SubscriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.control.MappingControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Tag(name = "subscriptions", description = "Các hoạt động liên quan đến nâng cấp")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;
    private final SubscriptionTypeRepository subscriptionTypeRepository;

    @GetMapping("/type")
    public ResponseEntity<ObjectResponse> getAllSubscriptionTypeNonPaging() {
        List<SubscriptionType> results = subscriptionService.getAllSubscriptionType();
        return !results.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "get all subscriptions non paging successfully", results))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "get all subscriptions non paging failed", null));
    }

    @GetMapping("/sync")
    public ResponseEntity<ObjectResponse> syncUserWithPlan() {

        List<User> users = userRepository.findAll();

        Optional<SubscriptionType> subscriptionType = subscriptionTypeRepository.findById(1);

        if (subscriptionType != null) {
            for (User user : users) {
                List<UserSubscription> userSubscriptions = new ArrayList<>();
                LocalDateTime localDate = LocalDateTime.now();
                UserSubscription userSubscription = UserSubscription.builder()
                        .user(user)
                        .subscriptionType(subscriptionType.get())
                        .isActive(true)
                        .startDate(localDate)
                        .endDate(null)
                        .build();

                userSubscriptions.add(userSubscription);

                user.setSubscriptions(userSubscriptions);

                userRepository.save(user);
            }
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "sync usser successfully", null));
    }
}
