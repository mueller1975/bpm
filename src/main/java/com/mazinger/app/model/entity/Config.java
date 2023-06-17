package com.mazinger.app.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "config", schema = "app")
public class Config {

	@Id
	private String code;

	@Column
	private String category;

	@Column(name = "value_")
	private String value;

	@Column
	private String description;
}
