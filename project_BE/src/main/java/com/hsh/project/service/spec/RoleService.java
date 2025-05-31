package com.hsh.project.service.spec;

import com.hsh.project.dto.request.RoleRequestDTO;
import com.hsh.project.dto.response.RoleResponseDTO;
import com.hsh.project.exception.ParseEnumException;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;

import java.util.List;

public interface RoleService {
    List<RoleResponseDTO> findAll();
    RoleResponseDTO findById(Integer roleId);
    RoleResponseDTO createRole(RoleRequestDTO dto) throws ParseEnumException;
    RoleResponseDTO update(Integer roleId, RoleRequestDTO dto);
    void deleteById(Integer roleId);
    Role getRoleByRoleName(EnumRoleNameType enumRoleNameType);
}
