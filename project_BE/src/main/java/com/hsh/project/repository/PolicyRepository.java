package com.hsh.project.repository;

import com.hsh.project.pojo.Policy;
import com.hsh.project.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Integer> {

}
