CREATE SCHEMA IF NOT EXISTS dbo;
CREATE SCHEMA IF NOT EXISTS walsindba;

CREATE TABLE IF NOT EXISTS dbo.USER_ORG (
	LOCACOD varchar(6) NULL,
	EMPID varchar(20) NOT NULL,
	NAME nvarchar(50) NULL,
	JOB varchar(40) NULL,
	COSTNO varchar(10) NULL,
	COSTNAM varchar(50) NULL,
	STRKND varchar(2) NULL,
	TITLE varchar(40) NULL,
	TITKND varchar(40) NULL,
	AREA varchar(10) NULL,
	BG varchar(40) NULL,
	BU varchar(40) NULL,
	OU varchar(40) NULL,
	CENCOD varchar(10) NULL,
	CENNAM varchar(50) NULL,
	FEECOD varchar(2) NULL,
	FEENAME varchar(10) NULL,
	TYPNAME varchar(10) NULL,
	STKNAM varchar(20) NULL,
	LEAVNAM varchar(50) NULL,
	TITNAM varchar(50) NULL,
	POSTNAM varchar(50) NULL,
	COMPANY varchar(10) NULL,
	PLANT varchar(4) NULL,
	NOTESID varchar(100) NULL,
	EMAIL varchar(100) NULL);
	
CREATE TABLE IF NOT EXISTS walsindba.AUTH_APPLICATION(
	CODE varchar(50) NOT NULL,
	NAME nvarchar(50) NULL,
	DESCRIPTION nvarchar(200) NULL,
	CREATOR varchar(10) NULL,
	MODIFIER varchar(10) NULL,
	CREATE_TIME datetime NULL,
	MODIFY_TIME datetime NULL);
	
CREATE TABLE IF NOT EXISTS walsindba.AUTH_ROLE(
	ID int IDENTITY(1,1) NOT NULL,
	APP_CODE varchar(50) NOT NULL,
	CODE varchar(50) NOT NULL,
	NAME nvarchar(50) NOT NULL,
	DESCRIPTION nvarchar(200) NULL,
	CREATOR varchar(10) NULL,
	MODIFIER varchar(10) NULL,
	CREATE_TIME datetime NULL,
	MODIFY_TIME datetime NULL);
	
CREATE TABLE IF NOT EXISTS walsindba.AUTH_ROLE_MEMBER(
	ID int IDENTITY(1,1) NOT NULL,
	ROLE_ID int NOT NULL,
	EMP_ID varchar(10) NOT NULL,
	CREATOR varchar(10) NULL,
	CREATE_TIME datetime NULL);

CREATE TABLE IF NOT EXISTS walsindba.SURVEY_USER_GROUP(
    ID	int,
    NAME	varchar(300),
    CREATOR varchar(300));
	
CREATE VIEW IF NOT EXISTS walsindba.V_EMPLOYEE AS
	SELECT 
		'ur04192' as EMPID,
		'蔡佳燐' AS NAME,
		'TP' AS LOCACOD,
		'台北' AS LOCNAM,
		'總公司/其他' AS BG,
		'資訊中心' AS BU,
		'雲端方案發展處' AS OU,
		'HI11B220TP' AS COSTNO,
		'應用系統開發課' AS COSTNAM,
		'資深工程師' AS POSTNAM,
		'Mueller_Tsai@walsin.com' AS EMAIL
	UNION ALL
	SELECT
		'devmanager' as EMPID ,
		'dev管理員' AS NAME,
		'TP' AS LOCACOD,
		'台北' AS LOCNAM,
		'總公司/其他' AS BG,
		'資訊中心' AS BU,
		'雲端方案發展處' AS OU,
		'HI11B220TP' AS COSTNO,
		'應用系統開發課' AS COSTNAM,
		'資深工程師' AS POSTNAM,
		'devmanager@walsin.com' AS EMAIL
	UNION ALL
	SELECT
		'yhtmanager' as EMPID ,
		'yht管理員' AS NAME,
		'TP' AS LOCACOD,
		'台北' AS LOCNAM,
		'總公司/其他' AS BG,
		'資訊中心' AS BU,
		'雲端方案發展處' AS OU,
		'HI11B220TP' AS COSTNO,
		'應用系統開發課' AS COSTNAM,
		'資深工程師' AS POSTNAM,
		'yhtmanager@walsin.com' AS EMAIL;

CREATE VIEW IF NOT EXISTS walsindba.V_LOCATION AS
	SELECT
		'TP' AS LOCACOD,
		'台北' AS LOCNAM;
		
CREATE VIEW IF NOT EXISTS walsindba.V_BU AS
	SELECT
		'資訊中心' AS BU;

CREATE VIEW IF NOT EXISTS walsindba.V_OU AS
	SELECT
		'資訊中心' AS BU,	'.' AS OU
	UNION ALL
	SELECT
		'資訊中心' AS BU,	'大數據與資訊安全處' AS OU
	UNION ALL
	SELECT
		'資訊中心' AS BU, '雲端方案發展處' AS OU
	UNION ALL
	SELECT
		'資訊中心' AS BU, '資訊處' AS OU;
