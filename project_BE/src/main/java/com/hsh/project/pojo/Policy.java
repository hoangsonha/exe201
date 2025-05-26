package com.hsh.project.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Policy extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long policyID;

    @OneToMany(mappedBy = "policy")
    List<UserLegalAcceptance> userLegalAcceptances;

    Boolean status;

    String content;

    String version;

    LocalDateTime effectiveDate;
}
