package com.mazinger.app.model.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mazinger.app.model.dao.FormDAO;
import com.mazinger.app.model.dto.FormDTO;
import com.mazinger.app.model.entity.Form;

@Service("mtFormService")
public class FormService {

    @Autowired
    private FormDAO formDAO;

    @Autowired
    private ModelMapper modelMapper;

    public Form get(Integer id) {
        Form entity = formDAO.findById(id).orElse(null);
        return entity;
    }

    public Form save(FormDTO dto) {
        Form entity = modelMapper.map(dto, Form.class);
        entity = formDAO.save(entity);
        return entity;
    }
}
