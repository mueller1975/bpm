package com.mazinger.app.model.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "form", schema = "app")
@Data
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "task_id")
    private String taskId;

    @Column(name = "task_description")
    private String taskDescription;

    @Column(name = "data_")
    private String data;

    @Column(name = "timestamp_")
    private Date timestamp;
}
