package com.hsh.project.repository;

import com.hsh.project.pojo.User;
import com.hsh.project.pojo.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUserIdAndDeletedIsFalse(Long id);

    List<User> findByRoleAndDeletedIsFalse(Role role);

    User getAccountByEmail(String email);

    Page<User> findAll(Specification<User> spec, Pageable pageable);

    Optional<User> getAccountByEmailAndDeletedIsFalse(String email);

    User findByUserName(String username);

    User findByEmail(String email);

    User findByPhone(String phone);

    boolean existsByUserName(String userName);
}
