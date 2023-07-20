package com.mazinger.bpm.model;

import java.io.Serializable;

import com.mazinger.app.model.dto.FormDTO;
import com.mazinger.bpm.model.dto.NoticeDTO;
import com.mazinger.bpm.model.enumtype.FlowActionEnum;

import lombok.Data;

@Data
public class FlowActionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private FlowActionEnum action;

    private String flowTaskId;

    private Object comments;

    private NoticeDTO notice;

    private FormDTO form;

    private boolean formUpdateNeeded;
}
