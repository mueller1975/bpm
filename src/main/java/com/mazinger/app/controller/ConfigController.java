package com.mazinger.app.controller;

import java.util.Collection;
import java.util.List;

import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.dto.ResponseVO;
import com.mazinger.app.model.entity.Config;
import com.mazinger.app.model.service.ConfigService;

@RestController
@RequestMapping("/service/config")
public class ConfigController {

	@Autowired
	private ConfigService configService;

	@PostMapping("/saveForms")
	public Object saveFormConfigs(@RequestBody List<Config> entities) throws ServiceException {
		Iterable<Config> list = configService.saveAll(entities);
		return list;
	}

	@GetMapping("/mpbForms4Lab")
	public Object getMpbFormsForLab() throws ServiceException {
		Collection<?> voList = configService.findConfigsByCategory("MPB_FORM_LAB");
		return ResponseVO.succeed(voList);
	}
}
