package com.mazinger.bpm.conf;

import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jta.atomikos.AtomikosDataSourceBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class BpmPersistenceConfig {

    // @Primary
    @DependsOn({ "jtaTransactionManager" })
    @Bean(initMethod = "init", destroyMethod = "close")
    @ConfigurationProperties("bpm.datasource")
    DataSource bpmDataSource() {
        return new AtomikosDataSourceBean();
    }

    @Primary // for injection into FlowableJpaAutoConfiguration
    @Bean
    LocalContainerEntityManagerFactoryBean bpmEntityManagerFactory(
            @Qualifier("bpmDataSource") DataSource dataSource,
            @Qualifier("bpmHibernateProperties") Properties hibernateProperties) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan();

        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        em.setJpaProperties(hibernateProperties);

        return em;
    }

    @Primary // for injection into ProcessEngineAutoConfiguration
    @Bean
    PlatformTransactionManager bpmTransactionManager(@Qualifier("bpmEntityManagerFactory") EntityManagerFactory emf) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(emf);
        return transactionManager;
    }

    @Bean
    Properties bpmHibernateProperties(@Value("${bpm.hibernate.dialect}") String dialect,
            @Value("${bpm.hibernate.show_sql}") String showSQL,
            @Value("${bpm.hibernate.format_sql}") String formatSQL) {

        Properties properties = new Properties();
        properties.setProperty("hibernate.dialect", dialect);
        properties.setProperty("hibernate.show_sql", showSQL);
        properties.setProperty("hibernate.format_sql", formatSQL);
//        properties.setProperty("javax.persistence.transactionType", "JTA"); // *** 一定要加這屬性, 否則無法寫入 DB

        return properties;
    }
}
