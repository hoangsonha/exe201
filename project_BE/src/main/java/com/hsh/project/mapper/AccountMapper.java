package com.hsh.project.mapper;

import com.hsh.project.dto.AccountDTO;
import com.hsh.project.pojo.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

    @Mapping(source = "role.roleName", target = "roleName")
    @Mapping(source = "enabled", target = "enabled")
    @Mapping(source = "nonLocked", target = "nonLocked")
    @Mapping(source = "deleted", target = "deleted")
    @Mapping(source = "id", target = "id")
    AccountDTO accountToAccountDTO(Employee user);

}
