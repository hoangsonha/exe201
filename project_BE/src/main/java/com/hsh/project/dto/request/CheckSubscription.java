package com.hsh.project.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CheckSubscription {
    private Integer userId;
    private Integer subscriptionTypeId;
}
