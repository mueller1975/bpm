package com.mazinger.bpm.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class FlowMember implements Serializable {

    private static final long serialVersionUID = 1L;

    private String empId;

    private String name;

    private String email;

    private Integer signLevel;

    private List<FlowMember> reportingLine;
}
