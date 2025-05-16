package com.hsh.project.pojo;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "employee")
public class Employee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = false)
    String userName;

    @Column(columnDefinition = "NVARCHAR(255)")
    String fullName;

    @Column(unique = true, nullable = false)
    String email;

    @Column(unique = true, nullable = false)
    String code;

    @Column(unique = true, nullable = false)
    String phone;

    String password;

    @Builder.Default
    boolean enabled = true;

    @Builder.Default
    boolean nonLocked = true;

    @Column(length = 2048)
    String accessToken;

    @Column(length = 2048)
    String refreshToken;

    @ManyToOne
    Role role;

}
