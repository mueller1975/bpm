import { CSRF_HEADER, CSRF_TOKEN } from 'Config';

// API URLs
const DATA_FETCH_URL = "service/mpb/query"; // 資料查詢
// const CRUD_API_URL = "service/mpb"; // 資料儲存、刪除、提交 (舊)
const CRUD_API_URL = "service/flow"; // 資料儲存、刪除、提交、加會簽、會簽 (新: with Flowable BPM)
const MPB_CONFIRM_URL = "service/mpb/uat/confirm"; // 澄清單成立 (UAT only)
const FORM_DATA_FETCH_BY_ID_URL = "service/mpb"; // 查詢 mpb 澄清單 by id
const FORM_DATA_FETCH_URL = "service/mpb/form"; // 查詢 mpb 澄清單 by mpbNo/version/tenantId
const VALIDATE_MIC_URL = "service/yonbip/validateMIC"; // mpb 表單欄位檢核
const MIC_NO_QUERY_URL = "service/mic/no"; // 查詢 MIC No 相關資訊 by micNo
const ACTION_LOGS_URL = "service/mpb/logs"; // 查詢執行動作 logs
const ATTACHMENT_DOWNLOAD_URL = "service/mpb/attachment" // 附件下載 url
const DOCUMENT_URL = 'service/mpb/document'; // 華新格式文件下載 url
const FLOW_USER_TASKS_URL = 'service/flow/tasks'; // 查詢表單使用者流程 tasks

/**
 * 查詢表單 user tasks
 * @param {*} formId
 * @returns 
 */
export const fetchQueryUserTasks = (formId) =>
    fetch(`${FLOW_USER_TASKS_URL}?formId=${formId}`, { method: 'GET', redirect: 'manual' });

/**
 * 檢核 MIC
 * @param {*} formData 
 * @returns 
 */
export const fetchValidateMIC = formData => {
    const { mpbData } = formData;

    return fetch(VALIDATE_MIC_URL, {
        method: 'POST', redirect: 'manual', body: JSON.stringify(mpbData),
        headers: {
            'Content-Type': 'application/json',
            [CSRF_HEADER]: CSRF_TOKEN
        }
    });
};

/**
 * 刪除資料列
 * @param {*} rows 
 * @returns 
 */
export const fetchDeleteRows = rows => fetch(CRUD_API_URL, {
    method: 'DELETE', redirect: 'manual', body: `ids=${rows.map(row => row.id).join(',')}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        [CSRF_HEADER]: CSRF_TOKEN
    }
});

/**
 * 查詢 MPB 澄清單資料 by 澄清單 id
 * @param {*} id MPB 澄清單 id
 * @returns 
 */
export const fetchQueryFormById = (id) =>
    fetch(`${FORM_DATA_FETCH_BY_ID_URL}/${id}`, { method: 'GET', redirect: 'manual' });

/**
 * 查詢 MPB 澄清單資料 by mpbNo/version/tenantId
 * @param {*} param0 
 * @returns 
 */
export const fetchQueryForm = ({ mpbNo, version, tenantId }) =>
    fetch(`${FORM_DATA_FETCH_URL}/${mpbNo}/${version}?tenantId=${tenantId}`, { method: 'GET', redirect: 'manual' });

/**
 * 查詢 MIC No 相關資料
 * @param {*} micNo 
 * @returns 
 */
export const fetchMicNoData = (micNo) =>
    fetch(`${MIC_NO_QUERY_URL}/${micNo}`, { method: 'GET', redirect: 'manual' });

/**
 * View 查詢結果 for 匯出 async func
 * @param {*} params DataTable 查詢參數
 * @returns 
 */
export const fetchQueryResult = (params) => fetch(`${DATA_FETCH_URL}`, {
    method: 'POST',
    redirect: 'manual',
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
        [CSRF_HEADER]: CSRF_TOKEN
    }
});

/**
 * MPB 澄清單成立
 * @param {*} id MPB 澄清單 id
 * @returns 
 */
export const fetchConfirmMPB = (id) => fetch(`${MPB_CONFIRM_URL}?id=${id}`, { method: 'GET', redirect: 'manual' });

/**
 * 查詢 MPB 澄清單執行記錄
 * @param {*} id MPB 澄清單 id
 * @returns 
 */
export const fetchQueryActionLogs = (id) => fetch(`service/mpb/logs/${id}`, { redirect: 'manual' });

/**
 * 下載上傳的附檔
 * @param {*} param0 
 * @returns 
 */
export const fetchDownloadAttachment = ({ date, id, filename }) => fetch(`${ATTACHMENT_DOWNLOAD_URL}/${date}/${id}`, {
    method: 'POST',
    redirect: 'manual',
    body: `filename=${filename}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        [CSRF_HEADER]: CSRF_TOKEN
    }
});

/**
 * 下載華新格式文件
 * @param {*} param0 
 * @returns 
 */
export const fetchDownloadDocument = ({ path, file }) => fetch(`${DOCUMENT_URL}`, {
    method: 'POST',
    redirect: 'manual',
    body: `path=${path}&file=${file}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        [CSRF_HEADER]: CSRF_TOKEN
    }
});