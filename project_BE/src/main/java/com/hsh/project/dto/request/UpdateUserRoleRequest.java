package com.hsh.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRoleRequest {
    @NotBlank(message = "Username không được để trống")
    String userName;

    @NotBlank(message = "Họ tên không được để trống")
    String fullName;

//    @Email(message = "Email không hợp lệ")
//    @NotBlank(message = "Email không được để trống")
//    String email;

    @NotBlank(message = "Mã nhân viên không được để trống")
    String code;

    @NotBlank(message = "Số điện thoại không được để trống")
    String phone;

    @NotNull(message = "Role không được để trống")
    String roleName;
}
