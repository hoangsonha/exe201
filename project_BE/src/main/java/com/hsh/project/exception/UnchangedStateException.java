package com.hsh.project.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UnchangedStateException extends RuntimeException {
    private String message;

    public UnchangedStateException(String message) {
        this.message = message;
    }
}
