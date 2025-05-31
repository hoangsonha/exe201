package com.hsh.project.utils;

import com.hsh.project.pojo.User;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {

    public static Specification<User> searchByField(String field, String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            switch (field) {
                case "userName":
                    return criteriaBuilder.like(root.get("userName"), "%" + value + "%");
                case "fullName":
                    return criteriaBuilder.like(root.get("fullName"), "%" + value + "%");
                case "email":
                    return criteriaBuilder.like(root.get("email"), "%" + value + "%");
                default:
                    return null;
            }
        };
    }

}
