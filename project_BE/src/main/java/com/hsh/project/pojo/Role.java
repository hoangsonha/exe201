package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumRoleNameType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Enumerated(EnumType.STRING)
    EnumRoleNameType roleName;

    @OneToMany(mappedBy = "role")
    List<Employee> users;

}
