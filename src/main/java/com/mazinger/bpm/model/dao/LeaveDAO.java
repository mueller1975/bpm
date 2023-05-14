package com.mazinger.bpm.model.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.mazinger.bpm.model.entity.Leave;

@Repository
public interface LeaveDAO extends CrudRepository<Leave,Integer> {
    
}
