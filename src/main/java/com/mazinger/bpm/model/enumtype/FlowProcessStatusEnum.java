package com.mazinger.bpm.model.enumtype;

import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * BPM 流程狀態 Enum
 * 
 * @author Mueller Tsai
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum FlowProcessStatusEnum {

    COMPLETED("COMPLETED", "完成"),
    APPROVED("APPROVED", "通過"),
    REJECTED("REJECTED", "退回");

    private String code, display;

    FlowProcessStatusEnum(String code, String display) {
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
    public static FlowProcessStatusEnum fromCode(String code) {
        return StringUtils.isBlank(code) ? null
                : Stream.of(FlowProcessStatusEnum.values()).filter(e -> e.getCode().equals(code)).findFirst()
                        .orElseThrow(
                                () -> new IllegalArgumentException("FlowProcessStatusEnum code [" + code + "] 不支援!"));
    }
}
