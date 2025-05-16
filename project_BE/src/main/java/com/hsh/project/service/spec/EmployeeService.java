package com.hsh.project.service.spec;

import com.hsh.project.dto.AccountDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.CreateEmployeeRequest;
import com.hsh.project.dto.request.UpdateEmployeeRequest;
import com.hsh.project.pojo.Employee;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface EmployeeService {

    PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize);

    PagingResponse searchEmployees(Integer currentPage, Integer pageSize, String userName, String fullName, String email);

    List<AccountDTO> getAccounts();

    AccountDTO getAccountById(int id);

    AccountDTO createEmployee(CreateEmployeeRequest request) throws BadRequestException;

    AccountDTO updateEmployee(UpdateEmployeeRequest request, int id);

    Employee getEmployeeById(int id);

    Employee saveEmployee(Employee employee);
}
