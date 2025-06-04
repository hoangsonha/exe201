package com.hsh.project.configuration;

import com.hsh.project.exception.AuthenticationException;
import com.hsh.project.pojo.enums.EnumTokenType;
import io.jsonwebtoken.lang.Strings;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTToken jwtToken;
    @Autowired
    private CustomAccountDetailService customAccountDetailService;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    private final List<String> NON_USER = List.of(
            "/swagger-ui/**",
            "/v3/**",
            "/api-docs/**",
            "/swagger-resources/**",
            "/api/v1/public/**",
            "/api/v1/hashtags/non-paging",
            "/api/v1/reviews/top-trending"
    );

    public String getToken(HttpServletRequest request) {
        try {
            String s = request.getHeader("Authorization");
            if (s.startsWith("Bearer ") && StringUtils.hasText(s)) {
                return s.substring(7);
            }
        } catch (Exception e) {
            throw new AuthenticationException("Mã JWT không hợp lệ") {
            };
        }
        return null;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            if (request.getServletPath().equals("/")) {
                response.sendRedirect(request.getContextPath() + "/swagger-ui/index.html");
                return;
            }
            if (isAuthentication(request.getRequestURI())) {
                filterChain.doFilter(request, response);
                return;
            }
            String bearerToken = getToken(request);
            if (Strings.hasText(bearerToken) && jwtToken.validate(bearerToken, EnumTokenType.TOKEN)) {
                String email = jwtToken.getEmailFromJwt(bearerToken, EnumTokenType.TOKEN);
                CustomAccountDetail customAccountDetail = (CustomAccountDetail) customAccountDetailService.loadUserByUsername(email);
                if (customAccountDetail != null) {
                    if (customAccountDetail.getAccessToken() != null && customAccountDetail.getAccessToken().equals(bearerToken)) {
                        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                                new UsernamePasswordAuthenticationToken(customAccountDetail, null, customAccountDetail.getAuthorities());
                        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    } else {
                        throw new AuthenticationException("Bạn không có quyền truy cập.");
                    }
                } else {
                    throw new AuthenticationException("Bạn không có quyền truy cập.");
                }
            } else {
                throw new AuthenticationException("Bạn không có quyền truy cập.");
            }
        } catch (Exception e) {
            log.error("Fail on set user authentication:{}", e.toString());
            resolver.resolveException(request, response, null, e);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean isAuthentication(String uri) {
        AntPathMatcher pathcMatcher = new AntPathMatcher();
        return NON_USER.stream().anyMatch(pattern -> pathcMatcher.match(pattern, uri));
    }

}
