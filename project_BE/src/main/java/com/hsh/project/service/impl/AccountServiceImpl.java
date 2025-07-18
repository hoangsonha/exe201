package com.hsh.project.service.impl;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.configuration.JWTAuthenticationFilter;
import com.hsh.project.configuration.JWTToken;
import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.request.AccountRegisterRequest;
import com.hsh.project.dto.request.AccountVerificationRequest;
import com.hsh.project.dto.response.TokenResponse;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.exception.EntityNotFoundException;
import com.hsh.project.mapper.UserMapper;
import com.hsh.project.pojo.SubscriptionType;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.UserSubscription;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.pojo.enums.EnumTokenType;
import com.hsh.project.repository.SubscriptionTypeRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.service.spec.AccountService;
import com.hsh.project.service.spec.RoleService;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTToken jwtToken;
    private final JWTAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationManager authenticationManager;
    private final SubscriptionTypeRepository subscriptionTypeRepository;


    private final JavaMailSender javaMailSender;

    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;


    @Transactional
    @Override
    public boolean registerAccount(AccountRegisterRequest accountRegisterRequest) {
        User checkExistingUser = userRepository.getAccountByEmail(accountRegisterRequest.getEmail());
        if (checkExistingUser != null) {
            throw new ElementExistException("Tài khoản đã tồn tại");
        }
        Role role = roleService.getRoleByRoleName(EnumRoleNameType.ROLE_USER);

        List<UserSubscription> userSubscriptions = new ArrayList<>();
        LocalDateTime localDate = LocalDateTime.now();

        SubscriptionType subscriptionType = subscriptionTypeRepository.findByName("Free");

        User user = User.builder()
                .email(accountRegisterRequest.getEmail())
                .password(bCryptPasswordEncoder.encode(accountRegisterRequest.getPassword()))
                .userName(generateUniqueUsername())
                .accessToken(null)
                .refreshToken(null)
                .enabled(false)
                .nonLocked(false)
                .role(role)
                .codeVerify(generateSixDigitCode())
                .avatar("https://firebasestorage.googleapis.com/v0/b/swp391-f046d.appspot.com/o/exe201_project%2Fanonymous.png?alt=media&token=097bad4a-2ec7-4467-ae5e-42f0f5f59048")
                .build();

        UserSubscription userSubscription = UserSubscription.builder()
                .user(user)
                .subscriptionType(subscriptionType)
                .isActive(true)
                .startDate(localDate)
                .endDate(null)
                .build();
        userSubscriptions.add(userSubscription);

        user.setSubscriptions(userSubscriptions);

        User u = userRepository.save(user);

        return sendVerificationEmail(u.getEmail(), u.getUserName(), u.getCodeVerify());
    }

    private String generateUniqueUsername() {
        String prefix = "toi_";
        String username;
        Random random = new Random();

        do {
            int number = 1 + random.nextInt(9000);
            username = prefix + number;
        } while (userRepository.existsByUserName(username));

        return username;
    }

    @Override
    public TokenResponse verificationUser(AccountVerificationRequest request) {
        User user = userRepository.getAccountByEmail(request.getEmail());

        if (user == null) {
            return null;
        }

        if (request.getVerificationCode().equals(user.getCodeVerify())) {
            user.setCodeVerify(null);
            user.setEnabled(true);
            user.setNonLocked(true);

            CustomAccountDetail accountDetail = CustomAccountDetail.mapAccountToAccountDetail(user);
            String token = jwtToken.generatedToken(accountDetail);
            String refreshToken = jwtToken.generatedRefreshToken(accountDetail);

            user.setRefreshToken(refreshToken);
            user.setAccessToken(token);
            userRepository.save(user);

            return TokenResponse.builder()
                    .code("Success")
                    .message("Success")
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .token(token)
                    .refreshToken(refreshToken)
                    .avatar(user.getAvatar())
                    .build();
        }
        return TokenResponse.builder()
                .code("Failed")
                .message("Mã xác thực không đúng. Vui lòng thử lại")
                .userId(null)
                .email(null)
                .token(null)
                .avatar(null)
                .refreshToken(null)
                .build();
    }

    public String generateSixDigitCode() {
        Random random = new Random();
        int number = random.nextInt(1_000_000);
        return String.format("%06d", number);
    }

    private boolean sendVerificationEmail(String email, String userName, String verificationCode) {
//        String recipient, String subject, String content, MultipartFile[] files
        if (email == null) {
            return false;
        }
        try {
            Context context = new Context();
            context.setVariable("verificationCode", verificationCode);
            context.setVariable("name", userName);

            String content = "confirm";

            String mailne = templateEngine.process(content, context);

            String title = "Mã xác nhận tài khoản";
            String senderName = "TOIREVIEW";
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(from, senderName);

            if(email.contains(",")) {
                helper.setTo(InternetAddress.parse(email));
            } else {
                helper.setTo(email);
            }
            helper.setSubject(title);
            helper.setText(mailne, true);
            javaMailSender.send(mimeMessage);
            log.error("Send mail to {}", email);
            return true;
        } catch (Exception e) {
            log.error("Can not send mail {}", e.toString());
            return false;
        }
    }

    @Override
    public TokenResponse refreshToken(String refreshToken) {
        TokenResponse tokenResponse = TokenResponse.builder()
                .code("FAILED")
                .message("Làm mới token thất bại")
                .build();
        String email = jwtToken.getEmailFromJwt(refreshToken, EnumTokenType.REFRESH_TOKEN);
        User user = userRepository.getAccountByEmail(email);
        if (user != null) {
            if (StringUtils.hasText(refreshToken) && user.getRefreshToken().equals(refreshToken)) {
                if (jwtToken.validate(refreshToken, EnumTokenType.REFRESH_TOKEN)) {
                    CustomAccountDetail customAccountDetail = CustomAccountDetail.mapAccountToAccountDetail(user);
                    if (customAccountDetail != null) {
                        String newToken = jwtToken.generatedToken(customAccountDetail);
                        user.setAccessToken(newToken);
                        userRepository.save(user);
                        tokenResponse = TokenResponse.builder()
                                .code("Success")
                                .message("Success")
                                .userId(user.getUserId())
                                .token(newToken)
                                .refreshToken(refreshToken)
                                .avatar(user.getAvatar())
                                .email(user.getEmail())
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
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                email, password);
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        CustomAccountDetail accountDetail = (CustomAccountDetail) authentication.getPrincipal();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = jwtToken.generatedToken(accountDetail);
        String refreshToken = jwtToken.generatedRefreshToken(accountDetail);
        User user = userRepository.getAccountByEmail(accountDetail.getEmail());
        if (user != null) {
            user.setRefreshToken(refreshToken);
            user.setAccessToken(token);
            userRepository.save(user);
            tokenResponse = TokenResponse.builder()
                    .code("Success")
                    .message("Success")
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .token(token)
                    .refreshToken(refreshToken)
                    .avatar(user.getAvatar())
                    .subscriptionTypeId(user.getSubscriptions().stream()
                            .filter(UserSubscription::getIsActive)
                            .findFirst()
                            .map(v -> v.getSubscriptionType().getId())
                            .orElse(null))
                    .title(user.getSubscriptions().stream()
                            .filter(UserSubscription::getIsActive)
                            .findFirst()
                            .map(v -> v.getSubscriptionType().getTitle())
                            .orElse(null))
                    .build();
        }
        return tokenResponse;
    }

    @Override
    public boolean logout(HttpServletRequest request) {
        String token = jwtAuthenticationFilter.getToken(request);
        String email = jwtToken.getEmailFromJwt(token, EnumTokenType.TOKEN);
        User user = userRepository.getAccountByEmail(email);
        if (user == null) {
            throw new ElementNotFoundException("Không tìm thấy tài khoản");
        }
        user.setAccessToken(null);
        user.setRefreshToken(null);
        User checkUser = userRepository.save(user);

        return checkUser.getAccessToken() == null;
    }

    @Override
    public User getUserById(Integer id) {
        return userRepository.findByUserIdAndDeletedIsFalse(id).orElseThrow(
                () -> new EntityNotFoundException("Không tìm thấy người dùng"));
    }

    // @Override
    // public PagingResponse findAll(int currentPage, int pageSize) {
    // Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
    //
    // var pageData = employeeRepository.findAll(pageable);
    //
    // return PagingResponse.builder()
    // .currentPage(currentPage)
    // .pageSize(pageSize)
    // .totalElements(pageData.getTotalElements())
    // .totalPages(pageData.getTotalPages())
    // .data(pageData.getContent())
    // .build();
    // }
    //
    // @Override
    // public Employee findById(Integer id) {
    // return this.employeeRepository.findById(id).orElse(null);
    // }
    //
    // @Override
    // public Employee save(Employee entity) {
    // return this.employeeRepository.save(entity);
    // }
}
