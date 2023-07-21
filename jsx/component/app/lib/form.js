import * as U from './formJsonUtils';
import { fetchFormConfigs } from './api';
import { sortBy } from 'lodash';

const allFormFields = [], allFormIds = [], allL4FormFields = [];

/**
 * 查詢後端表單設定
 * @returns 
 */
export const loadDBForms = async () => {
    let response = await fetchFormConfigs();
    let vo = await response.json();
    let forms = vo.data.map(({ value }) => value);

    forms = sortBy(forms, "order");
    return forms;
};

/**
 * 表單基本資料
 * @param {*} param0 
 * @returns 
 */
export const getInitialFormData = ({ user: { empId, name, deptId, deptName } }) => ({
    creator: empId, // 建立者工號
    creatorName: name, // 建立者姓名
    creatorDept: deptId, // 建立者部門代號
    creatorDeptName: deptName, // 建立者部門名稱

    applicant: empId, // 申請者工號
    applicantName: name, // 申請者姓名
    applicantDept: deptId, // 申請者部門代號
    applicantDeptName: deptName, // 申請者部門名稱

    approvalStatus: 'UNSAVED', // 表單審批狀態
    createTime: new Date(), // 建立時間
    modifyTime: null, // 異動時間
    applyTime: null, // 提交時間
    closeTime: null, // 審批完成時間
});

export const computeValues = (forms, context) => {
    let values = {};

    Object.entries(forms).forEach(([formId, props]) => {
        let formValues = {};

        Object.entries(props).forEach(([prop, value]) => {
            const { computedBy } = value;

            if (computedBy) {
                let func = new Function(['context'], `const {_} = context; return ${computedBy};`);
                value = func(context);
                console.log(prop, '=>', value);
            }

            formValues[prop] = value;
        });

        values[formId] = formValues;
    });

    return values;
};

/**
 * Convert JSON string to js object
 * @param {*} json string
 * @returns 
 */
export const jsonToObject = json => {
    if (json == null || json == undefined || json === '') {
        return null;
    }

    return (typeof json == 'string' && (json.startsWith('{') || json.startsWith('['))) ? JSON.parse(json) : json;
};

/**
 * 取得指定 id 的 form 裡所有 input 欄位的 value 及欲上傳檔案的資訊
 * @param {*} formId 
 * @returns 
 */
export const getFormFieldValues = (formId) => {
    // 只抓有 name 屬性及 data-available='true' 的 input 或 textarea 欄位
    let fields = document.querySelectorAll(`form[id=${formId}] input[name][data-available='true'], form[id=${formId}] textarea[name][data-available='true']`);
    let values = {};
    let fileKeys = [], files = []; // 要上傳的檔案
    let totalFileSize = 0; // 該 form 裡所有要上傳檔案的大小總合

    fields.forEach(field => {
        const { name, value, type } = field;
        let inputValue = type == 'checkbox' && !field.checked ? 'N' : value.trim(); // checkbox 欄位的值為 Y/N

        if (typeof inputValue != 'string') debugger; // 非 string, 有問題

        let valueObj = jsonToObject(inputValue); // 轉成 object

        // 處理 fileUploader 型態的欄位
        if (inputValue != '' && field.hasAttribute("uploader")) {
            // 從儲存的 json data 中找出每筆資料的 id, 附檔就放在這些 id 的 input 欄位
            // let rows = JSON.parse(inputValue);
            let rows = valueObj;

            rows.forEach(({ _date: date, _id: id }) => {
                let fileInput = document.getElementById(id);

                // 該 file input 如有夾附檔
                if (fileInput && fileInput.files.length > 0) {
                    let file = fileInput.files[0];
                    totalFileSize += file.size;

                    fileKeys.push({ date, id });
                    files.push(file);
                }
            });
        }

        // let available = field.getAttribute("data-available");
        // console.log({name, available})

        // values[name] = inputValue;
        values[name] = valueObj;
    });

    return { values, fileKeys, files, totalFileSize };
};

/**
 * 取得所有 form 裡的 input 欄位值及欲上傳檔案資訊
 */
export const buildFormData = () => {
    let mpbData = {}, uploadFileKeys = [], uploadFiles = [], uploadFilesSize = 0;

    let forms = document.querySelectorAll("form[id]");

    forms.forEach(form => {
        let { values, fileKeys, files, totalFileSize } = getFormFieldValues(form.id);
        mpbData[form.id] = values;
        uploadFileKeys = uploadFileKeys.concat(fileKeys);
        uploadFiles = uploadFiles.concat(files);
        uploadFilesSize += totalFileSize;
    });

    // console.log({ mpbData, uploadFileKeys, uploadFiles, uploadFilesSize })
    return { mpbData, uploadFileKeys, uploadFiles, uploadFilesSize };
};

/**
 *  檢核指定 form id 欄位值
 * @param {*} formIds "未傳入"則檢核"所有" form 
 * @returns 
 */
export const validateFormFields = (formIds = allFormIds, mpbCtxState) => {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let forms = {};
            let total = 0;

            formIds.forEach(id => {
                let errorFields = {};
                let count = 0;


                let formFields = document.querySelectorAll(`form[id=${id}] input[name]`); // 只抓有 name 屬性的 input 欄位

                formFields.forEach(field => {
                    const { name, value, required, hidden } = field
                    let available = field.getAttribute("data-available");

                    if (available !== 'false') {
                        // 驗證必填欄位                        
                        if (required && !value) {
                            errorFields[name] = "此欄必填";
                            count++;
                        } else if (value) {
                            // 驗證有 validator 函式的欄位
                            const { type, validator } = allFormFields[id][name];

                            if (validator) {
                                let validatorFunc = new Function(['states', 'value', 'U'], `const {ctxState, formState} = states; return ${validator}`);
                                let states = { ctxState: mpbCtxState, formState: mpbCtxState[id] ?? {} };
                                let error = validatorFunc(states, jsonToObject(value), U);

                                if (error) {
                                    errorFields[name] = error;
                                    count++;
                                }
                            }
                        }
                    }

                    // console.log(`${id}.${name}:`, value, '=>', { required, hidden, error, available });
                });

                forms[id] = { fields: errorFields, count };
                total += count;
            });

            resolve({ forms, total })
        });
    });
};

/**
 * 從 url 參數建立預設 form data
 * @param {*} query 
 * @returns 
 */
export const buildDefaulFormFromQuery = (query) => {
    let newForm = {};

    Object.entries(allL4FormFields).forEach(([formId, form]) => {

        if (Object.keys.length == 0) {
            return false;
        } else {
            let formFields = {};

            Object.entries(form).forEach(([prop, required]) => {
                let v = query.get(prop);

                if (required && !v) {
                    throw `[${prop}] 為必要欄位`;
                }

                // 拒絕接受 undefined/null 參數值
                if (v) {
                    if (['undefined', 'null'].includes(v.toLowerCase())) {
                        throw '不接受無意義的參數值（undefined、null)！';
                    }

                    formFields[prop] = v;
                }
            });

            if (Object.keys(formFields).length > 0) {
                newForm[formId] = formFields;
            }
        }
    });

    // console.log({ newForm })
    return newForm;
};