package com.hsh.project.service.impl;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.request.CheckSubscription;
import com.hsh.project.dto.request.SubscriptionSMS;
import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.mapper.HashtagMapper;
import com.hsh.project.mapper.UserMapper;
import com.hsh.project.pojo.Payment;
import com.hsh.project.pojo.SubscriptionType;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.UserSubscription;
import com.hsh.project.pojo.enums.EnumPaymentStatus;
import com.hsh.project.repository.HashtagRepository;
import com.hsh.project.repository.SubscriptionTypeRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionTypeRepository subscriptionTypeRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<SubscriptionType> getAllSubscriptionType() {
        return subscriptionTypeRepository.findAll().stream().filter(v -> !v.isDeleted()).collect(Collectors.toList());
    }

    @Override
    public UserDTO subscribe(SubscriptionSMS subscriptionSMS) {

//        String key = "Agribank: 21h14p 16/07 TK 5404205492644: +25,000VND UID5 PKGID2 UNtoi6723. SD: 175,060VND.";
//
//        String time = "2025-07-16T14:14:27.864045Z";

        String key = subscriptionSMS.getKey();

        String time = subscriptionSMS.getTime();

        if (key == null && time == null) {
            throw new BadRequestException("Error pay due to missing key and time");
        }

        Pattern pattern = Pattern.compile("\\+(\\d{1,3}(?:,\\d{3})*)VND.*?UID(\\d+)\\s+PKGID(\\d+)\\s+UN(\\w+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(key);

        if (matcher.find()) {
            String rawAmount = matcher.group(1);  // "25,000"
            int amount = Integer.parseInt(rawAmount.replace(",", "")); // 25000
            Integer uid = Integer.parseInt(matcher.group(2));               // 5
            Integer pkgId = Integer.parseInt(matcher.group(3));             // 2
            String username = matcher.group(4);                        // "toi6723"

            Optional<User> user = userRepository.findById(uid);

            if (!user.isPresent()) {
                throw new BadRequestException("User not found");
            }

            List<UserSubscription> userSubscriptions = user.get().getSubscriptions();

            Optional<SubscriptionType> subscriptionType = subscriptionTypeRepository.findById(pkgId);

            if (!subscriptionType.isPresent()) {
                throw new BadRequestException("Subscription type not found");
            }

            LocalDateTime now = LocalDateTime.now();

            if (!userSubscriptions.isEmpty()) {
                for (UserSubscription userSubscription : userSubscriptions) {
                    userSubscription.setEndDate(now);
                    userSubscription.setIsActive(false);
                    userSubscription.setDeleted(true);
                }
            }

            UserSubscription userSubscription = UserSubscription.builder()
                    .user(user.get())
                    .subscriptionType(subscriptionType.get())
                    .startDate(now)
                    .endDate(now.plusDays(subscriptionType.get().getDuration()))
                    .isActive(true)
                    .build();

            userSubscriptions.add(userSubscription);

            user.get().setSubscriptions(userSubscriptions);

            List<Payment> payments = user.get().getPayments();

            Payment payment = Payment.builder()
                    .amount((double) amount)
                    .createdAt(now)
                    .status(EnumPaymentStatus.SUCCESS)
                    .user(user.get())
                    .build();

            payments.add(payment);

            user.get().setPayments(payments);

            return userMapper.accountToAccountDTO(userRepository.save(user.get()));
        } else {
            throw new BadRequestException("Không thể phân tích nội dung SMS");
        }
    }

    @Override
    public UserDTO checkSubscribe(CheckSubscription checkSubscription) {
        Optional<User> user = userRepository.findById(checkSubscription.getUserId());

        if (!user.isPresent()) {
            throw new BadRequestException("User not found");
        }

        List<UserSubscription> userSubscriptions = user.get().getSubscriptions();

        Optional<SubscriptionType> subscriptionType = subscriptionTypeRepository.findById(checkSubscription.getSubscriptionTypeId());

        if (!subscriptionType.isPresent()) {
            throw new BadRequestException("Subscription type not found");
        }

        Optional<UserSubscription> userSubscription = userSubscriptions.stream().filter(UserSubscription::getIsActive)
                .findFirst();

        if (!userSubscription.isPresent()) {
            throw new BadRequestException("Subscription not found");
        }

        if (userSubscription.get().getSubscriptionType().getId() == checkSubscription.getSubscriptionTypeId().longValue()) {
            return userMapper.accountToAccountDTO(user.get());
        }

        return null;
    }

}
