package com.mazinger.bpm.listener;

import org.flowable.common.engine.api.delegate.event.FlowableEvent;
import org.flowable.common.engine.api.delegate.event.FlowableEventListener;
import org.flowable.common.engine.api.delegate.event.FlowableEventType;
import org.flowable.common.engine.impl.event.FlowableEntityEventImpl;
import org.flowable.task.service.impl.persistence.entity.TaskEntityImpl;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 監聽 Task 建立
 * 
 * @author Mueller Tsai
 */
@Slf4j
@Component
public class TaskCreatedListener implements FlowableEventListener {

    @Override
    public void onEvent(FlowableEvent event) {
        // TODO Auto-generated method stub
        FlowableEntityEventImpl eventImpl = (FlowableEntityEventImpl) event;
        FlowableEventType type = eventImpl.getType();

        TaskEntityImpl task = (TaskEntityImpl) eventImpl.getEntity();

    }

    @Override
    public boolean isFailOnException() {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean isFireOnTransactionLifecycleEvent() {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public String getOnTransaction() {
        // TODO Auto-generated method stub
        return null;
    }

}
