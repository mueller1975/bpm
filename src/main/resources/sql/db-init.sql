CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.leave (
	id integer NOT NULL,
	task_id varchar(40) NOT NULL,
	task_description varchar(50),
	reason varchar(100),
	primary key(id)
);

CREATE TABLE IF NOT EXISTS app.config (
	code varchar(60) NOT NULL,
	category varchar(60),
	value_ text, -- value 是 h2 保留字, 不可使用為欄位名稱
	description varchar(200),
	primary key(code)
);