import { cloneDeep } from "lodash";

/**
 * 讀取 local storage 儲存的 DataTable 設定
 * @param {*} storageKey 
 * @param {*} defaultColumns 
 * @param {*} defaultPageSize 
 * @param {*} defaultSorting 
 * @returns 
 */
export const getTableConfig = (storageKey, defaultColumns, defaultPageSize, defaultSorting) => {
    let sorting = { ...defaultSorting };

    //let cols = JSON.parse(JSON.stringify(defaultColumns)) // 複製預設欄位
    let columns = cloneDeep(defaultColumns) // 複製預設欄位 (使用 cloneDeep, 因 object property 內容可能有 function)
    let pagination; // pagination 分頁設定
    let keywords; // 歷史查詢關鍵字

    // 讀取儲存的表格設定
    if (storageKey) {
        let settings = JSON.parse(window.localStorage.getItem(storageKey)) || {} // 儲存的 DataTable 設定
        let { columns: savedColumns = {}, sorting: savedSorting = {}, pageSize: savedPageSize, keywords: savedKeywords } = settings // columns/排序屬性/每頁筆數/關鍵字記錄

        // console.log(`DataTable [${STORAGE_KEY}] 設定:`, settings);

        // 處理欄位設定
        if (Object.keys(savedColumns).length > 0) {
            // 從儲存的 columns 剔除 default columns 裡沒有的 column
            savedColumns = savedColumns.filter(col => columns.find(elm => elm.prop == col.prop))

            if (Object.keys(savedColumns).length > 0) {
                // saved columns 加入 default columns 其它屬性 (除 width, hidden 外)
                savedColumns = savedColumns.map(col => {
                    let col2 = columns.find(elm => elm.prop == col.prop)
                    const { width, hidden = false } = col
                    return { ...col2, width, hidden }
                })

                // 找出 default columns 新增的欄位, 並加到 saved columns 最前面
                let newColumns = columns.filter(col => !(savedColumns.find(elm => elm.prop == col.prop)))
                columns = newColumns.concat(savedColumns)
            }
        }

        // 處理排序設定
        if (Object.keys(savedSorting).length > 0) {
            // 儲存的排序欄位如有效
            let found = columns.find(col => col.prop === savedSorting.prop)
            if (found) {
                sorting = savedSorting;
            }
        }

        // 處理每頁筆數設定
        if (savedPageSize ?? false) {
            pagination = { page: 0, size: savedPageSize };
        }

        // 歷史查詢關鍵字
        keywords = savedKeywords;
    } // End of 讀取儲存的表格設定

    if (!pagination) {
        pagination = { page: 0, size: defaultPageSize };
    }

    return { columns, sorting, pagination, keywords };
}