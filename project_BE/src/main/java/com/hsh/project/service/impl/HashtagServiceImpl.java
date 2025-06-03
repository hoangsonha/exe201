package com.hsh.project.service.impl;

import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.mapper.HashtagMapper;
import com.hsh.project.repository.HashtagRepository;
import com.hsh.project.service.spec.HashtagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HashtagServiceImpl implements HashtagService {

    private final HashtagRepository hashtagRepository;
    private final HashtagMapper hashTagMapper;

    @Override
    public List<HashTagResponseDTO> getHashtags() {
        return hashtagRepository.findAll().stream().map(hashTagMapper::hashtagToUserHashtagResponse).collect(Collectors.toList());
    }
}
