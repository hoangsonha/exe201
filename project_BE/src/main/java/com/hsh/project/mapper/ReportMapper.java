package com.hsh.project.mapper;

import com.hsh.project.dto.response.ReportResponseDTO;
import com.hsh.project.pojo.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    ReportMapper INSTANCE = Mappers.getMapper(ReportMapper.class);

    @Mapping(target = "reviewId", expression = "java(report.getReview() != null ? report.getReview().getReviewID() : null)")
    @Mapping(target = "userId", expression = "java(report.getUser() != null ? report.getUser().getUserId() : null)")
    @Mapping(target = "status", expression = "java(report.getStatus() != null ? report.getStatus().name() : null)")
    ReportResponseDTO toDTO(Report report);

    List<ReportResponseDTO> toDTOs(List<Report> reports);
}
