package com.mazinger.bpm.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="leave", schema="hr")
@Data
public class Leave {
    @Id
    private Integer id;

    @Column(name = "task_id")
    private String taskId;

    @Column(name="task_description")
    private String taskDescription;

    @Column
    private String reason;
}