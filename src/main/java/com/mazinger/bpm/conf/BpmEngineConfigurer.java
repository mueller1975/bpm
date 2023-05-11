package com.mazinger.bpm.conf;

import javax.sql.DataSource;

import org.flowable.spring.SpringProcessEngineConfiguration;
import org.flowable.spring.boot.EngineConfigurationConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class BpmEngineConfigurer implements EngineConfigurationConfigurer<SpringProcessEngineConfiguration> {

    @Qualifier("bpmDataSource")
    @Autowired
    private DataSource dataSource;

    @Qualifier("jtaTransactionManager")
    @Autowired
    private PlatformTransactionManager transactionManager;

    @Override
    public void configure(SpringProcessEngineConfiguration engineConf) {
        SpringProcessEngineConfiguration conf = (SpringProcessEngineConfiguration) engineConf.getProcessEngineConfiguration();

        // conf.setDataSource(dataSource);
        conf.setTransactionManager(transactionManager);
        log.info("conf: {}", conf);
    }
}