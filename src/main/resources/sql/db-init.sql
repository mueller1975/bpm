CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.leave (
	id integer NOT NULL,
	task_id varchar(40) NOT NULL,
	task_description varchar(50),
	reason varchar(100),
	primary key(id)
);

CREATE TABLE IF NOT EXISTS app.form_config (
	code varchar(60) NOT NULL,
	category varchar(60),
	`value` text, -- value 是保留字, 須置於 `` 中
	description varchar(200),
	creator varchar(60),
	modifier varchar(60),
	primary key(code)
);