package com.hsh.project.mapper;

import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.pojo.Hashtag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HashtagMapper {

    @Mapping(source = "hashtagID", target = "id")
    @Mapping(source = "tag", target = "name")
    HashTagResponseDTO hashtagToUserHashtagResponse(Hashtag hashtag);

}
