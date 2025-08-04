package com.hsh.project.service.spec;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.request.CheckSubscription;
import com.hsh.project.dto.request.SubscriptionSMS;
import com.hsh.project.dto.response.StatisticResponseDTO;
import com.hsh.project.pojo.SubscriptionType;

import java.util.List;

public interface SubscriptionService {
    List<SubscriptionType> getAllSubscriptionType();

    UserDTO subscribe(SubscriptionSMS subscriptionSMS);

    UserDTO checkSubscribe(CheckSubscription checkSubscription);

    StatisticResponseDTO getStatistic();
}
