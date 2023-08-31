
export const VIEW_COLUMNS_TEMPLATE = `
export const viewColumns = [
    { prop: "id", name: "ID", width: 150, noWrap: true, hidden: true },
    
    {0}

    { prop: "formNo", name: "表單號碼", width: 160, noWrap: true },
    { prop: "formVer", name: "表單版號", width: 160, noWrap: true },
    { prop: "createTime", name: "建立時間", width: 160, noWrap: true },
    { prop: "modifyTime", name: "異動時間", width: 160, noWrap: true },
    { prop: "creator", name: "建立者", width: 100, noWrap: true },
    { prop: "modifier", name: "異動者", width: 100, noWrap: true },
];`

export const SQL_CREATE_DDL_TEMPLATE = `
CREATE TABLE {0} (
    -- 主鍵
    id varchar(36) NOT NULL,

    -- 表單欄位
    {1}

    -- 以下為表單基本欄位, 不可更動
    creator varchar(20) DEFAULT NULL COMMENT '建立者',
    modifier varchar(20) DEFAULT NULL COMMENT '異動者',
    form_code varchar(30) DEFAULT NULL COMMENT '表單組態代碼',
    form_status varchar(30) DEFAULT NULL COMMENT '表單狀態',
    form_no varchar(40) DEFAULT NULL COMMENT '表單序號',
    form_ver int  DEFAULT NULL COMMENT '表單版號',
    json_data text COMMENT '表單內容 JSON',
    flow_process varchar(50) DEFAULT NULL COMMENT '表單審批流程',
    create_time datetime DEFAULT NULL COMMENT '建立時間',
    modify_time datetime DEFAULT NULL COMMENT '異動時間',
    apply_time datetime DEFAULT NULL COMMENT '申請時間',
    complete_time datetime DEFAULT NULL COMMENT '簽核完成時間',
    timestamp timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='{2}';
`;

export const buildCodesFromTemplate = (template, params) => {
    let codes = template;

    for (let i = 0; i < params.length; i++) {
        codes = codes.replace(`{${i}}`, params[i]);

        console.log(codes)
    }

    return codes;
};
