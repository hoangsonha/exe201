package com.hsh.project.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatisticResponseDTO {
    Integer countVIP;
    Double sumVIP;
    Integer countBusiness;
    Double sumBusiness;
}
