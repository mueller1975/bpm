package com.mazinger.app.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mazinger.app.model.dao.ConfigRepository;
import com.mazinger.app.model.entity.Config;

@Service
public class ConfigService {

    @Autowired
    private ConfigRepository configDAO;

    public List<Config> findConfigsByCategory(String category) {
        return configDAO.findByCategory(category);
    }
}
