package com.mazinger.app.conf;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * 應用系統設定
 * 
 * @author Mueller Tsai
 */
@Configuration
@ComponentScan("com.mazinger")
public class AppContext {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
