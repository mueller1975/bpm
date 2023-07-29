package com.mazinger.bpm.conf;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.flowable.cmmn.spring.SpringCmmnEngineConfiguration;
import org.flowable.engine.impl.cfg.JtaProcessEngineConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.jta.JtaTransactionManager;

@Configuration
public class BpmContext {

    // @Bean
    // JtaProcessEngineConfiguration processEngineConfiguration(@Qualifier("bpmDataSource") DataSource dataSource,
    //         @Qualifier("jtaTransactionManager") JtaTransactionManager transactionManager,
    //         @Qualifier("bpmEntityManagerFactory") EntityManagerFactory emf) {

    //     // SpringProcessEngineConfiguration conf = new
    //     // SpringProcessEngineConfiguration();
    //     // conf.setDataSource(dataSource);
    //     // conf.setTransactionManager(transactionManager);
    //     // conf.setJpaEntityManagerFactory(emf);
    //     // conf.setDatabaseSchemaUpdate(SpringProcessEngineConfiguration.DB_SCHEMA_UPDATE_FALSE);
    //     // conf.setJpaHandleTransaction(false);
    //     // conf.setJpaCloseEntityManager(false);

    //     JtaProcessEngineConfiguration conf = new JtaProcessEngineConfiguration();
    //     conf.setDataSource(dataSource);
    //     conf.setTransactionManager(transactionManager.getTransactionManager());
    //     conf.setDatabaseSchemaUpdate(JtaProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
    //     conf.setJpaEntityManagerFactory(emf);
    //     conf.setJpaHandleTransaction(false);
    //     conf.setJpaCloseEntityManager(false);

    //     return conf;
    // }

    // @Bean
    // SpringCmmnEngineConfiguration cmmnEngineConfiguration(@Qualifier("bpmDataSource") DataSource dataSource,
    //         @Qualifier("jtaTransactionManager") PlatformTransactionManager transactionManager) {

    //     SpringCmmnEngineConfiguration conf = new SpringCmmnEngineConfiguration();
    //     conf.setDataSource(dataSource);
    //     conf.setTransactionManager(transactionManager);
    //     conf.setDatabaseSchemaUpdate(SpringCmmnEngineConfiguration.DB_SCHEMA_UPDATE_FALSE);
    //     return conf;
    // }

}
