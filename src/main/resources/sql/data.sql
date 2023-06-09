MERGE INTO dbo.USER_ORG (LOCACOD, EMPID, NAME, JOB, COSTNO, COSTNAM, STRKND, TITLE, TITKND, AREA, BG, BU, OU, CENCOD, CENNAM, FEECOD, FEENAME, TYPNAME, STKNAM, LEAVNAM, TITNAM, POSTNAM, COMPANY, PLANT, NOTESID, EMAIL)  KEY(EMPID) VALUES ('TP', 'ur04192', '蔡佳燐', NULL, 'HI11B220TP', '應用系統開發課', '1', '20302', '06', '台灣', '總公司/其他', '資訊中心', '雲端方案發展處', 'WN2510', 'null', 'M', '管理', '間接', '1', '資深專業人員', '六等', '資深工程師', 'WL01', 'SC01', 'CN=Mueller Tsai/OU=WALSIN/O=WALSIN', 'Mueller_Tsai@walsin.com');
MERGE INTO dbo.USER_ORG (LOCACOD, EMPID, NAME, JOB, COSTNO, COSTNAM, STRKND, TITLE, TITKND, AREA, BG, BU, OU, CENCOD, CENNAM, FEECOD, FEENAME, TYPNAME, STKNAM, LEAVNAM, TITNAM, POSTNAM, COMPANY, PLANT, NOTESID, EMAIL)  KEY(EMPID) VALUES ('TP', 'devmanager', 'dev管理員', NULL, 'HI11B220TP', '應用系統開發課', '1', '20302', '06', '台灣', '總公司/其他', '資訊中心', '雲端方案發展處', 'WN2510', 'null', 'M', '管理', '間接', '1', '資深專業人員', '六等', '資深工程師', 'WL01', 'SC01', 'CN=devmanager/OU=WALSIN/O=WALSIN', 'devmanager@walsin.com');
MERGE INTO dbo.USER_ORG (LOCACOD, EMPID, NAME, JOB, COSTNO, COSTNAM, STRKND, TITLE, TITKND, AREA, BG, BU, OU, CENCOD, CENNAM, FEECOD, FEENAME, TYPNAME, STKNAM, LEAVNAM, TITNAM, POSTNAM, COMPANY, PLANT, NOTESID, EMAIL)  KEY(EMPID) VALUES ('TP', 'yhtmanager', 'yht管理員', NULL, 'HI11B220TP', '應用系統開發課', '1', '20302', '06', '台灣', '總公司/其他', '資訊中心', '雲端方案發展處', 'WN2510', 'null', 'M', '管理', '間接', '1', '資深專業人員', '六等', '資深工程師', 'WL01', 'SC01', 'CN=yhtmanager/OU=WALSIN/O=WALSIN', 'yhtmanager@walsin.com');

MERGE INTO walsindba.AUTH_APPLICATION (CODE, NAME, DESCRIPTION, CREATOR, MODIFIER, CREATE_TIME, MODIFY_TIME )  KEY(CODE) VALUES ('mpb', '訂單澄清系統', '訂單澄清系統', 'ur04192', 'ur04192', '2022-05-09 16:20:10.270', '2022-05-11 11:04:23.727');


MERGE INTO walsindba.AUTH_ROLE (ID, APP_CODE, CODE, NAME, DESCRIPTION, CREATOR, MODIFIER, CREATE_TIME, MODIFY_TIME ) KEY(ID) VALUES ('38', 'mpb', 'ADMIN', '系統管理者', '系統管理者', 'ur04192', 'ur04192', '2022-05-09 16:20:45.970', '2022-05-09 16:20:45.970 ');
MERGE INTO walsindba.AUTH_ROLE (ID, APP_CODE, CODE, NAME, DESCRIPTION, CREATOR, MODIFIER, CREATE_TIME, MODIFY_TIME ) KEY(ID) VALUES ('39', 'mpb', 'MPB_CREATOR', 'MPB申請單建立者', 'MPB申請單建立者', 'ur04192', 'ur04192', '2022-05-09 16:21:27.643', '2022-05-09 16:21:27.643 ');
MERGE INTO walsindba.AUTH_ROLE (ID, APP_CODE, CODE, NAME, DESCRIPTION, CREATOR, MODIFIER, CREATE_TIME, MODIFY_TIME ) KEY(ID) VALUES ('40', 'mpb', 'QA_APPROVER', '品保審批者', '審批 MPB 澄清訂單', 'ur04192', 'ur04192', '2022-05-09 16:21:58.173', '2022-05-09 16:21:58.173 ');
MERGE INTO walsindba.AUTH_ROLE (ID, APP_CODE, CODE, NAME, DESCRIPTION, CREATOR, MODIFIER, CREATE_TIME, MODIFY_TIME ) KEY(ID) VALUES ('41', 'mpb', 'MPB_IMPORTER', 'MPB澄清單匯入者', 'MPB澄清單匯入者', 'ur04192', 'ur04192', '2022-09-15 13:42:15.223', '2022-09-15 13:42:15.223');

MERGE INTO walsindba.AUTH_ROLE_MEMBER (ID, ROLE_ID, EMP_ID, CREATOR, CREATE_TIME ) KEY(ID) VALUES ('234', '38', 'ur04192', 'ur04192', '2022-05-09 16:22:28.687');
MERGE INTO walsindba.AUTH_ROLE_MEMBER (ID, ROLE_ID, EMP_ID, CREATOR, CREATE_TIME ) KEY(ID) VALUES ('235', '38', 'devmanager', 'ur04192', '2022-05-09 16:22:28.703');
MERGE INTO walsindba.AUTH_ROLE_MEMBER (ID, ROLE_ID, EMP_ID, CREATOR, CREATE_TIME ) KEY(ID) VALUES ('236', '38', 'yhtmanager', 'ur04192', '2022-05-09 16:22:28.703');


MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('7', 'Test', 'ur03299 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1007', 'WEB', 'ur03299 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1008', '總部人資團隊', 'ur05391 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1009', '人資處理級主管', 'ur05391 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1010', '不鏽鋼事業部人事課', 'ur05391 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1011', 'manager1', 'ur04259 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1012', 'test1214', 'ur03299 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1013', 'abc', 'ur03299 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1018', '新技術', 'ur04192 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1023', '流程開發課', 'ur04192 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1024', '原子力研究所', 'ur04192 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1025', '測試群組', 'ur04192 ');
MERGE INTO walsindba.SURVEY_USER_GROUP (ID, NAME, CREATOR ) KEY(ID) VALUES ('1026', 'MPB', 'ur04259');


