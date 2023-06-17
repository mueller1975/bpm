import React, { useState, useEffect, useRef, useMemo, useCallback, useImperativeHandle } from 'react';
import { } from '@mui/material';
import DataTableX from './DataTableX.jsx';


const EMPTY_DATA = { total: 0, rows: [] };

export default React.memo(React.forwardRef((props, ref) => {
    const {
        data = { total: 0, rows: [] }, dataError, loading = false, onDataChange,
        options,
        filter, filterParams,
        actionButtons,
        storageKey, rowKey,
        enableKeywordSearch = false, showCheckbox = false,
        resizable = false, alignDetailToRight = true,
        innerTable = false, roundCorner = false,
        onClickRow, onDoubleClickRow, onSelectRow } = props;

    const { columns, title, params, page = 0, pageSize, sizeOptions, sortProp, sortOrder } = options;

    const [tableData, setTableData] = useState(data);
    const [pageData, setPageData] = useState({ ...EMPTY_DATA });
    const [exporting, setExporting] = useState(false);
    const [queryParams, setQueryParams] = useState();

    const tableRef = useRef();

    /* expose functions to parent component */
    useImperativeHandle(ref, () => ({
        deleteRows, // 重新載入表格資料
    }));

    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        if (queryParams) {
            const { pagination, sorting, searchKeyword, filterOn } = queryParams;

            if (pagination) {
                const { page, size } = pagination;
                let start = page * size;
                let end = start + size - 1;
                console.log({ start, end });

                let rows = tableData.rows.slice(start, end);
                setPageData({ total: tableData.total, rows });
            }
        }
    }, [tableData, queryParams]);

    // 在 DataTable 操作會觸發更新資料的 UI 動作
    const tableQueryHandler = useCallback(tableParams => setQueryParams(tableParams), []);

    // 刪除列
    const deleteRows = () => {
        let selectedRows = tableRef.current.getSelectedRows();
        let selectedRowIds = selectedRows.map(row => row[rowKey]);
        console.log({ selectedRowIds })

        return new Promise((resolve, reject) => {
            let rows = tableData.rows.filter(row => !selectedRowIds.includes(row[rowKey]));
            console.log({ rows })
            onDataChange({ total: rows.length, rows });
            resolve(`已刪除 ${selectedRows.length} 筆資料！`);
        });
    };

    const exportHandler = useCallback(() => {

    }, []);

    return <DataTableX ref={tableRef}
        title={title}
        columns={columns}
        data={pageData} dataError={dataError}
        sortProp={sortProp} sortOrder={sortOrder} page={page} pageSize={pageSize}
        sizeOptions={sizeOptions}

        filter={filter}
        filterParams={filterParams}

        processing={loading || exporting}
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