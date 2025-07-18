package com.hsh.project.service.spec;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.*;
import com.hsh.project.pojo.User;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface UserService {

    PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize);

    PagingResponse searchUsers(Integer currentPage, Integer pageSize, String userName, String fullName, String email);

    List<UserDTO> getAccounts();

    UserDTO getAccountById(int id);

    UserDTO createUser(CreateUserRequest request) throws BadRequestException;

    UserDTO updateUserRole(UpdateUserRoleRequest request, int id);

    UserDTO updateUser(UpdateUserRequest request, int id);

    User getUserById(int id);

    User saveUser(User user);

    UserDTO createHashTagUser(UserRegisterHashTagRequest request);

    UserDTO createImageUser(UserCreateImageRequest request);
    
    UserDTO updateUserName(int id, String newUserName);
}
