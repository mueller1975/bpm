package com.mazinger.app.controller;

import java.util.Collection;

import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.service.ConfigService;

@RestController
@RequestMapping("/service/config")
public class ConfigController {

	@Autowired
	private ConfigService configService;

	@GetMapping("/mpbForms4Lab")
	public Object getMpbFormsForLab() throws ServiceException {
		Collection<?> voList = configService.findConfigsByCategory("MPB_FORM_LAB");
		return voList;
	}
}
