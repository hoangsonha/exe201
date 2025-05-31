package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumAdvertiseType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Advertise extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    Float price;

    String status;

    Long duration;

    String name;

    String url;

    @Enumerated(EnumType.STRING)
    EnumAdvertiseType type;

}
