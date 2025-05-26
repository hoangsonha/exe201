package com.hsh.project.repository;

import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.UserLegalAcceptance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLegalAcceptanceRepository extends JpaRepository<UserLegalAcceptance, Integer> {

}
