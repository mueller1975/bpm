package com.mazinger.app.model.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.mazinger.app.model.entity.Leave;

@Repository
public interface LeaveDAO extends CrudRepository<Leave,Integer> {
    
}
