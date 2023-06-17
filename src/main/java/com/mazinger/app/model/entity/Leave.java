package com.mazinger.app.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="leave", schema="app")
@Data
public class Leave {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "task_id")
    private String taskId;

    @Column(name="task_description")
    private String taskDescription;

    @Column
    private String reason;
}