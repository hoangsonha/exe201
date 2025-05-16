package com.hsh.project.configuration;

import com.hsh.project.pojo.Employee;
import com.hsh.project.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomAccountDetailService implements UserDetailsService {

    private final EmployeeRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee user = userRepository.getAccountByEmail(username);
        if(user != null) {
            return CustomAccountDetail.mapAccountToAccountDetail(user);
        }
        return null;
    }
}
