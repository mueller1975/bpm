import { CSRF_HEADER, CSRF_TOKEN } from 'Config';
import { MAX_FILE_MB, MAX_UPLOAD_FILE_MB } from './formConsts';

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
 * 澄清單保存/提交/審批
 * @param {*} param0 
 * @returns 
 */
export const fetchSubmitForm = ({ submitOptions, formData }) => {
    const { action, comments, notice, flowTaskId, formUpdateNeeded = false } = submitOptions;
    let { id, timestamp, mpbData, uploadFileKeys, uploadFiles, uploadFilesSize } = formData;

    if (uploadFilesSize > MAX_UPLOAD_FILE_MB * 1024 * 1024) {
        throw `一次欲上傳所有檔案大小總合不可超出 ${MAX_UPLOAD_FILE_MB} MB（實際為 ${(uploadFilesSize / 1024 / 1024).toFixed(2)} MB）！請「分次」上傳檔案`;
    }

    let body = new FormData(); // http request body

    // Multipart Form data 部份
    let form = {
        id,
        timestamp,
        uploadFileKeys,
        mpbData: JSON.stringify(mpbData),
        mpbDataObj: mpbData,
        ...mpbData?.main,
        ...mpbData?.productOrder
    };

    console.log({form})

    let data = { form, action, notice, comments, flowTaskId, formUpdateNeeded };
    const params = JSON.stringify(data);

    body.append("data", new Blob([params], { type: 'application/json' }));

    // Multipart 附檔部份
    uploadFiles && uploadFiles.forEach(file => body.append("files", file));

    return fetch(CRUD_API_URL, {
        method: 'POST', redirect: 'manual', body,
        headers: {
            // 'Content-Type': 'multipart/form-data', // 不可加上這個 header, fetch 會失敗 (request body 會少 boundary)
            [CSRF_HEADER]: CSRF_TOKEN
        }
    });
};

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