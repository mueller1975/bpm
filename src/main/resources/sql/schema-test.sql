CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.leave (
	ID int IDENTITY(1,1) NOT NULL,
	task_id varchar(40) NOT NULL,
	task_description varchar(50),
	reason varchar(100)
);

CREATE TABLE app.form_config (
  code varchar(60) NOT NULL,
  category varchar(60) DEFAULT NULL,
  value clob,
  description varchar(200) DEFAULT NULL,
  creator varchar(60) DEFAULT NULL,
  modifier varchar(60) DEFAULT NULL,
  create_time timestamp DEFAULT NULL,
  modify_time timestamp DEFAULT NULL
);