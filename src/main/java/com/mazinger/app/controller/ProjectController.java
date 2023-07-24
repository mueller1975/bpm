package com.mazinger.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.dto.FormDTO;
import com.mazinger.app.model.dto.FormResponseDTO;
import com.mazinger.app.model.entity.Form;
import com.mazinger.app.model.service.FormService;
import com.mazinger.bpm.model.FlowUserTask;
import com.mazinger.web.ServiceResponseDTO;

@RestController
@RequestMapping("/service/mpb")
public class ProjectController {

    @Autowired
    private FormService formService;

    /**
     * 查詢表單資訊
     * 
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Object find(@PathVariable("id") Integer id) {
        FormDTO form = FormDTO.mock(id);
        FlowUserTask userTask = FlowUserTask.mock("mazinger");

        FormResponseDTO dto = new FormResponseDTO(form, userTask);
        return ServiceResponseDTO.succeed(dto);
    }

    @PostMapping("/")
    public Object save(FormDTO dto) {
        Form entity = formService.save(dto);
        return ServiceResponseDTO.succeed(entity);
    }
}
