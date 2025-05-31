package com.hsh.project.dto;

import com.hsh.project.dto.response.HashTagResponseDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Value
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
    Long userId;
    String userName;
    String phone;
    String fullName;
    String code;
    String email;
    String roleName;
    boolean enabled;
    boolean nonLocked;
    boolean deleted;

    List<HashTagResponseDTO> listHashTagUser;
}