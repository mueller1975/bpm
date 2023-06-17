import _ from 'underscore';

/**
 * 檢查 value 是否有效的參數值
 * @param {*} value 
 */
export const isValidParamValue = value => value === 0 || (Array.isArray(value) ? value.length > 0 : Boolean(value))

/**
 * 檢查 obj 是否空物件 (無任何 property)
 * @param {*} obj 
 */
export const isEmptyObject = obj => _.isEmpty(obj); //Object.keys(obj).length == 0

/**
 * 清除 obj 物件中無效參數值的 property
 * @param {*} obj
 * @param {*} valueIfEmpty 如清除後為空物件的回傳值, default to {}
 */
export const trimObject = (obj, valueIfEmpty = {}) => {
    Object.keys(obj).forEach(key => !isValidParamValue(obj[key]) && delete obj[key])
    return isEmptyObject(obj) ? valueIfEmpty : obj
}

/**
 * 搬移陣列元素位置
 * @param {*} array 
 * @param {*} from 來源 index
 * @param {*} to 目的 index
 */
export const moveArrayElement = (array, from, to) => {
    let numberOfDeletedElm = 1;
    const elm = array.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;
    array.splice(to, numberOfDeletedElm, elm);
}

/**
 * 組合過濾條件參數
 * @param {*} params 
 */
export const getParamsFilter = params => {
    let subFilters = []

    if (Array.isArray(params)) {
        for (let i in params) {
            subFilters.push(getParamsFilter(params[i]))
        }
    } else {
        for (let p in params) {
            let v = params[p] // 查詢值

            if (isValidParamValue(v)) {
                let pArray = p.split(",").map(pp => pp.trim()) // 檢查屬性名稱是否含有 "," (代表多個欄位名稱)

                if (pArray.length > 1) { // 處理多欄位過濾條件
                    let multiPropertyFilters = pArray.map(pp => ({ field: pp, value: v, operator: 'eq' }))
                    subFilters.push({ filter: { logic: 'or', subFilters: multiPropertyFilters } })
                } else if (v.from !== undefined || v.to !== undefined) { // 查詢值為範圍區間
                    subFilters.push({ field: p, value: [v.from, v.to], operator: 'between' })
                } else if (v.above !== undefined || v.gt !== undefined) { // greater than 查詢值 (>)
                    subFilters.push({ field: p, value: v.above ?? v.gt, operator: 'gt' })
                } else if (v.below !== undefined || v.lt !== undefined) { // less than 查詢值 (<)
                    subFilters.push({ field: p, value: v, operator: 'lt' })
                } else if (v.ge !== undefined) { // greater than or equals 查詢值 (>=)
                    subFilters.push({ field: p, value: v.ge, operator: 'ge' })
                } else if (v.le !== undefined) { // less than or equals 查詢值 (<=)
                    subFilters.push({ field: p, value: v.le, operator: 'le' })
                } else if (Array.isArray(v)) { // 查詢值為多重值
                    subFilters.push({ field: p, value: v, operator: 'contains' })
                } else {
                    v = typeof v == 'object' ? getParamsFilter(v) : v // for filters of different data sources, 2021.6.17 (eg. 問卷回填查詢過濾條件)
                    subFilters.push({ field: p, value: v, operator: 'eq' })
                }
            }
        } // for p
    }

    // console.log({ subFilters })
    subFilters = subFilters.filter(filter => Boolean(filter))

    if (subFilters.length == 0) {
        return null
    } else if (subFilters.length == 1) {
        return subFilters[0]
    } else if (Array.isArray(params)) {
        return { filter: { logic: 'or', subFilters } }
    } else {
        return { filter: { logic: 'and', subFilters } }
    }
}

/**
 * 組合欲排序的欄位參數
 * @param {*} sorting 
 * @returns 
 */
export const buildSortParams = sorting => {
    const { prop, order } = sorting;
    let params = !prop ? [] : prop.split(",").map(p => ({ field: p.trim(), dir: order }));
    return params;
};

/**
 * 組合查詢參數過濾條件物件
 * @param {*} keyword 關鍵字 (以空白隔開)
 * @param {*} filterParams
 * @param {*} params
 */
export const getFilter = (keyword, filterParams, params) => {
    let filters = []

    // 處理關鍵字查詢
    if (keyword) {
        let keywords = keyword.split(" ").filter(k => k)

        if (keywords.length == 1) {
            filters.push({ field: "keyword", value: keywords[0] })
        } else {
            let subFilters = keywords.map(k => ({ field: "keyword", value: k }))
            filters.push({ filter: { logic: "or", subFilters } })
        }
    }

    // 處理過濾條件參數
    let paramsFilter

    if (filterParams && !params) {
        paramsFilter = getParamsFilter(filterParams)
    } else if (params && !filterParams) {
        paramsFilter = getParamsFilter(params)
    } else if (filterParams && params) {
        paramsFilter = [getParamsFilter(filterParams), getParamsFilter(params)]
    }

    // console.log({ filterParams, params, paramsFilter })

    if (paramsFilter) {
        paramsFilter = Array.isArray(paramsFilter) ? paramsFilter.filter(filter => Boolean(filter)) : paramsFilter
        filters = filters.concat(paramsFilter)
    }

    let filter = null

    if (filters.length > 0) {
        filter = filters.length > 1 ? { filter: { logic: "and", subFilters: filters } } : filters[0]
    }

    // console.log({ filter })
    return filter
}

/**
 * 取得 url query string 中的參數值
 * @param {*} key 
 * @returns 
 */
export const getUrlParamValue = (key) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(key)
}

/**
 * Deprecated
 * @param {*} key 
 * @returns 
 */
export const _getUrlParamValue = (key) => {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

/**
 * 檢查 destination 裡是否包含 source 或 source 裡任一元素
 * @param {any} source string or array of strings
 * @param {any} destination array of string
 */
export const containsAny = (source, destination) => {
    return (!source || (Array.isArray(source) && source.length == 0)) ||
        (destination && destination.length > 0 &&
            ((!Array.isArray(source) && destination.indexOf(source) > -1) ||
                (Array.isArray(source) && source.some(srcRole => destination.some(dstRole => srcRole === dstRole)))))
}

/**
 * 隨機取值 (不大於 max)
 * @param {*} max 
 */
export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * 電子郵子格式驗證
 * @param {*} email 
 * @returns 
 */
export const validateEmail = email => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
}

/**
 * 格式化金額
 * @param {*} amount 
 * @param {*} digits 最少小數位數
 * @returns 
 */
export const formatAmount = (amount = null, digits = 2) => {
    if (amount == null) return '';

    const formatter = new Intl.NumberFormat('zh-TW', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: digits
    });

    return formatter.format(amount);
};

/**
 * 格式化數量
 * @param {*} count 
 * @returns 
 */
export const formatCount = (count = null) => {
    if (count == null) return '';

    const formatter = new Intl.NumberFormat('zh-TW', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 0
    });

    return formatter.format(count);
};

export const isEqual = (obj, other) => {
    return _.isEqual(obj, other);
}

export const formatMessage = (message, args) => args.reduce((msg, arg, i) => msg.replace(`{${i + 1}}`, arg), message);

export const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    // color += "ff"; // opacity 1
    // color += "cc"; // opacity .8
    // color += "80"; // opacity .5
    return color;
}

const HISTORY_POSTFIX = 'HISTORY';
export const MAX_HISTORY_COUNT = 20;

/**
 * 取得歷程記錄
 * @param {*} key 
 * @returns 
 */
export const getHistory = key => {
    let historyKey = `${key}-${HISTORY_POSTFIX}`;
    return JSON.parse(window.localStorage.getItem(historyKey)) ?? [];
};

/**
 * 儲存歷程記錄
 * @param {*} key 
 * @param {*} history 
 */
const saveHistory = (key, history) => {
    let historyKey = `${key}-${HISTORY_POSTFIX}`;
    window.localStorage.setItem(historyKey, JSON.stringify(history));
};

/**
 * 插入歷程記錄
 * @param {*} history 
 * @param {*} content 
 * @returns new history array
 */
export const removeFromHistory = (history, content) => {
    let newHistory = [...history];

    // 刪除 history 中相同的記錄
    let idx = newHistory.findIndex(text => text.trim() == content.trim());

    if (idx > -1) {
        newHistory.splice(idx, 1);
    }

    return newHistory;
};

/**
 * 插入歷程記錄
 * @param {*} history 
 * @param {*} content 
 * @returns new history array
 */
export const insertHistory = (history, content) => {
    // 先刪除 history 中相同的記錄
    let newHistory = removeFromHistory(history, content);

    // 將要加入的記錄置頂
    newHistory.splice(0, 0, content);
    newHistory = newHistory.slice(0, MAX_HISTORY_COUNT);

    return newHistory;
};

/**
 * 新增歷程記錄
 * @param {*} key 
 * @param {*} content 
 * @returns 
 */
export const addHistory = (key, content) => {
    let history = getHistory(key);

    if (!key || !content) {
        console.warn('addHistory() 參數 key 及 content 不得為空值: ', { key, content });
    } else {
        history = insertHistory(history, content); // 回傳新的陣列
        saveHistory(key, history); // 儲存 history
    }

    return history;
};