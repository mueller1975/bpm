package com.mazinger.app.model.dto;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

@Data
public class FormDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String taskId;

    private String taskDescription;

    private String data = "{}";

    private Date timestamp;

    public static FormDTO mock(Integer id) {
        FormDTO form = new FormDTO();
        form.setId(id);
        form.setTimestamp(new Date());
        return form;
    }
}
