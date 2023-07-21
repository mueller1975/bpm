package com.mazinger.app.model.dto;

import com.mazinger.bpm.model.FlowUserTask;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class FormResponseDTO {

    private FormDTO form;

    // Flowable user task
    private FlowUserTask flowUserTask;
}
