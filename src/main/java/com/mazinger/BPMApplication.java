package com.mazinger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import com.mazinger.conf.AppContext;

@SpringBootApplication
public class BPMApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(BPMApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(AppContext.class);
	}

}
