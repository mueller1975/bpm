package com.walsin.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;

public abstract class AbstractServiceController {

	private String baseUri = "";

	public AbstractServiceController() {
		RequestMapping mapping = this.getClass().getAnnotation(RequestMapping.class);

		if (mapping != null && mapping.value().length > 0) {
			baseUri = mapping.value()[0];
		}
	}

	public String getBaseUri() {
		return this.baseUri;
	}
}
