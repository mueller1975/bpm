package com.mazinger.bpm;

import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.runtime.ProcessInstance;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.mazinger.app.conf.AppContext;

@SpringBootTest(classes = { AppContext.class })
class BpmApplicationTests {

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;

	@Test
	void contextLoads() {

		ProcessInstance pInstance = runtimeService.startProcessInstanceByKey("test", null, null);
	}

}
