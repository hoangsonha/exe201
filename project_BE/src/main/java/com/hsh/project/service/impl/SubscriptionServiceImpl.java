package com.hsh.project.service.impl;

import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.mapper.HashtagMapper;
import com.hsh.project.pojo.SubscriptionType;
import com.hsh.project.repository.HashtagRepository;
import com.hsh.project.repository.SubscriptionTypeRepository;
import com.hsh.project.service.spec.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionTypeRepository subscriptionTypeRepository;

    @Override
    public List<SubscriptionType> getAllSubscriptionType() {
        return subscriptionTypeRepository.findAll().stream().filter(v -> !v.isDeleted()).collect(Collectors.toList());
    }

}
