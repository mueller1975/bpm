package com.mazinger.app.model.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import lombok.Data;

@Data
public class FormDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String tenantId;

    private String flowProcessId;

    private String flowProcessTask;

    private String mpbName;

    private String mpbNo;

    private Integer mpbVersion;

    private String mpbSource;

    private String salesNoticeNo;

    private String salesNoticeLineNo;

    private String salesArea;

    private String salesman;

    private String salesmanName;

    private String salesmanDept;

    private String salesmanDeptName;

    private String clientNo;

    private String clientName;

    private String mpbData;

    // @JsonIgnore
    private Map<String, Object> mpbDataObj;

    private String creatorName;

    private Date timestamp;

    public static FormDTO mock(String id) {
        FormDTO form = new FormDTO();
        form.setId(id);

        return form;
    }
}
