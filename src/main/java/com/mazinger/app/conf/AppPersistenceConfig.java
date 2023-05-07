package com.mazinger.app.conf;

import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import javax.transaction.SystemException;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jta.atomikos.AtomikosDataSourceBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.jta.JtaTransactionManager;

import com.atomikos.icatch.jta.UserTransactionImp;
import com.atomikos.icatch.jta.UserTransactionManager;

@Configuration
@EnableJpaRepositories(basePackages = { "com.mazinger.app.model.dao"
}, entityManagerFactoryRef = "prjEntityManagerFactory", transactionManagerRef = "jtaTransactionManager")
public class AppPersistenceConfig {

    @Primary
    @DependsOn({ "jtaTransactionManager" })
    @Bean(initMethod = "init", destroyMethod = "close")
    @ConfigurationProperties("app.datasource")
    DataSource prjDataSource() {
        return new AtomikosDataSourceBean();
    }

    @Bean
    LocalContainerEntityManagerFactoryBean prjEntityManagerFactory(
            @Qualifier("prjDataSource") DataSource dataSource,
            @Qualifier("prjHibernateProperties") Properties hibernateProperties) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan(
                new String[] { "com.mazinger.app.model.entity" });

        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        em.setJpaProperties(hibernateProperties);

        return em;
    }

    @Bean(initMethod = "init", destroyMethod = "close")
    UserTransactionManager userTransactionManager() throws SystemException {
        UserTransactionManager userTransactionManager = new UserTransactionManager();
        userTransactionManager.setForceShutdown(true);

        return userTransactionManager;
    }

   @Primary
    @Bean
    JtaTransactionManager jtaTransactionManager() throws SystemException {
        JtaTransactionManager jtaTransactionManager = new JtaTransactionManager();
        jtaTransactionManager.setTransactionManager(userTransactionManager());

        UserTransactionImp userTransaction = new UserTransactionImp();
//        userTransaction.setTransactionTimeout(60);
        
        jtaTransactionManager.setUserTransaction(userTransaction);
        jtaTransactionManager.setDefaultTimeout(120); // 設定 default transaction timeout, 未設定則為 30 秒
        return jtaTransactionManager;
    }

    @Bean
    PlatformTransactionManager prjTransactionManager(
            @Qualifier("prjEntityManagerFactory") EntityManagerFactory emf) {

        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(emf);
        return transactionManager;
    }

    @Bean
    Properties prjHibernateProperties(@Value("${app.hibernate.dialect}") String dialect,
            @Value("${app.hibernate.show_sql}") String showSQL,
            @Value("${app.hibernate.format_sql}") String formatSQL) {

        Properties properties = new Properties();
        properties.setProperty("hibernate.dialect", dialect);
        properties.setProperty("hibernate.show_sql", showSQL);
        properties.setProperty("hibernate.format_sql", formatSQL);
        properties.setProperty("javax.persistence.transactionType", "JTA"); // *** 一定要加這屬性, 否則無法寫入 DB

        return properties;
    }
}
