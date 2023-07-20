package com.mazinger.bpm.model.enumtype;

import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 表單權限 Enum
 * 
 * @author Mueller Tsai
 */
@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum FormPrivilegeEnum {

    EDIT("EDIT", "編輯"), APPROVE("APPROVE", "審批"), ADD_REVIEWERS("ADD_REVIEWERS", "加會簽"),
    REVIEW("REVIEW", "會簽"), REEDIT("REEDIT", "重新編輯"), REAUDIT("REAUDIT", "重審"),

    QA("QA", "品質管理"), QC("QC", "品質控制");

    private String code, display;

    FormPrivilegeEnum(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() {
        return this.code;
    }

    public String getDisplay() {
        return this.display;
    }

    /**
     * 由 code value 轉換為 enum type
     * 
     * @param code
     * @return
     */
    public static FormPrivilegeEnum fromCode(String code) {
        return StringUtils.isBlank(code) ? null
                : Stream.of(FormPrivilegeEnum.values()).filter(e -> e.getCode().equals(code)).findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("FormPrivilegeEnum code [" + code + "] 不支援!"));
    }
}
