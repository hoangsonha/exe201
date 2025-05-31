package com.hsh.project.mapper;

import com.hsh.project.dto.request.RoleRequestDTO;
import com.hsh.project.dto.response.RoleResponseDTO;
import com.hsh.project.pojo.Role;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper {
    RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);

    Role toEntity(RoleRequestDTO roleRequestDTO);
    RoleResponseDTO toDTO(Role role);
    List<RoleResponseDTO> toDTOs(List<Role> roles);
}
