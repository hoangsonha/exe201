package com.hsh.project.service.impl;

import com.hsh.project.configuration.CustomAccountDetail;
import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.*;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.mapper.UserMapper;
import com.hsh.project.pojo.Hashtag;
import com.hsh.project.pojo.User;
import com.hsh.project.pojo.Role;
import com.hsh.project.pojo.UserHashtag;
import com.hsh.project.pojo.enums.EnumGenderType;
import com.hsh.project.pojo.enums.EnumRoleNameType;
import com.hsh.project.repository.HashtagRepository;
import com.hsh.project.repository.UserRepository;
import com.hsh.project.repository.RoleRepository;
import com.hsh.project.service.spec.UserService;
import com.hsh.project.utils.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final HashtagRepository hashtagRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public PagingResponse getAllAccountPaging(Integer currentPage, Integer pageSize) {
        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.getAccountByEmail(accountDetail.getEmail());

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = userRepository.findAll(pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all account paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(userMapper::accountToAccountDTO)
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
                                .map(userMapper::accountToAccountDTO)
                                .toList())
                        .build();
    }

    @Override
    public PagingResponse searchUsers(Integer currentPage, Integer pageSize, String userName, String fullName, String email) {
        Pageable pageable;

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.getAccountByEmail(accountDetail.getEmail());

        Specification<User> spec = Specification.where(null);

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
                Specification<User> newSpec = UserSpecification.searchByField(field, value);
                if(newSpec != null) {
                    spec = spec.and(newSpec);
                }
            }
        }

        pageable = PageRequest.of(currentPage - 1, pageSize);

        var pageData = userRepository.findAll(spec, pageable);

        return !pageData.getContent().isEmpty() ? PagingResponse.builder()
                .code("Success")
                .message("Get all Users paging successfully")
                .currentPage(currentPage)
                .pageSize(pageSize)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .data(pageData.getContent().stream()
                        .map(userMapper::accountToAccountDTO)
                        .toList())
                .build() :
                PagingResponse.builder()
                        .code("Failed")
                        .message("Get all Users paging failed")
                        .currentPage(currentPage)
                        .pageSize(pageSize)
                        .totalElements(pageData.getTotalElements())
                        .totalPages(pageData.getTotalPages())
                        .data(pageData.getContent().stream()
                                .map(userMapper::accountToAccountDTO)
                                .toList())
                        .build();
    }

    @Override
    public List<UserDTO> getAccounts() {

        CustomAccountDetail accountDetail = (CustomAccountDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.getAccountByEmail(accountDetail.getEmail());

        return userRepository.findAll().stream().filter(e -> !e.getUserId().equals(user.getUserId())).map(userMapper::accountToAccountDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO getAccountById(int id) {

        User e = userRepository.findById(id).orElse(null);

        if (e == null) {
            throw new ElementNotFoundException("User not found");
        }

        return userMapper.accountToAccountDTO(e);
    }

    @Override
    public UserDTO createUser(CreateUserRequest request) {

        User user = userRepository.findByEmail(request.getEmail());
        User user3 = userRepository.findByPhone(request.getPhone());

        if (!request.getPhone().matches("^0\\d{9}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
        }

        if (user != null) {
            throw new ElementExistException("Email already exists");
        }
        if (user3 != null) {
            throw new ElementExistException("Phone already exists");
        }

        Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));

        User newUser = User.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .nonLocked(true)
                .build();
        return userMapper.accountToAccountDTO(userRepository.save(newUser));
    }

    @Override
    public UserDTO updateUserRole(UpdateUserRoleRequest request, int id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            throw new ElementNotFoundException("User not found");
        } else {

            if (!request.getPhone().matches("^0\\d{9}$")) {
                throw new BadRequestException("Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số.");
            }

            if (request.getPhone() != null) {
                if (!user.getPhone().equals(request.getPhone())) {
                    User user2 = userRepository.findByPhone(request.getPhone());
                    if (user2 != null) {
                        throw new ElementExistException("Phone already exists");
                    }
                }
                user.setPhone(request.getPhone());
            }

            if (request.getUserName() != null) {
                user.setUserName(request.getUserName());
            }

            if (request.getRoleName() != null) {
                Role role = roleRepository.getRoleByRoleName(EnumRoleNameType.valueOf(request.getRoleName()));
                user.setRole(role);
            }
            return userMapper.accountToAccountDTO(userRepository.save(user));
        }
    }

    @Override
    public UserDTO updateUser(UpdateUserRequest request, int id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            throw new ElementNotFoundException("User not found");
        }

        if (request.getGender() != null) {
            user.setGender(EnumGenderType.valueOf(request.getGender()));
        }

        List<UserHashtag> userHashtags = user.getUserHashtags();
        userHashtags.clear();

        if (request.getHashTags() != null && !request.getHashTags().isEmpty()) {
            for (String hashTag : request.getHashTags()) {
                Hashtag hashtag = hashtagRepository.findByTag(hashTag);
                if (hashtag != null) {
                    UserHashtag userHashtag = UserHashtag.builder()
                            .user(user)
                            .hashtag(hashtag)
                            .build();
                    userHashtags.add(userHashtag);
                }
            }
        } else {
            throw new BadRequestException("Bạn phải chọn ít nhất 1 chủ đề");
        }

        user.setUserHashtags(userHashtags);
        return userMapper.accountToAccountDTO(userRepository.save(user));
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public UserDTO createHashTagUser(UserRegisterHashTagRequest request) {
        User user = getUserById(request.getUserId());
        if (user == null) {
            throw new ElementNotFoundException("User not found");
        }

        List<Hashtag> hashtags = hashtagRepository.findAllById(request.getHashtagID());

        // Xóa tất cả các UserHashtag hiện có trước khi thêm mới
        user.getUserHashtags().clear();

        // Thêm các UserHashtag mới
        for (Hashtag hashtag : hashtags) {
            UserHashtag userHashtag = new UserHashtag();
            userHashtag.setUser(user);
            userHashtag.setHashtag(hashtag);
            user.getUserHashtags().add(userHashtag);
        }

        return userMapper.accountToAccountDTO(userRepository.save(user));
    }

    @Override
    public UserDTO createImageUser(UserCreateImageRequest request) {
        User user = getUserById(request.getUserId());

        if (user == null) {
            throw new ElementNotFoundException("User not found");
        }
        user.setAvatar(request.getImageUrl());
        return userMapper.accountToAccountDTO(userRepository.save(user));
    }


}
