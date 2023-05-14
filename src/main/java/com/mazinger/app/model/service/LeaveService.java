package com.mazinger.app.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mazinger.app.model.dao.LeaveDAO;
import com.mazinger.app.model.entity.Leave;

@Service
public class LeaveService {
    @Autowired
    private LeaveDAO leaveDAO;

    @Transactional(transactionManager = "jtaTransactionManager", rollbackFor = Exception.class)
    public Leave save(Leave leave) {
        Leave entity = leaveDAO.save(leave);
        return entity;
    }
}
