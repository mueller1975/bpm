import { useFetch } from 'Hook/useTools.jsx';
import {
    fetchConfirmMPB, fetchMicNoData, fetchQueryActionLogs, fetchQueryForm, fetchQueryFormById,
    fetchQueryResult, fetchSubmitForm, fetchValidateMIC, fetchQueryUserTasks
} from './api';

/**
 * 澄清單保存/提交/審批
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useSubmitForm = (success, failure) => useFetch(fetchSubmitForm, { success, failure });

/**
 * 查詢表單 user tasks
 * @param {*} success 
 * @param {*} failure 
 */
export const useQueryUserTasks = (success, failure) => useFetch(fetchQueryUserTasks, { success, failure });

/**
 * 檢核 MIC
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useValidateMIC = (success, failure) => useFetch(fetchValidateMIC, { success, failure });

/**
 * 查詢澄清單資料 hook
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useQueryFormById = (success, failure) => useFetch(fetchQueryFormById, { success, failure });

/**
 * 查詢澄清單資料 hook
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useQueryForm = (success, failure) => useFetch(fetchQueryForm, { success, failure });

/**
 * 查詢 MIC No 相關資料 hook
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useQueryMicNoData = (success, failure) => useFetch(fetchMicNoData, { success, failure });

/**
 * 澄清單成立 hook
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useConfirmMPB = (success, failure) => useFetch(fetchConfirmMPB, { success, failure });

/**
 * View 查詢結果 for 匯出 hook
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useExportQueryResult = (success, failure) => useFetch(fetchQueryResult, { success, failure });

/**
 * 查詢 MPB 澄清單執行記錄
 * @param {*} success 
 * @param {*} failure 
 * @returns 
 */
export const useFetchQueryActionLogs = (success, failure) => useFetch(fetchQueryActionLogs, { success, failure });