package com.mazinger.app.controller;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazinger.app.model.dto.ResponseVO;
import com.mazinger.app.model.entity.Config;
import com.mazinger.app.model.exception.ServiceException;
import com.mazinger.app.model.service.ConfigService;

@RestController
@RequestMapping("/service/config")
public class ConfigController {

	@Autowired
	private ConfigService configService;

	@GetMapping
	public Object getConfigValue(String code) throws ServiceException {
		Config dto = configService.getConfigByCode(code);

		return dto != null ? dto.getValue() : null;
	}

	@PostMapping("/saveForms")
	public Object saveFormConfigs(@RequestBody List<Config> entities) throws ServiceException {
		Iterable<Config> list = configService.saveAll(entities);
		return list;
	}

	@GetMapping("/mpbForms4Lab")
	public Object getMpbFormsForLab() throws ServiceException {
		Collection<?> voList = configService.getConfigsByCategory("MPB_FORM_LAB");
		return ResponseVO.succeed(voList);
	}

	@GetMapping("/{category}")
	public Object getConfigsByCategory(@PathVariable String category) throws ServiceException {
		Collection<Object> configs = configService.getConfigsByCategory(category);
		return configs;
	}

	@GetMapping("/dropdowns")
	public Object getDropdowns() throws ServiceException {
		Collection<Object> voList = configService.getConfigsByCategory("DROPDOWN");
		Collection<Object> voList2 = configService.getConfigsByCategory("ICON_DROPDOWN");

		voList.addAll(voList2);
		return voList;
	}

	@GetMapping("/iconDropdowns")
	public Object getIconDropdowns() throws ServiceException {
		Collection<?> voList = configService.getConfigsByCategory("ICON_DROPDOWN");
		return voList;
	}

	@GetMapping("/hierarchicalDropdowns")
	public Object getHierarchicalDropdowns() throws ServiceException {
		Collection<?> voList = configService.getConfigsByCategory("HIERARCHICAL_DROPDOWN");
		return voList;
	}

	@GetMapping("/mpbForms")
	public Object getMpbForms() throws ServiceException {
		Collection<?> voList = configService.getConfigsByCategory("MPB_FORM");
		return voList;
	}
}
