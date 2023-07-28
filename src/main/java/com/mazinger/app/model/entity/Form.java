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

    @Column(name = "approval_status")
    private String approvalStatus;

    @Column(name = "json_data")
    private String jsonData;

    @Column(name="product_category")
    private String productCategory;

    @Column(name="product_no")
    private String productNo;

    @Column(name="order_no")
    private String orderNo;

    @Column(name="client_no")
    private String clientNo;

    @Column(name="clientName")
    private String clientName;

    @Column(name = "timestamp_")
    private Date timestamp;
}
