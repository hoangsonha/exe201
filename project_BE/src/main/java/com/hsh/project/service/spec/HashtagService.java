package com.hsh.project.service.spec;

import com.hsh.project.dto.response.HashTagResponseDTO;

import java.util.List;

public interface HashtagService {
    List<HashTagResponseDTO> getHashtags();
}
