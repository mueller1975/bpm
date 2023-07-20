package com.mazinger.bpm.model;

import lombok.Data;

@Data
public class FlowApproval {

    private FlowMember approver;

    private FlowActionRequest actionRequest;

}
