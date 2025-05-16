package com.hsh.project.service.spec;

import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.request.AccountRegisterRequest;
import com.hsh.project.dto.response.TokenResponse;
import com.hsh.project.pojo.Employee;
import com.hsh.project.repository.EmployeeRepository;
import jakarta.servlet.http.HttpServletRequest;


public interface AccountService {

    AccountDTO registerAccount(AccountRegisterRequest accountRegisterRequest);

    TokenResponse refreshToken(String refreshToken);

    TokenResponse login(String email, String password);

    boolean logout(HttpServletRequest request);

    Employee getUserById(Integer id);

}
