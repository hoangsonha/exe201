package com.hsh.project.repository;

import com.hsh.project.pojo.Comment;
import com.hsh.project.pojo.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

}
