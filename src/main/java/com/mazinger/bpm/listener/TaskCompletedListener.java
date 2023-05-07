package com.mazinger.bpm.listener;

import org.flowable.common.engine.api.delegate.event.FlowableEvent;
import org.flowable.common.engine.api.delegate.event.FlowableEventListener;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.delegate.BpmnError;
import org.flowable.engine.delegate.event.impl.FlowableEntityEventImpl;
import org.flowable.task.service.impl.persistence.entity.TaskEntityImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TaskCompletedListener implements FlowableEventListener {

    @Autowired
    private RuntimeService runtimeService;

    @Override
    public void onEvent(FlowableEvent event) {
        FlowableEntityEventImpl eventImpl = (FlowableEntityEventImpl) event;

        TaskEntityImpl task = (TaskEntityImpl) eventImpl.getEntity();

        log.info("[[ Task CREATED ]]  Var names: {}", task.getVariableNames());
        // log.info("[[ Task CREATED ]] LATEST REQUEST: {}", latestRequest);
        log.info("({}) {} => {} ({})", task.getName(), event.getType(), task.getAssignee());

        if (task != null) {
            throw new BpmnError("測試 MPB 流程失敗");
        }
    }

    @Override
    public boolean isFailOnException() {
        return true;
        // return false;
    }

    @Override
    public boolean isFireOnTransactionLifecycleEvent() {
        return true;
        // return false;
    }

    @Override
    public String getOnTransaction() {
        return null;
    }

}
