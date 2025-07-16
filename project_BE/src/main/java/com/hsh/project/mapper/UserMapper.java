package com.hsh.project.mapper;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.UserHashtag;
import com.hsh.project.pojo.UserSubscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "role.roleName", target = "roleName")
    @Mapping(source = "enabled", target = "enabled")
    @Mapping(source = "nonLocked", target = "nonLocked")
    @Mapping(source = "deleted", target = "deleted")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "subscriptions", target = "subscriptionId", qualifiedByName = "getActiveSubscriptionId")
    @Mapping(source = "subscriptions", target = "title", qualifiedByName = "getActiveSubscriptionTitle")
    @Mapping(source = "userHashtags", target = "listHashTagUser", qualifiedByName = "mapUserHashtagToHashtagDTO")
    UserDTO accountToAccountDTO(User user);

    @Named("mapUserHashtagToHashtagDTO")
    default List<HashTagResponseDTO> mapUserHashtagToHashtagDTO(List<UserHashtag> userHashtags) {
        if (userHashtags == null) return new ArrayList<>();

        return userHashtags.stream()
                .map(UserHashtag::getHashtag)
                .map(tag -> new HashTagResponseDTO(tag.getHashtagID(), tag.getTag()))
                .collect(Collectors.toList());
    }

    @Named("getActiveSubscriptionId")
    default Long getActiveSubscriptionId(List<UserSubscription> subscriptions) {
        if (subscriptions == null) return null;

        return subscriptions.stream()
                .filter(UserSubscription::getIsActive)
                .findFirst()
                .map(v -> v.getSubscriptionType().getId())
                .orElse(null);
    }

    @Named("getActiveSubscriptionTitle")
    default String getActiveSubscriptionTitle(List<UserSubscription> subscriptions) {
        if (subscriptions == null) return null;

        return subscriptions.stream()
                .filter(UserSubscription::getIsActive)
                .findFirst()
                .map(v -> v.getSubscriptionType().getTitle())
                .orElse(null);
    }

}
