package com.hsh.project.repository;

import com.hsh.project.pojo.Policy;
import com.hsh.project.pojo.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionTypeRepository extends JpaRepository<SubscriptionType, Integer> {
    SubscriptionType findByName(String name);
}
