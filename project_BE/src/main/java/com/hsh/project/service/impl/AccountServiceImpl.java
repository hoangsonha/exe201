package com.hsh.project.service.impl;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.configuration.JWTAuthenticationFilter;
import com.hsh.project.configuration.JWTToken;
import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.AccountRegisterRequest;
import com.hsh.project.dto.response.TokenResponse;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.exception.EntityNotFoundException;
import com.hsh.project.mapper.AccountMapper;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.pojo.enums.EnumTokenType;
import com.hsh.project.repository.EmployeeRepository;
import com.hsh.project.service.spec.AccountService;
import com.hsh.project.service.spec.RoleService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.Period;

@Service
@Slf4j
public class AccountServiceImpl implements AccountService {

    private final EmployeeRepository employeeRepository;
    private final RoleService roleService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTToken jwtToken;
    private final JWTAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationManager authenticationManager;

    public AccountServiceImpl(EmployeeRepository employeeRepository, RoleService roleService, BCryptPasswordEncoder bCryptPasswordEncoder,
                              JWTToken jwtToken, JWTAuthenticationFilter jwtAuthenticationFilter, AuthenticationManager authenticationManager) {
        this.employeeRepository = employeeRepository;
        this.roleService = roleService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtToken = jwtToken;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AccountDTO registerAccount(AccountRegisterRequest accountRegisterRequest) {
        Employee checkExistingUser = employeeRepository.getAccountByEmail(accountRegisterRequest.getEmail());
        if (checkExistingUser != null) {
            throw new ElementExistException("Tài khoản đã tồn tại");
        }
        Role role = roleService.getRoleByRoleName(EnumRoleNameType.ROLE_USER);

        int calculatedAge = Period.between(accountRegisterRequest.getDob(), LocalDate.now()).getYears();

        Employee user = Employee.builder()
                .email(accountRegisterRequest.getEmail())
                .password(bCryptPasswordEncoder.encode(accountRegisterRequest.getPassword()))
                .fullName(accountRegisterRequest.getLastName())
                .phone(accountRegisterRequest.getPhone())
                .accessToken(null)
                .refreshToken(null)
                .enabled(true)
                .nonLocked(true)
                .role(role)
                .build();

        return AccountMapper.INSTANCE.accountToAccountDTO(employeeRepository.save(user));
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        TokenResponse tokenResponse = TokenResponse.builder()
                .code("FAILED")
                .message("Làm mới token thất bại")
                .build();
        String email = jwtToken.getEmailFromJwt(refreshToken, EnumTokenType.REFRESH_TOKEN);
        Employee user = employeeRepository.getAccountByEmail(email);
        if (user != null) {
            if (StringUtils.hasText(refreshToken) && user.getRefreshToken().equals(refreshToken)) {
                if (jwtToken.validate(refreshToken, EnumTokenType.REFRESH_TOKEN)) {
                    CustomAccountDetail customAccountDetail = CustomAccountDetail.mapAccountToAccountDetail(user);
                    if (customAccountDetail != null) {
                        String newToken = jwtToken.generatedToken(customAccountDetail);
                        user.setAccessToken(newToken);
                        employeeRepository.save(user);
                        tokenResponse = TokenResponse.builder()
                                .code("Success")
                                .message("Success")
                                .userId(user.getId())
                                .token(newToken)
                                .refreshToken(refreshToken)
                                .build();
                    }
                }
            }
        }
        return tokenResponse;
    }

    @Override
    public TokenResponse login(String email, String password) {
        TokenResponse tokenResponse = TokenResponse.builder()
                .code("FAILED")
                .message("Làm mới token thất bại")
                .build();
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(email, password);
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        CustomAccountDetail accountDetail = (CustomAccountDetail) authentication.getPrincipal();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = jwtToken.generatedToken(accountDetail);
        String refreshToken = jwtToken.generatedRefreshToken(accountDetail);
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());
        if (user != null) {
            user.setRefreshToken(refreshToken);
            user.setAccessToken(token);
            employeeRepository.save(user);
            tokenResponse = TokenResponse.builder()
                    .code("Success")
                    .message("Success")
                    .userId(user.getId())
                    .email(user.getEmail())
                    .token(token)
                    .refreshToken(refreshToken)
                    .build();
        }
        return tokenResponse;
    }

    @Override
    public boolean logout(HttpServletRequest request) {
        String token = jwtAuthenticationFilter.getToken(request);
        String email = jwtToken.getEmailFromJwt(token, EnumTokenType.TOKEN);
        Employee user = employeeRepository.getAccountByEmail(email);
        if (user == null) {
            throw new ElementNotFoundException("Không tìm thấy tài khoản");
        }
        user.setAccessToken(null);
        user.setRefreshToken(null);
        Employee checkUser = employeeRepository.save(user);

        return checkUser.getAccessToken() == null;
    }

    @Override
    public Employee getUserById(Integer id) {
        return employeeRepository.findByIdAndDeletedIsFalse(id).orElseThrow(
                () -> new EntityNotFoundException("Không tìm thấy người dùng")
        );
    }

    
//    @Override
//    public PagingResponse findAll(int currentPage, int pageSize) {
//        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
//
//        var pageData = employeeRepository.findAll(pageable);
//
//        return PagingResponse.builder()
//                .currentPage(currentPage)
//                .pageSize(pageSize)
//                .totalElements(pageData.getTotalElements())
//                .totalPages(pageData.getTotalPages())
//                .data(pageData.getContent())
//                .build();
//    }
//
//    @Override
//    public Employee findById(Integer id) {
//        return this.employeeRepository.findById(id).orElse(null);
//    }
//
//    @Override
//    public Employee save(Employee entity) {
//        return this.employeeRepository.save(entity);
//    }
}
