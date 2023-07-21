package com.mazinger.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.dto.FormDTO;
import com.mazinger.app.model.dto.FormResponseDTO;
import com.mazinger.bpm.model.FlowUserTask;
import com.mazinger.web.ServiceResponseDTO;

@RestController
@RequestMapping("/service/mpb")
public class ProjectController {
    /**
     * 查詢表單資訊
     * 
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Object find(@PathVariable("id") String id) {
        FormDTO form = FormDTO.mock(id);
        FlowUserTask userTask = FlowUserTask.mock("mazinger");

        FormResponseDTO dto = new FormResponseDTO(form, userTask);
        return ServiceResponseDTO.succeed(dto);
    }
}
