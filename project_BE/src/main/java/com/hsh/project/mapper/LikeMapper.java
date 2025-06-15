package com.hsh.project.mapper;

import com.hsh.project.dto.response.*;
import com.hsh.project.pojo.Like;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LikeMapper {

    @Mapping(source = "likeID", target = "likeID")
    @Mapping(source = "user", target = "user") 
    LikeDTO toLikeDTO(Like like);

    List<LikeDTO> toLikeDTOs(List<Like> likes);
}