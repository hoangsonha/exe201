package com.hsh.project.service.spec;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.dto.request.UserRegisterHashTagRequest;
import com.hsh.project.pojo.User;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface UserService {

    PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize);

    PagingResponse searchEmployees(Integer currentPage, Integer pageSize, String userName, String fullName, String email);

    List<UserDTO> getAccounts();

    UserDTO getAccountById(int id);

    UserDTO createEmployee(CreateEmployeeRequest request) throws BadRequestException;

    UserDTO updateEmployee(UpdateEmployeeRequest request, int id);

    User getEmployeeById(int id);

    User saveEmployee(User user);

    UserDTO createHashTagUser(UserRegisterHashTagRequest request);

}
