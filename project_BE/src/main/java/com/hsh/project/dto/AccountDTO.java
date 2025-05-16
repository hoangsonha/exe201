package com.hsh.project.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountDTO {
    int id;
    String userName;
    String phone;
    String fullName;
    String code;
    String email;
    String roleName;
    boolean enabled;
    boolean nonLocked;
    boolean deleted;
}
