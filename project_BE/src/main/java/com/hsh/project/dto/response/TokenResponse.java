package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenResponse {
    String code;
    String message;
    String token;
    String refreshToken;
    Long userId;
    String email;
    String avatar;
    Long subscriptionTypeId;
    String title;
}
