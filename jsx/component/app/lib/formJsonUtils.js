import { PRODUCT_CATEGORY } from './formConsts';

/**
 * 下拉選單選項值（code > name > option）
 * @param {*} option 
 * @returns 
 */
export const option_value = (option, defaultValue = '') => {
    let value = option?.code ?? option?.name ?? option ?? defaultValue;
    // console.log(option, '=>', value);
    return value;
};

/**
 * 產品大類是否包含於...
 * @param {*} ctxState 
 * @param  {...any} categories 
 * @returns 
 */
export const product_category_in = (ctxState, ...categories) => categories.includes(ctxState?.main?.productCategory);

/**
 * 轉換產品大類代碼
 * @param {*} ctxState 
 * @returns 
 */
export const product_category_code = (ctxState) => PRODUCT_CATEGORY[ctxState?.main?.productCategory]?.code ?? '未定義';

/**
 * 驗證 numberRange 型態的欄位值
 * @param {*} param0 欄位上下限值 {min, max}
 * @param {*} minValueRange 下限值限制範圍 [from, to]
 * @param {*} maxValueRange 上限值限制範圍 [from, to]
 * @returns 成功: undefined; 失敗: 理由
 */
export const validate_number_range = ({ min, max }, minValueRange, maxValueRange) => {
    if (minValueRange) {
        let [from, to] = minValueRange;

        if (min < from) {
            return `下限值不可小於 ${from}`;
        } else if (min > to) {
            return `下限值不可大於 ${to}`;
        }
    }

    if (maxValueRange) {
        let [from, to] = maxValueRange;

        if (max < from) {
            return `上限值不可小於 ${from}`;
        } else if (max > to) {
            return `上限值不可大於 ${to}`;
        }
    }

    // 2023.2.9: 取消下限不得大於上限的限制
    // if (min > max) {
    //     return "下限值不可大於上限值";
    // }
}

export const editable = ({ ctxState, formState, userState }) =>
    (['SAVED', 'UNSAVED', 'FORKED'].includes(ctxState?.main?.approvalStatus)
        && ctxState?.main?.creator?.toLowerCase() == userState?.empId.toLowerCase())
    || (ctxState?.main?.approvalStatus == 'PENDING' && userState?.roles?.includes('QA_APPROVER'));