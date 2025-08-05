package com.hsh.project.repository;

import com.hsh.project.pojo.Policy;
import com.hsh.project.pojo.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionTypeRepository extends JpaRepository<SubscriptionType, Integer> {
    SubscriptionType findByName(String name);

    @Query("select count(*) from UserSubscription as us, SubscriptionType as st where us.subscriptionType.id = st.id and st.id = 11")
    Integer getSubscriptionTypeVIPCount();

    @Query("select sum(st.price) from UserSubscription as us, SubscriptionType as st where us.subscriptionType.id = st.id and st.id = 11")
    Double getSubscriptionTypeVIPSum();

    @Query("select count(*) from UserSubscription as us, SubscriptionType as st where us.subscriptionType.id = st.id and st.id = 12")
    Integer getSubscriptionTypeBusinessCount();

    @Query("select sum(st.price) from UserSubscription as us, SubscriptionType as st where us.subscriptionType.id = st.id and st.id = 12")
    Double getSubscriptionTypeBusinessSum();

}
