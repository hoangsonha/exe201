package com.hsh.project.service.spec;


import com.hsh.project.dto.internal.PagingResponse;

public interface BaseService<T, ID> {
    PagingResponse findAll(int currentPage, int pageSize);
    T findById(ID id);
    T save(T entity);
}