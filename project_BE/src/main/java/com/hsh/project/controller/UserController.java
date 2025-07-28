package com.hsh.project.controller;

import com.hsh.project.dto.UserDTO;
import com.hsh.project.dto.internal.ObjectResponse;
import com.hsh.project.dto.internal.PagingResponse;
import com.hsh.project.dto.request.*;
import com.hsh.project.dto.response.ReviewResponseDTO;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementExistException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.User;
import com.hsh.project.service.spec.ReviewService;
import com.hsh.project.service.spec.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Các hoạt động liên quan đến quản lý người dùng")
public class UserController {

    private final UserService userService;
    private final ReviewService reviewService;

    @Value("${application.default-current-page}")
    private int defaultCurrentPage;

    @Value("${application.default-page-size}")
    private int defaultPageSize;

    // get all review when user login in homepage by user interesting of hashtag
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{user-id}/reviews")
    public ResponseEntity<ObjectResponse> getAllReviewByUser(@PathVariable("user-id") Long userId) {
        List<ReviewResponseDTO> user = reviewService.getReviewsByUserHashtags(userId);
        return !user.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Get user by ID successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "Get user by ID failed", null));
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{user-id}/saved-reviews")
    public ResponseEntity<ObjectResponse> getAllReviewSaved(@PathVariable("user-id") Long userId) {
        List<ReviewResponseDTO> user = reviewService.getReviewSavedByUserId(userId);
        return !user.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Get review saved successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "Get review saved failed", null));
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{user-id}/my-reviews")
    public ResponseEntity<ObjectResponse> getAllMyReview(@PathVariable("user-id") Long userId) {
        List<ReviewResponseDTO> user = reviewService.getMyReview(userId);
        return !user.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "Get my review successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "Get my review failed", null));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping("")
    public ResponseEntity<PagingResponse> getAllUsers(
            @RequestParam(value = "currentPage", required = false) Integer currentPage,
            @RequestParam(value = "pageSize", required = false) Integer pageSize) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;
        PagingResponse results = userService.getAllAccountPaging(resolvedCurrentPage, resolvedPageSize);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/image")
    public ResponseEntity<ObjectResponse> createImageUser(@RequestBody UserCreateImageRequest request) {
        UserDTO result = userService.createImageUser(request);
        return result != null
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "create image for user successfully", result))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "create image for user failed", null));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/hashtags")
    public ResponseEntity<ObjectResponse> createHashTagUser(@RequestBody UserRegisterHashTagRequest request) {
        UserDTO result = userService.createHashTagUser(request);
        return result != null
                ? ResponseEntity.status(HttpStatus.OK)
                .body(new ObjectResponse("Success", "create hashtag for user successfully", result))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ObjectResponse("Failed", "create hashtag for user failed", null));
    }

//    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
//    @GetMapping("/{id}/reviews")
//    public ResponseEntity<ObjectResponse> getAllReviewByUser(@RequestBody UserRegisterHashTagRequest request) {
//        UserDTO result = userService.getAllReviewByUser(request);
//        return result != null
//                ? ResponseEntity.status(HttpStatus.OK)
//                .body(new ObjectResponse("Success", "create hashtag for user successfully", result))
//                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(new ObjectResponse("Failed", "create hashtag for user failed", null));
//    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/non-paging")
    public ResponseEntity<ObjectResponse> getAllUsersNonPaging() {
        List<UserDTO> results = userService.getAccounts();
        return !results.isEmpty()
                ? ResponseEntity.status(HttpStatus.OK)
                        .body(new ObjectResponse("Success", "get all user non paging successfully", results))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ObjectResponse("Failed", "get all user non paging failed", results));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<PagingResponse> searchUser(
            @RequestParam(value = "currentPage", required = false) Integer currentPage,
            @RequestParam(value = "pageSize", required = false) Integer pageSize,
            @RequestParam(value = "userName", required = false, defaultValue = "") String userName,
            @RequestParam(value = "fullName", required = false, defaultValue = "") String fullName,
            @RequestParam(value = "email", required = false, defaultValue = "") String email) {
        int resolvedCurrentPage = (currentPage != null) ? currentPage : defaultCurrentPage;
        int resolvedPageSize = (pageSize != null) ? pageSize : defaultPageSize;

        PagingResponse results = userService.searchUsers(resolvedCurrentPage, resolvedPageSize, userName,
                fullName, email);
        List<?> data = (List<?>) results.getData();
        return ResponseEntity.status(!data.isEmpty() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(results);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('STAFF') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ObjectResponse> getUserByID(@PathVariable("id") int id) {
        UserDTO user = userService.getAccountById(id);
        return user != null
                ? ResponseEntity.status(HttpStatus.OK)
                        .body(new ObjectResponse("Success", "Get user by ID successfully", user))
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ObjectResponse("Fail", "Get user by ID failed", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<ObjectResponse> createuser(@Valid @RequestBody CreateUserRequest req) {
        try {
            UserDTO user = userService.createUser(req);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ObjectResponse("Success", "Create user successfully", user));
        } catch (BadRequestException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementExistException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Create user failed", null));
        }
    }

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public ResponseEntity<ObjectResponse> updateUserRole(@PathVariable("id") int id,
            @RequestBody UpdateUserRoleRequest req) {
        try {
            UserDTO user = userService.updateUserRole(req, id);
            if (user != null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ObjectResponse("Success", "Update user successfully", user));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update user failed. user is null", null));
        } catch (BadRequestException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementExistException e) {
            log.error("Error while updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error while updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update user failed. user not found", null));
        } catch (Exception e) {
            log.error("Error updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update user failed", null));
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<ObjectResponse> updateUser(@PathVariable("id") int id,
                                                     @RequestBody UpdateUserRequest req) {
        try {
            UserDTO user = userService.updateUser(req, id);
            if (user != null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ObjectResponse("Success", "Update user successfully", user));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update user failed. user is null", null));
        } catch (BadRequestException e) {
            log.error("Error creating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementExistException e) {
            log.error("Error while updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error while updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update user failed. user not found", null));
        } catch (Exception e) {
            log.error("Error updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update user failed", null));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ObjectResponse> deleteUserByID(@PathVariable("id") int userID) {
        try {
            User user = userService.getUserById(userID);
            if (user != null) {
                user.setDeleted(true);
                user.setEnabled(false);
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ObjectResponse("Success", "Delete user successfully", userService.saveUser(user)));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Delete user failed", null));
        } catch (Exception e) {
            log.error("Error deleting user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Delete user failed", null));
        }
    }

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @PostMapping("/{id}/restore")
    public ResponseEntity<ObjectResponse> unDeleteUserByID(@PathVariable("id") int id) {
        try {
            User user = userService.getUserById(id);
            if (user != null) {
                user.setDeleted(false);
                user.setEnabled(true);
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ObjectResponse("Success", "UnDelete user successfully", userService.saveUser(user)));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "user is null", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Undelete user failed", null));
        }
    }

   @PutMapping("/premium/{id}/username")
    public ResponseEntity<ObjectResponse> updatePremiumUserName(@PathVariable("id") int id,
                                                               @RequestBody UpdateUserNameRequest req) {
        try {
            // Kiểm tra nếu người dùng có gói đăng ký cao cấp (subscription ID = 11)
            User user = userService.getUserById(id);
            if (user == null) {
                throw new ElementNotFoundException("User not found");
            }
            if (user.getSubscriptions() == null || !user.getSubscriptions().equals(11L)) {
                throw new BadRequestException("Only premium users with subscription ID 11 can update their username");
            }

            UserDTO updatedUser = userService.updateUserName(id, req.getUserName());
            if (updatedUser != null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ObjectResponse("Success", "Update premium username successfully", updatedUser));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update premium username failed. user is null", null));
        } catch (BadRequestException e) {
            log.error("Error updating premium username", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementExistException e) {
            log.error("Error while updating premium username", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ObjectResponse("Fail", e.getMessage(), null));
        } catch (ElementNotFoundException e) {
            log.error("Error while updating premium username", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update premium username failed. user not found", null));
        } catch (Exception e) {
            log.error("Error updating premium username", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ObjectResponse("Fail", "Update premium username failed", null));
        }
    }

}
