import { getFilter } from 'Tools';
import { CSRF_HEADER, CSRF_TOKEN } from 'Config';
import { useAsyncDownload, useNotification, useResponseVO } from 'Hook/useTools.jsx';
import React, { useCallback, useEffect, useMemo, useState, useImperativeHandle, useRef } from 'react';
import { buildSortParams } from 'Tools';
import DataTableX from './DataTableX.jsx';

export default React.memo(React.forwardRef((props, ref) => {
    const { options,
        filter, filterParams,
        actionButtons,
        storageKey, rowKey,
        enableKeywordSearch = false, showCheckbox = false,
        resizable = false, alignDetailToRight = true,
        innerTable = false, roundCorner = false,
        onClickRow, onDoubleClickRow, onSelectRow,
        loading = false } = props;

    const { columns, title, serviceUrl, exportUrl,
        params, urlParams, page = 0, pageSize, sizeOptions, sortProp, sortOrder } = options;

    const [queryParams, setQueryParams] = useState();

    const tableRef = useRef();
    const { showError } = useNotification() // 訊息提示 function

    const urlParamString = useMemo(() => {
        if (urlParams) {
            return Object.entries(urlParams).map(([name, value]) => `${name}=${value}`).join('&');
        }
    }, [urlParams]);

    /* expose functions to parent component */
    useImperativeHandle(ref, () => ({
        // 取得表格目前查詢參數
        getRequestParams: () => {
            const { sorting, searchKeyword, filterOn, columns: tableColumns } = queryParams;

            let filter = getFilter(searchKeyword, filterOn ? filterParams : null, params)
            let sortProps = buildSortParams(sorting);
            let exportColumns = tableColumns.filter(header => !header.hidden) // 不匯出隱藏欄位

            let reqParams = { size: 0, filter, sortProps, exportColumns } // size 設為 0, 匯出所有查詢結果 

            return reqParams;
        },

        // 重新查詢
        reload: () => setQueryParams({ ...queryParams }),
        getSelectedRows: () => tableRef.current.getSelectedRows(), // 取得選取的資料列
        getSelectedRowIndices: () => tableRef.current.getSelectedRowIndices(),  // 取得選取的資料列 index
    }), [queryParams, filterParams, params]);

    // 查詢後端資料 async function
    const fetchDataFunc = useCallback(() => {
        if (queryParams?.pagination) {
            const { pagination, sorting, searchKeyword, filterOn } = queryParams;
            const { page, size } = pagination

            let filter = getFilter(searchKeyword, filterOn ? filterParams : null, params)
            let sortProps = buildSortParams(sorting);

            let reqParams = { page, size, filter, sortProps }

            return !serviceUrl ? null :
                fetch(serviceUrl + (!urlParamString ? '' : (serviceUrl.indexOf('?') > -1 ? '&' : '?') + urlParamString),
                    {
                        body: JSON.stringify(reqParams), method: 'POST', redirect: 'manual',
                        headers: {
                            'Content-Type': 'application/json',
                            [CSRF_HEADER]: CSRF_TOKEN
                        }
                    });
        }
    }, [params, queryParams]);

    // hook 查詢後端資料 async function
    const { execute: fetchData, pending: fetching, value: fetchedData, error: fetchError } = useResponseVO(fetchDataFunc);

    // 執行查詢後端資料
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 處理查詢失敗
    useEffect(() => {
        fetchError && showError(fetchError.message) // 提示查詢失敗訊息
    }, [fetchError]);

    /* 查詢關鍵字/過濾條件/排序 變動時, 更新匯出資料 function */
    const exportFileFunc = !exportUrl ? undefined : useCallback(() => {
        if (queryParams?.pagination) {
            const { sorting, searchKeyword, filterOn, columns: tableColumns } = queryParams;

            let filter = getFilter(searchKeyword, filterOn ? filterParams : null, params)
            let sortProps = buildSortParams(sorting);
            let exportColumns = tableColumns.filter(header => !header.hidden) // 不匯出隱藏欄位

            let reqParams = { size: 0, filter, sortProps, exportColumns } // size 設為 0, 匯出所有查詢結果 

            return !exportUrl ? null :
                fetch(exportUrl + (!urlParamString ? '' : (serviceUrl.indexOf('?') > -1 ? '&' : '?') + urlParamString),
                    {
                        body: JSON.stringify(reqParams), method: 'POST', redirect: 'manual',
                        headers: {
                            'Content-Type': 'application/json',
                            [CSRF_HEADER]: CSRF_TOKEN
                        }
                    });
        }
    }, [params, queryParams]);

    // hook 匯出資料 asyc function
    const { execute: exportFile, pending: exporting, error: exportError } = !exportUrl ? {} : useAsyncDownload(exportFileFunc);

    useEffect(() => {
        exportError && showError(exportError.message);
    }, [exportError]);

    // 在 DataTable 操作會觸發更新資料的 UI 動作
    const tableQueryHandler = useCallback(tableParams => setQueryParams(tableParams), []);

    // 匯出檔案
    const exportHandler = !exportUrl ? undefined : useCallback(() => {
        exportFile();
    }, [exportFile]);

    return <DataTableX ref={tableRef}
        title={title}
        columns={columns}
        data={fetchedData} dataError={fetchError}
        sortProp={sortProp} sortOrder={sortOrder} page={page} pageSize={pageSize}
        sizeOptions={sizeOptions}

        filter={filter}
        filterParams={filterParams}

        processing={fetching || exporting || loading}
        actionButtons={actionButtons}

        storageKey={storageKey}
        enableKeywordSearch={enableKeywordSearch} showCheckbox={showCheckbox}
        resizable={resizable} alignDetailToRight={alignDetailToRight}
        innerTable={innerTable} roundCorner={roundCorner}

        onClickRow={onClickRow}
        onDoubleClickRow={onDoubleClickRow}
        onSelectRow={onSelectRow}
        onQuery={tableQueryHandler}
        onExport={exportHandler}
    />;
}));