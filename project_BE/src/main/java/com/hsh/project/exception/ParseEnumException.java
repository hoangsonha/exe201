package com.hsh.project.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ParseEnumException extends RuntimeException {

    private String message;

    public ParseEnumException(String message) {
        this.message = message;
    }

}
