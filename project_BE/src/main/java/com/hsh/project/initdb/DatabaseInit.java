package com.hsh.project.initdb;

import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.repository.EmployeeRepository;
import com.hsh.project.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseInit {

    private final EmployeeRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public CommandLineRunner database() {
        return args -> {

            if (roleRepository.count() == 0) {
                roleRepository.save(Role.builder().roleName(EnumRoleNameType.ROLE_ADMIN).build());
                roleRepository.save(Role.builder().roleName(EnumRoleNameType.ROLE_MANAGER).build());
                roleRepository.save(Role.builder().roleName(EnumRoleNameType.ROLE_USER).build());
                roleRepository.save(Role.builder().roleName(EnumRoleNameType.ROLE_STAFF).build());
            }

            if (userRepository.count() == 0) {
                Role adminRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_ADMIN);
                Role managerRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_MANAGER);
                Role userRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_USER);
                Role staffRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_STAFF);

                userRepository.save(Employee.builder()
                        .userName("admin")
                        .fullName("Admin User")
                        .code("A001")
                        .email("admin@example.com")
                        .phone("0987000001")
                        .password(bCryptPasswordEncoder.encode("admin123"))
                        .role(adminRole)
                        .build());

                userRepository.save(Employee.builder()
                        .userName("manager")
                        .fullName("Manager Name")
                        .code("M001")
                        .email("manager@example.com")
                        .phone("0987000002")
                        .password(bCryptPasswordEncoder.encode("manager123"))
                        .role(managerRole)
                        .build());

                userRepository.save(Employee.builder()
                        .userName("user")
                        .fullName("Regular User")
                        .code("U001")
                        .email("user@example.com")
                        .phone("0987000003")
                        .password(bCryptPasswordEncoder.encode("user123"))
                        .role(userRole)
                        .build());

                userRepository.save(Employee.builder()
                        .userName("staff")
                        .fullName("Staff Member")
                        .code("S001")
                        .email("staff@example.com")
                        .phone("0987000004")
                        .password(bCryptPasswordEncoder.encode("staff123"))
                        .role(staffRole)
                        .build());
            }
        };
    }
}
