package com.hsh.project.service.impl;

import com.hsh.project.dto.request.RoleRequestDTO;
import com.hsh.project.dto.response.RoleResponseDTO;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.exception.ParseEnumException;
import com.hsh.project.mapper.RoleMapper;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.repository.RoleRepository;
import com.hsh.project.service.spec.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public List<RoleResponseDTO> findAll() {
        return RoleMapper.INSTANCE.toDTOs(roleRepository.findAllByDeletedIsFalse());
    }

    @Override
    public RoleResponseDTO findById(Integer roleId) {
        Role role = roleRepository.findByIdAndDeletedIsFalse(roleId)
                .orElseThrow(() -> new ElementNotFoundException("Không tìm thấy vai trò có id: " + roleId));
        return RoleMapper.INSTANCE.toDTO(role);
    }

    @Override
public RoleResponseDTO createRole(RoleRequestDTO dto) throws ParseEnumException {
    EnumRoleNameType roleName;
    try {
        roleName = EnumRoleNameType.valueOf(dto.getName().toUpperCase());
    } catch (IllegalArgumentException e) {
        throw new ParseEnumException("Tên vai trò không hợp lệ: " + dto.getName());
    }

    if (roleRepository.getRoleByRoleName(roleName) != null) {
        throw new ParseEnumException("Vai trò có tên " + dto.getName() + " đã tồn tại");
    }

    Role role = RoleMapper.INSTANCE.toEntity(dto);
    role.setRoleName(roleName);
    return RoleMapper.INSTANCE.toDTO(roleRepository.save(role));
}

    @Override
    public RoleResponseDTO update(Integer roleId, RoleRequestDTO dto) {
        Role role = roleRepository.findByIdAndDeletedIsFalse(roleId)
                .orElseThrow(() -> new ElementNotFoundException("Không tìm thấy vai trò có id: " + roleId));

        try {
            role.setRoleName(EnumRoleNameType.valueOf(dto.getName().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tên vai trò không hợp lệ: " + dto.getName());
        }

        return RoleMapper.INSTANCE.toDTO(roleRepository.save(role));
    }

    @Override
    public void deleteById(Integer roleId) {
        Role role = roleRepository.findByIdAndDeletedIsFalse(roleId)
                .orElseThrow(() -> new ElementNotFoundException("Không tìm thấy vai trò có id: " + roleId));

        role.setDeleted(true);
        roleRepository.save(role);
    }

    @Override
    public Role getRoleByRoleName(EnumRoleNameType roleName) {
        return Optional.ofNullable(roleRepository.getRoleByRoleName(roleName))
                .orElseThrow(() -> new ElementNotFoundException("Không tìm thấy vai trò"));
    }

}
