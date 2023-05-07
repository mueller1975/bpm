CREATE SCHEMA IF NOT EXISTS hr;
	
CREATE TABLE IF NOT EXISTS hr.task (
	id int IDENTITY(1,1) NOT NULL,
	task_id varchar(40) NOT NULL,
	task_description varchar(50) NOT NULL);
	