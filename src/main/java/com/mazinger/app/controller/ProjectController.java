package com.mazinger.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.dto.FormDTO;
import com.mazinger.bpm.model.FlowUserTask;

@RestController
@RequestMapping("/service/mpb")
public class ProjectController {
    /**
     * 查詢 MPB 澄清單
     * 
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Object find(@PathVariable("id") String id) {
        FormDTO form = new FormDTO();

        FlowUserTask userTask = new FlowUserTask();
        form.setFlowUserTask(userTask);
        return form;
    }
}
