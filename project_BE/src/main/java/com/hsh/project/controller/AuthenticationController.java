package com.hsh.project.controller;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.request.AccountLoginRequest;
import com.hsh.project.dto.request.AccountRegisterRequest;
import com.hsh.project.dto.request.AccountVerificationRequest;
import com.hsh.project.dto.response.ReviewResponseDTO;
import com.hsh.project.dto.response.TokenResponse;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.service.spec.AccountService;
import com.hsh.project.service.spec.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Các hoạt động liên quan đến xác thực người dùng")
public class AuthenticationController {

    private final AccountService accountService;
    private final ReviewService reviewService;

    @GetMapping("/review/{id}")
    public ResponseEntity<ObjectResponse> getReviewByID(@PathVariable("id") long id) {
        ReviewResponseDTO user = reviewService.getReviewById(id);
        return user != null
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Get user by ID successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Fail", "Get user by ID failed", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ObjectResponse> userRegister(@Valid @RequestBody AccountRegisterRequest accountRegisterRequest) {
        try {
            boolean account = accountService.registerAccount(accountRegisterRequest);
            return account ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Đăng ký tài khoản thành công", account)) :
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Đăng ký tài khoản thất bại do không gửi được email", null));
        } catch (Exception e) {
            log.error("Error register user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", "Đăng ký tài khoản thất bại", null));
        }
    }

    @PostMapping("/register/verification")
    public ResponseEntity<TokenResponse> userRegister(@Valid @RequestBody AccountVerificationRequest accountRegisterRequest) {
        try {
            TokenResponse tokenResponse = accountService.verificationUser(accountRegisterRequest);
            return ResponseEntity.status(tokenResponse.getCode().equals("Success") ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(tokenResponse);
        } catch (Exception e) {
            log.error("Cannot verification : {}", e.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    TokenResponse.builder()
                            .code("FAILED")
                            .message("Mã không trùng khớp")
                            .build()
            );
        }
    }

    @PostMapping("/refresh_token")
    public ResponseEntity<TokenResponse> refreshToken(HttpServletRequest request) {
        String refreshToken = request.getHeader("RefreshToken");
        TokenResponse tokenResponse = accountService.refreshToken(refreshToken);
        return ResponseEntity.status(tokenResponse.getCode().equals("Success") ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(tokenResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> loginPage(@Valid @RequestBody AccountLoginRequest accountLoginRequest) {
        try {
            TokenResponse tokenResponse = accountService.login(accountLoginRequest.getEmail(), accountLoginRequest.getPassword());
            return ResponseEntity.status(tokenResponse.getCode().equals("Success") ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(tokenResponse);
        } catch (Exception e) {
            log.error("Cannot login : {}", e.toString());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    TokenResponse.builder()
                            .code("FAILED")
                            .message("Đăng nhập thất bại")
                            .build()
            );
        }
    }

    // logout
    @PostMapping("/logout")
    public ResponseEntity<ObjectResponse> getLogout(HttpServletRequest request) {
        try {
            boolean checkLogout = accountService.logout(request);
            return checkLogout ? ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse("Success", "Đăng xuất thành công", null)) :
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "Đăng xuất thất bại", null));
        } catch (ElementNotFoundException e) {
            log.error("Error logout not found : {}", e.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "Đăng xuất thất bại", null));
        } catch (Exception e) {
            log.error("Error logout : {}", e.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Failed", "Đăng xuất thất bại", null));
        }
    }

}
