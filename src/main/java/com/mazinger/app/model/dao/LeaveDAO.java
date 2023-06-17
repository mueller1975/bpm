package com.mazinger.app.model.dao;

import org.springframework.data.repository.CrudRepository;

import com.mazinger.app.model.entity.Leave;

public interface LeaveDAO extends CrudRepository<Leave,Integer> {
    
}
