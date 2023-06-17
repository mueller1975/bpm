package com.mazinger.app.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor()
@Data
public class ConfigDTO {

    private String code;

    private String description;

    private Object value;
}
