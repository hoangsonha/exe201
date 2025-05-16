package com.hsh.project.dto.internal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ObjectResponse {
    String status;
    String message;
    Object data;

}
