package com.hsh.project.service.impl;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.mapper.AccountMapper;
import com.hsh.project.pojo.Employee;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.repository.EmployeeRepository;
import com.hsh.project.repository.RoleRepository;
import com.hsh.project.service.spec.EmployeeService;
import com.hsh.project.utils.EmployeeSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AccountMapper accountMapper;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize) {
        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = employeeRepository.findAll(pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all account paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(accountMapper::accountToAccountDTO)
                        .toList())
                .build() :
                PagingResponse.builder()
                        .code("Failed")
                        .message("Get all account paging failed")
                        .currentPage(currentPage)
                        .pageSize(pageSize)
                        .totalElements(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .data(pageData.getContent().stream()
                                .map(accountMapper::accountToAccountDTO)
                                .toList())
                        .build();
    }

    @Override
    public PagingResponse searchEmployees(Integer currentPage, Integer pageSize, String userName, String fullName, String email) {
        Pageable pageable;

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        Specification<Employee> spec = Specification.where(null);

        List<String> keys = new ArrayList<>();
        List<String> values = new ArrayList<>();

        String searchName = "";
        if (StringUtils.hasText(userName)) {
            searchName = userName;
        }
        keys.add("userName");
        values.add(searchName);

        String searchFullName = "";
        if (StringUtils.hasText(fullName)) {
            searchFullName = fullName;
        }
        keys.add("fullName");
        values.add(searchFullName);

        String searchEmail = "";
        if (StringUtils.hasText(email)) {
            searchEmail = email;
        }
        keys.add("email");
        values.add(searchEmail);

        if(keys.size() == values.size()) {
            for(int i = 0; i < keys.size(); i++) {
                String field = keys.get(i);
                String value = values.get(i);
                Specification<Employee> newSpec = EmployeeSpecification.searchByField(field, value);
                if(newSpec != null) {
                    spec = spec.and(newSpec);
                }
            }
        }

        pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = employeeRepository.findAll(spec, pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all employees paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(accountMapper::accountToAccountDTO)
                        .toList())
                .build() :
                PagingResponse.builder()
                        .code("Failed")
                        .message("Get all employees paging failed")
                        .currentPage(currentPage)
                        .pageSize(pageSize)
                        .totalElements(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .data(pageData.getContent().stream()
                                .map(accountMapper::accountToAccountDTO)
                                .toList())
                        .build();
    }

    @Override
    public List<AccountDTO> getAccounts() {

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Employee user = employeeRepository.getAccountByEmail(accountDetail.getEmail());

        return employeeRepository.findAll().stream().filter(e -> !e.getId().equals(user.getId())).map(accountMapper::accountToAccountDTO).collect(Collectors.toList());
    }

    @Override
    public AccountDTO getAccountById(int id) {

        Employee e = employeeRepository.findById(id).orElse(null);

        if (e == null) {
            throw new ElementNotFoundException("Employee not found");
        }

        return accountMapper.accountToAccountDTO(e);
    }

    @Override
    public AccountDTO createEmployee(CreateEmployeeRequest request) {

        Employee employee = employeeRepository.findByEmail(request.getEmail());
        Employee employee2 = employeeRepository.findByCode(request.getCode());
        Employee employee3 = employeeRepository.findByPhone(request.getPhone());

        if (!request.getPhone().matches("^0\\d{9}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
        }

        if (employee != null) {
            throw new ElementExistException("Email already exists");
        }
        if (employee2 != null) {
            throw new ElementExistException("Code already exists");
        }
        if (employee3 != null) {
            throw new ElementExistException("Phone already exists");
        }

        Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));

        Employee newEmployee = Employee.builder()
                .userName(request.getUserName())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .code(request.getCode())
                .phone(request.getPhone())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .nonLocked(true)
                .build();
        return accountMapper.accountToAccountDTO(employeeRepository.save(newEmployee));
    }

    @Override
    public AccountDTO updateEmployee(UpdateEmployeeRequest request, int id) {

        Employee employee = employeeRepository.findById(id).orElse(null);

        if (employee == null) {
            throw new ElementNotFoundException("Employee not found");
        } else {
            if (request.getCode() != null) {
                if (!employee.getCode().equals(request.getCode())) {
                    Employee employee2 = employeeRepository.findByCode(request.getCode());
                    if (employee2 != null) {
                        throw new ElementExistException("Code already exists");
                    }
                }
                employee.setCode(request.getCode());
            }

            if (!request.getPhone().matches("^0\\d{9}$")) {
                throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
            }

            if (request.getPhone() != null) {
                if (!employee.getPhone().equals(request.getPhone())) {
                    Employee employee2 = employeeRepository.findByPhone(request.getPhone());
                    if (employee2 != null) {
                        throw new ElementExistException("Phone already exists");
                    }
                }
                employee.setCode(request.getCode());
            }

            if (request.getUserName() != null) {
                employee.setUserName(request.getUserName());
            }
            if (request.getFullName() != null) {
                employee.setFullName(request.getFullName());
            }
            if (request.getRoleName() != null) {
                Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));
                employee.setRole(role);
            }
            return accountMapper.accountToAccountDTO(employeeRepository.save(employee));
        }
    }

    @Override
    public Employee getEmployeeById(int id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }


}
