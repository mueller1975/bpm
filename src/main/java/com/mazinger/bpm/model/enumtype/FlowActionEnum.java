package com.mazinger.bpm.model.enumtype;

import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;

/**
 * MPB Request 動作 enum type
 * 
 * @author Mueller Tsai
 */
public enum FlowActionEnum {

    SAVE("SAVE", "儲存"), APPLY("APPLY", "提交"), REAUDIT("REAUDIT", "發起重審"),
    AGREE("AGREE", "同意"), DISAGREE("DISAGREE", "不同意"),
    ADD_REVIEWERS("ADD_REVIEWERS", "發起會簽"), REVIEW("REVIEW", "會簽"),

    // 以下 4 actions 由系統使用
    FINISH_REVIEW("FINISH_REVIEW", "完成會簽"), FAIL("FAIL", "審批失敗"),
    APPROVE("APPROVE", "審批通過"), REJECT("REJECT", "審批不通過"),

    TRIGGER_CLARIFICATION("TRIGGER_CLARIFICATION", "觸發訂單澄清"), TRIGGER_QA_REVIEW("TRIGGER_QA_REVIEW", "觸發品保審單Y"),
    START_CLARIFICATION("START_CLARIFICATION", "訂單需重新澄清"), CLARIFY("CLARIFY", "訂單已澄清"), CONFIRM("CONFIRM", "訂單成立"),
    IMPORT("IMPORT", "手動匯入");

    private String code, display;

    FlowActionEnum(String code, String display) {
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
    public static FlowActionEnum fromCode(String code) {
        return StringUtils.isBlank(code) ? null
                : Stream.of(FlowActionEnum.values()).filter(e -> e.getCode().equals(code)).findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("MPBActionEnum code [" + code + "] 不支援!"));
    }
}
