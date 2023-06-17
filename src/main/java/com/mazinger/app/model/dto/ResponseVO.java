package com.mazinger.app.model.dto;

import lombok.Data;

@Data
public class ResponseVO {

    public static final int DEFAULT_FAIL_CODE = 100;
    protected int code;
    protected Object data;

    public ResponseVO() {
    }

    public ResponseVO(int code, Object data) {
        this.code = code;
        this.data = data;
    }

    public static ResponseVO succeed() {
        return new ResponseVO(0, "SUCCESS");
    }

    public static ResponseVO succeed(Object data) {
        return new ResponseVO(0, data);
    }

    public static ResponseVO fail(int code, Object data) {
        return new ResponseVO(code, data);
    }

    public static ResponseVO fail(Object data) {
        return new ResponseVO(DEFAULT_FAIL_CODE, data);
    }

    public static ResponseVO fail(Throwable e) {
        String message = e.getMessage();

        if (e.getCause() != null) {
            message = String.format("%s (%s)", message, e.getCause().getMessage());
        }

        return new ResponseVO(DEFAULT_FAIL_CODE, message);
    }
}
