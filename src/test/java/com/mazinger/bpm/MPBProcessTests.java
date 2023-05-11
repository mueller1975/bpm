package com.mazinger.bpm;

import java.util.HashMap;
import java.util.Map;

import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.engine.test.FlowableTestCase;
import org.hibernate.service.spi.ServiceException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.mazinger.app.conf.AppContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest(classes = { AppContext.class })
// @ActiveProfiles("my") // 不可使用此 @ 指定 profile, 因程式裡有指定以 spring.profiles.active
// 去讀對應的設定檔
public class MPBProcessTests extends FlowableTestCase {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private RepositoryService repositoryService;

    // @Test
    public void testMail() {
        repositoryService.createDeployment().addClasspathResource("processes/MPBApprovalProcess3")
                .addClasspathResource("processes/MailTest.bpmn").deploy();

        Map<String, Object> vars = new HashMap<>();
        vars.put("to", "mueller_tsai@walsin.com");
        vars.put("subject", "MPB 表單簽核通知");
        // ProcessInstance instance =
        // runtimeService.startProcessInstanceByKey("mailTest", vars);

    }

    @Test
    public void testProcess() throws ServiceException {

        // repositoryService.createDeployment().addClasspathResource("processes/MPBApprovalProcess4.bpmn")
        // .addClasspathResource("processes/MailTest.bpmn").addClasspathResource("processes/AddReviewers.bpmn")
        // .deploy();

        Map<String, Object> vars = new HashMap<>();

        log.info("開始流程變數: {}", vars);

        ProcessInstance process = runtimeService.startProcessInstanceByKey("testProcess", vars);

        log.info("Process instance: {}", process.getId());
    }
}
