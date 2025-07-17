package com.hsh.project.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubscriptionType extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    Float price;

    String title;

    Float originalPrice;

    String features;

    Integer duration; // days

    @OneToMany(mappedBy = "subscriptionType")
    @JsonBackReference
    List<UserSubscription> subscriptions;
}
