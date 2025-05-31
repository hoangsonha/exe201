package com.hsh.project.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterHashTagRequest {
    int userId;
    List<Integer> hashtagID;
}
