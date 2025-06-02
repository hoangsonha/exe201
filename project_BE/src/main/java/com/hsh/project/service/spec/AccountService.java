package com.hsh.project.service.spec;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.request.AccountRegisterRequest;
import com.hsh.project.dto.request.AccountVerificationRequest;
import com.hsh.project.dto.response.TokenResponse;
import com.hsh.project.pojo.User;
import jakarta.servlet.http.HttpServletRequest;


public interface AccountService {

    boolean registerAccount(AccountRegisterRequest accountRegisterRequest);

    TokenResponse verificationUser(AccountVerificationRequest request);

    TokenResponse refreshToken(String refreshToken);

    TokenResponse login(String email, String password);

    boolean logout(HttpServletRequest request);

    User getUserById(Long id);

}
