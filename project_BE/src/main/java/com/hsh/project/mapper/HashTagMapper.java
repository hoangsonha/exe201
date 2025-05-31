package com.hsh.project.mapper;

import com.hsh.project.dto.response.HashTagResponseDTO;
import com.hsh.project.pojo.Hashtag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HashTagMapper {

    @Mapping(source = "hashtagID", target = "hashTagID")
    @Mapping(source = "tag", target = "tag")
    HashTagResponseDTO hashTagToUserHashTagResponse(Hashtag hashtag);

}
