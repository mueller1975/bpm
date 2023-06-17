/**
 * DataTable Component
 * 此 DataTable 元件已被 RemoteDataTable/LocalDataTable 取代
 */
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Box, Fade, IconButton, Switch, TablePagination, Toolbar, Tooltip, Typography, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getFilter } from 'Tools';
import { MaskModal, ProgressMask } from 'Components';
import { CSRF_HEADER, CSRF_TOKEN } from 'Config';
import { useMessages } from 'Hook/contextHooks.jsx';
import { useAsyncDownload, useDebounce, useNotification, useResponseVO, useWindowSize } from 'Hook/useTools.jsx';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { formatAmount, insertHistory, removeFromHistory } from 'Tools';
import ColumnAdjuster from './ColumnAdjuster.jsx';
import ColumnFilter from './ColumnFilter.jsx';
import SearchBar from './SearchBar.jsx';
import TableContent from './TableContent.jsx';
import { TablePaginationSelect, TablePaginationSelectSmall } from './TablePaginationSelect.jsx';

/* 表格內容為空時顯示 component */
const EmptyContent = props => {
    const getMessage = useMessages()
    return <Typography color="primary" align="center">{getMessage('dataTable.emptyContent')}</Typography>
}

/* 組合欲排序的欄位參數 */
const buildSortParams = sorting => {
    const { prop, order } = sorting;
    let params = !prop ? [] : prop.split(",").map(p => ({ field: p.trim(), dir: order }));
    return params;
};

const POPOVER_TRANSFORM_ORIGIN = { vertical: 'top', horizontal: 'center' }
const POPOVER_ANCHOR_ORIGIN = { vertical: 'bottom', horizontal: 'center' }

/* DataTable component */
const DataTable = React.memo(styled(React.forwardRef((props, ref) => {

    /* Component props */
    /* { 表格 options, 表格行設定: 預設欄位, 表格標題, 過濾條件, 儲存設定 key, 啟用關鍵字搜尋, 顯示 checkbox, 調整行大小, nested table?, 圓滑角? } */
    const { options, options: { columns: defaultColumns, title, serviceUrl, exportUrl, urlParams }, filterParams, storageKey,
        enableKeywordSearch = false, showCheckbox = false, resizable = false, innerTable = false, roundCorner = false } = props

    /* Component states */
    const [afterInit, setAfterInit] = useState(false) // 表格初始化程序完成狀態
    const [firstFetchData, setFirstFetchData] = useState(true) // 第一次執行 fetchData()
    const [firstFetchedDataEmpty, setFirstFetchedDataEmpty] = useState(false) // 第一次執行 fetchData() 結果為空 (for inner table to display <EmptyContent />)
    const [waiting, setWaiting] = useState(false) // 等待中
    const [columns, setColumns] = useState([]) // 表格欄位設定
    const [keywordSearchOn, setKeywordSearchOn] = useState(false) // 切換查詢關鍵字搜尋
    const [content, setContent] = useState({ total: 0, data: [] }) // 表格內容
    const [keyword, setKeyword] = useState('') // 查詢關鍵字
    const [keywordHistory, setkeywordHistory] = useState([]); // 關鍵字查詢記錄
    const [pagination, setPagination] = useState({ page: 0, size: options.size === 0 ? 0 : options.size || 25 }) // 分頁
    const [sorting, setSorting] = useState({ prop: options.sortProp, order: options.sortOrder }) // 排序
    const [sizeOptions, setSizeOptions] = useState(options.sizeOptions || [10, 25, 50]) // 分頁選項
    const [selectedRows, setSelectedRows] = useState([]) // 已選取列
    const [selectedRowIndices, setSelectedRowIndices] = useState([]) // 已選取列 indices
    const [scrollOffset, setScrollOffset] = useState(0) // table wrapper scrollbar 目前位置至右邊界距離 (為動態調整 detail row 的 right padding)
    const [expandedRowsIndices, setExpandedRowsIndices] = useState([]) // 列展開/縮合狀態
    const [showDetailRow, setShowDetailRow] = useState(true) // 顯示/隱藏 detail row
    const [filterBtnEl, setFilterBtnEl] = useState(null) // 過濾條件 button element
    const [filterOn, setFilterOn] = useState(true) // 啟用過濾條件
    const [adjustColsBtnEl, setAdjustColsBtnEl] = useState(null) // 調整欄位 button element

    const STORAGE_KEY = storageKey ? `${storageKey}-DataTable` : null // 儲存表格設定 key

    const tableWrapperRef = useRef(null) // ref of table wrapper
    const colResizerRef = useRef(); // 目前點擊的欄位 resizer ref
    const windowSize = useWindowSize() // hook current window size
    const { showError } = useNotification() // 訊息提示 function
    const getMessage = useMessages() // 多語系轉換 function

    // const classes = innerTable ? useInnerStyles() : useStyles() // 根據是否 inner table 使用不同 style

    const urlParamString = useMemo(() => {
        if (urlParams) {
            return Object.entries(urlParams).map(([name, value]) => `${name}=${value}`).join('&');
        }
    }, [urlParams]);

    const debouncedKeyword = useDebounce(keyword.trim(), 500) // keyword 延遲
    const debouncedScrollOffset = useDebounce(scrollOffset, 300) // scroll 延遲
    const debouncedWindowSize = useDebounce(windowSize, 300) // window size 延遲

    /* expose functions to parent component */
    useImperativeHandle(ref, () => ({
        reloadData, // 重新載入表格資料
        getSelectedRows, // 取得選取的資料列
    }))

    /* defaultColumns 變動時, 重新套用儲存的欄位設定 */
    useEffect(() => {
        //let cols = JSON.parse(JSON.stringify(defaultColumns)) // 複製預設欄位
        let cols = cloneDeep(defaultColumns) // 複製預設欄位 (使用 cloneDeep, 因 object property 內容可能有 function)
        let p; // pagination 分頁設定

        // 讀取儲存的表格設定
        if (STORAGE_KEY) {
            let settings = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {} // 儲存的 DataTable 設定
            let { columns: savedColumns = {}, sorting: savedSorting = {}, pageSize, keywords } = settings // columns & 排序屬性 & 每頁筆數

            // console.log(`DataTable [${STORAGE_KEY}] 設定:`, settings);

            // 處理欄位設定
            if (Object.keys(savedColumns).length > 0) {
                // 從儲存的 columns 剔除 default columns 裡沒有的 column
                savedColumns = savedColumns.filter(col => cols.find(elm => elm.prop == col.prop))

                if (Object.keys(savedColumns).length > 0) {
                    // saved columns 加入 default columns 其它屬性 (除 width, hidden 外)
                    savedColumns = savedColumns.map(col => {
                        let col2 = cols.find(elm => elm.prop == col.prop)
                        const { width, hidden = false } = col
                        return { ...col2, width, hidden }
                    })

                    // 找出 default columns 新增的欄位, 並加到 saved columns 最前面
                    let newColumns = cols.filter(col => !(savedColumns.find(elm => elm.prop == col.prop)))
                    cols = newColumns.concat(savedColumns)
                }
            }

            // 處理排序設定
            if (Object.keys(savedSorting).length > 0) {
                // 儲存的排序欄位如有效
                let found = cols.find(col => col.prop === savedSorting.prop)
                found && setSorting(savedSorting)
            }

            // 處理每頁筆數設定
            if (pageSize ?? false) {
                // console.log(`1. [${STORAGE_KEY}] Pagination:`, pagination, '=>', { ...pagination, size: pageSize })
                p = { ...pagination, size: pageSize };
            }

            // 處理關鍵字查詢記錄
            if (keywords) {
                setkeywordHistory(keywords);
            }
        } // End of 讀取儲存的表格設定

        setPagination(p ?? { ...pagination }); // 為觸發 fetch
        setColumns(cols)
        setAfterInit(true) // 設定完成表格初始化程序
    }, [defaultColumns])

    /* keyword 或過條件更動時, 變更 pagination */
    useEffect(() => {
        if (afterInit) {
            const p = { ...pagination, page: 0 } // 跳到第一頁
            setPagination(p) // 更新 pagination 以觸發自動抓取後端資料
            // console.log(`2. [${STORAGE_KEY}] Pagination:`, p)

            if (debouncedKeyword) {
                // 將查詢關鍵字新增至歷程中
                let newHistory = insertHistory(keywordHistory, debouncedKeyword);
                setkeywordHistory(newHistory);
            }
        }
    }, [debouncedKeyword, filterParams, serviceUrl, urlParamString, options.params])

    // 查詢條件改變時, 呼叫 props.onFilterChange
    useEffect(() => {
        props.onFilterChange && props.onFilterChange(debouncedKeyword, filterOn ? filterParams : null)
    }, [debouncedKeyword, filterParams, filterOn])

    /* window size 或 columns 改變時, 調整 detail row 的 right padding */
    useEffect(() => {
        props.resizable && props.alignDetailToRight && tableWrapperRef.current && scrollContentHandler({ currentTarget: tableWrapperRef.current })
    }, [debouncedWindowSize, columns])

    /* pagination 變更時, 更新查詢後端 function */
    const fetchDataFunc = useCallback(() => {
        const { page, size } = pagination
        const { params } = props.options // params
        const { prop, order } = sorting

        // const searchParams = filterOn ? { ...filterParams, ...params } : params
        // let filter = getFilter(debouncedKeyword, searchParams)
        let filter = getFilter(debouncedKeyword, filterOn ? filterParams : null, params)

        // let sort = { field: prop, dir: order }
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
                })
    }, [pagination, sorting, filterOn])

    // hook 查詢後端資料 async function
    const { execute: fetchData, pending: loading, value: fetchedData, error: fetchError } = useResponseVO(fetchDataFunc)

    /* 查詢關鍵字/過濾條件/排序 變動時, 更新匯出資料 function */
    const exportFileFunc = useCallback(() => {
        const { prop, order } = sorting
        const { params } = props.options // params

        // const searchParams = filterOn ? { ...filterParams, ...params } : params
        // let filter = getFilter(debouncedKeyword, searchParams)
        let filter = getFilter(debouncedKeyword, filterOn ? filterParams : null, params)

        // let sort = { field: prop, dir: order }
        let sortProps = buildSortParams(sorting);
        let exportColumns = columns.filter(header => !header.hidden) // 不匯出隱藏欄位
        let reqParams = { size: 0, filter, sortProps, exportColumns } // size 設為 0, 匯出所有查詢結果 

        return !exportUrl ? null :
            fetch(exportUrl,
                {
                    body: JSON.stringify(reqParams), method: 'POST', redirect: 'manual',
                    headers: {
                        'Content-Type': 'application/json',
                        [CSRF_HEADER]: CSRF_TOKEN
                    }
                })
    }, [debouncedKeyword, filterOn, filterParams, sorting, columns, exportUrl])

    // hook 匯出資料 asyc function
    const { execute: exportFile, pending: exporting } = useAsyncDownload(exportFileFunc)

    /* fetchData 變動時, 執行查詢 */
    useEffect(() => {
        // console.log(`3. [${STORAGE_KEY}] afterInit:`, afterInit)
        afterInit && fetchData() // 表格初始化程序完成後才可真正執行查詢動作
    }, [fetchData])

    /* fetchData() 查詢結果變動時,  */
    useEffect(() => {
        fetchError && showError(fetchError.message) // 提示查詢失敗訊息

        if (fetchedData) {
            firstFetchData && setFirstFetchData(false) // 第一次執行 fetchData()

            const { total, rows } = fetchedData
            let indexedRows = []

            if (total > 0) {
                const { page, size } = pagination
                let offset = page * size

                /* Add row_index to each row */
                rows.map((row, index) => {
                    indexedRows.push({ ...row, row_index: offset + index })
                })
            } else if (firstFetchData) {
                // console.log('first fetched data is empty.........')
                setFirstFetchedDataEmpty(true) // for inner table to display <EmptyContent />
            }

            setExpandedRowsIndices([]) // 要先清空!!
            setContent({ total, data: indexedRows })
            setSelectedRowIndices([])
            setSelectedRows([])
            props.onSelectRow && props.onSelectRow([])
            tableWrapperRef.current.scrollTop = 0
        }
    }, [fetchedData, fetchError])

    /* 分頁資訊格式 */
    const pageInfoDisplay = useCallback(({ from, to, count, page }) =>
        getMessage('dataTable.pagination.display', page + 1, from, to, formatAmount(count, 0)), [getMessage]);

    /* 匯出查詢內容 */
    const exportData = async () => {
        let response = await exportFile({ fileName: `${props.options.title}` })

        if (response instanceof Error) {
            showError(response.message)
        }
    }

    /* 重新載入資料 */
    const reloadData = e => {
        setPagination({ ...pagination })
    }

    /* 取得選取的列資料 */
    const getSelectedRows = () => selectedRows;

    /* 列展開/縮合切換 */
    const toggleRowCollapse = index => {
        let expanded = expandedRowsIndices.indexOf(index) > -1

        if (expanded) {
            setExpandedRowsIndices(expandedRowsIndices.filter(i => i != index))
        } else {
            setExpandedRowsIndices(expandedRowsIndices.concat(index))
        }
    }

    /* 關鍵字查詢 on/off */
    const toggleKeywordSearch = () => {
        setKeywordSearchOn(!keywordSearchOn)
        keywordSearchOn && keyword && setKeyword('')
    }

    /* 輸入關鍵字 */
    const keywordChangedHandler = keyword => {
        setKeyword(keyword)
    }

    /* 欄位排序 */
    const sortHandler = (e, headerProp) => {
        const { prop, order } = sorting
        let sortOrder = (prop === headerProp && order === "asc") ? "desc" : "asc"

        let newSorting = { prop: headerProp, order: sortOrder }
        setSorting(newSorting)
        saveSorting(newSorting) // 儲存排序設定
    }

    /* checkbox 勾選動作 */
    const checkHandler = (rowIndex, checked) => {
        if (checked) {
            selectedRowIndices.push(rowIndex)
        } else {
            var idx = selectedRowIndices.indexOf(rowIndex)
            if (idx > -1) {
                selectedRowIndices.splice(idx, 1)
            }
        }

        let rows = content.data.filter(row => selectedRowIndices.includes(row.row_index))
        setSelectedRowIndices([...selectedRowIndices])
        setSelectedRows(rows)

        props.onSelectRow && props.onSelectRow(rows)
    }

    /* checkbox 全勾選動作 */
    const checkAllHandler = checked => {
        let rowIndices = []
        let rows = []

        if (checked) {
            rowIndices = content.data.map(row => row.row_index)
            rows = [...content.data]
        }

        setSelectedRowIndices(rowIndices)
        setSelectedRows(rows)

        props.onSelectRow && props.onSelectRow(rows)
    }

    /* 單擊列動作 */
    const clickRowHandler = row => {
        !showCheckbox && setSelectedRowIndices([row.row_index])
        props.onClickRow && props.onClickRow(row)
    }

    /* 換頁 */
    const pageChanged = (event, page) => {
        const p = { ...pagination, page }
        setPagination(p)
    }

    /* 切換每頁筆數 */
    const rowsPerPageChanged = event => {
        let newSize = event.target.value // 筆數
        let newPageCount = Math.ceil(content.total / newSize) // 頁數
        let page = pagination.page > newPageCount - 1 ? newPageCount - 1 : pagination.page // 原頁次如大於切換後的所有頁數, 則頁次指定至最後一頁

        setPagination({ ...pagination, size: newSize, page });
        savePageSize(newSize); // 儲存設定
    }

    /* 截取 scroll event, 調整 detail row 的 right padding */
    const scrollContentHandler = e => {
        const wrapper = e.currentTarget // 不可使用 e.target <= 可能會是內含元件的 scroll element        
        const offset = wrapper.scrollWidth - wrapper.clientWidth - wrapper.scrollLeft
        setScrollOffset(offset)
        // console.log('currentTarget:', wrapper, 'target:', e.target)
        // console.log('clientWidth:', wrapper.clientWidth)
        // console.log('scrollWidth:', wrapper.scrollWidth)
        // console.log('scrollLeft:', wrapper.scrollLeft)
        // console.log('scrollOffset:', offset)
    }

    /* 變更欄位設定 */
    const changeColumnsHandler = useCallback(newColumns => setColumns(newColumns), [])

    /* 回復為預設欄位設定 */
    const restoreDefaultColumnsHandler = useCallback(() => {
        //let cols = JSON.parse(JSON.stringify(defaultColumns)) // 複製預設欄位
        let cols = cloneDeep(defaultColumns) // 複製預設欄位 (使 cloneDeep, 因 object property 內容可能有 function)
        setColumns(cols)
    }, [defaultColumns])

    /* 儲存欄位設定 */
    const saveColumns = useCallback(newColumns => {
        if (storageKey) {
            let settings = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {} // 儲存的 DataTable 設定        
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, columns: newColumns.map(({ prop, width, hidden = false }) => ({ prop, width, hidden })) }))
        } else {
            console.warn('DataTable 未設定 storageKey 屬性, 無法儲存設定!')
        }
    }, [storageKey])

    /* 儲存排序設定 */
    const saveSorting = useCallback(sorting => {
        if (storageKey) {
            let settings = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {} // 儲存的 DataTable 設定        
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, sorting }))
        } else {
            console.warn('DataTable 未設定 storageKey 屬性, 無法儲存設定!')
        }
    }, []);

    /* 儲存每頁筆數設定 */
    const savePageSize = useCallback(pageSize => {
        if (storageKey) {
            let settings = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {} // 儲存的 DataTable 設定        
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, pageSize }))
        } else {
            console.warn('DataTable 未設定 storageKey 屬性, 無法儲存設定!')
        }
    }, []);

    /* 儲存查詢關鍵字歷程設定 */
    const saveKeywords = useCallback(keywords => {
        if (storageKey) {
            let settings = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}; // 儲存的 DataTable 設定        
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, keywords }));
        } else {
            console.warn('DataTable 未設定 storageKey 屬性, 無法儲存設定!');
        }
    }, []);

    /* 刪除一筆查詢關字鍵歷程 */
    const removeKeywordFromHistory = keyword => {
        let newHistory = removeFromHistory(keywordHistory, keyword);
        setkeywordHistory(newHistory);
    };

    /* 關閉欄位調整視窗 */
    const closeColumnAdjuster = useCallback(() => setAdjustColsBtnEl(null), [])

    /* 啟用/暫停 欄位過濾功能 */
    const switchColumnFilter = useCallback(e => setFilterOn(e.target.checked), [])

    /* 關閉欄位過濾視 */
    const closeColumnFilter = useCallback(() => setFilterBtnEl(null), [])

    // Column Resizer Mouse Down Event Handler
    const colResizerMouseDownHandler = useCallback((e, colIndex) => {
        e.stopPropagation(); // 防止頁面左右滑動

        // 記錄 column resizer 狀態資訊
        let headerEL = e.target.closest('th');
        colResizerRef.current = { startX: e.clientX, headerEL, startWidth: parseInt(headerEL.style.width), colIndex }
    }, []);

    // 開始調整欄位大小 (mouse move event handler)
    const mouseMoveHandler = useCallback(e => {
        if (colResizerRef.current) {
            const { startX, headerEL, startWidth, colIndex } = colResizerRef.current;

            if (headerEL) {
                let width = startWidth + e.clientX - startX;

                // 欄位寬度不可小於 50, 且滑鼠 X 座標不可超出表格右邊界 - 10
                if (width >= 50 && e.clientX < tableWrapperRef.current.clientWidth - 10) {
                    headerEL.style.width = `${width}px`;
                    colResizerRef.current.currWidth = width;
                }
            }
        }
    }, []);

    // 結束調整欄位大小 (mouse up event handler)
    const mouseUpHandler = useCallback(e => {
        if (colResizerRef.current) {
            const { colIndex, currWidth } = colResizerRef.current;
            colResizerRef.current = null;

            // 儲存欄位寬度
            columns[colIndex].width = currWidth;
            saveColumns(columns);
        }
    }, [columns]);

    return (
        <>
            {/* 等待中遮罩 */}
            <MaskModal open={waiting || exporting} />

            {/* 調整欄位 Popover */}
            <ColumnAdjuster open={Boolean(adjustColsBtnEl)} anchorEl={adjustColsBtnEl}
                anchorOrigin={POPOVER_ANCHOR_ORIGIN} transformOrigin={POPOVER_TRANSFORM_ORIGIN}
                columns={columns} onChangeColumns={changeColumnsHandler} onRestoreDefault={restoreDefaultColumnsHandler}
                onSave={saveColumns} onClose={closeColumnAdjuster} />

            {/* 過濾條件 Popover */}
            <ColumnFilter keepMounted open={Boolean(filterBtnEl)} anchorEl={filterBtnEl} disabled={!filterParams}
                transformOrigin={POPOVER_TRANSFORM_ORIGIN} anchorOrigin={POPOVER_ANCHOR_ORIGIN}
                on={filterOn} onSwitch={switchColumnFilter} onClose={closeColumnFilter}>

                {/* 過濾條件選擇 */}
                {props.filter}
            </ColumnFilter>

            {/* Table Container */
                // inner table 第一次查詢結果為空時, 顯示 <EmptyContent />
                innerTable && firstFetchedDataEmpty ? <EmptyContent /> :
                    <div className={`${props.className} ${fetchError ? 'fetchError' : ''}`}
                        onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler} onMouseLeave={mouseUpHandler}
                        onTouchMove={mouseMoveHandler} onTouchEnd={mouseUpHandler}
                    >
                        {/* 進度條及遮罩 */}
                        <ProgressMask hidden={!loading} />

                        {/* TOOL BAR */}
                        <Toolbar variant="dense" className={`toolbar ${props.toolbarClassName} ${roundCorner ? 'roundTop' : ''}`}>

                            {/* TITLE OF TABLE */}
                            {!keywordSearchOn ? (
                                <Fade in timeout={1000}>
                                    <div className="tableTitle">
                                        {
                                            typeof title === 'string' ?
                                                <Typography variant={innerTable ? "subtitle1" : "h6"}>{title}</Typography> : title
                                        }
                                    </div>
                                </Fade>
                            ) : ""}

                            {/* SEARCH BAR */}
                            {enableKeywordSearch && keywordSearchOn ? (
                                // <SearchBar keyword={keyword} keywordChanged={keywordChangedHandler} />
                                <SearchBar keyword={keyword} keywordOptions={keywordHistory} onKeywordChange={keywordChangedHandler}
                                    onRemoveKeyword={removeKeywordFromHistory} onExit={saveKeywords} />
                            ) : ""}

                            {/* ACTION BUTTONS */}
                            <Box textAlign="right" whiteSpace="nowrap" marginRight={-1.5}>
                                {/* Keyword Search Button */}
                                {enableKeywordSearch &&
                                    <IconButton color={debouncedKeyword ? 'warning' : 'default'} onClick={toggleKeywordSearch}>
                                        <Tooltip arrow title={getMessage('dataTable.actions.searchKeyword')} placement="bottom" TransitionComponent={Zoom}>
                                            <SearchIcon />
                                        </Tooltip>
                                    </IconButton>
                                }

                                {/* 表格動作列按鈕 */}
                                {props.actions}

                                {
                                    props.actionButtons && props.actionButtons.map((button, btnIdx) =>
                                        button && !button.hidden &&
                                        // injectSelectedRows=true 時, action 傳入參數 selectedRows
                                        <IconButton key={btnIdx} onClick={() => button.injectSelectedRows ? button.action(selectedRows) : button.action()}
                                            disabled={button.disabled} color={button.color || "default"}>
                                            <Tooltip arrow title={button.tooltip} placement="bottom" TransitionComponent={Zoom}><button.icon /></Tooltip>
                                        </IconButton>
                                    )
                                }

                                {/* 欄位過濾 */}
                                {props.filter &&
                                    <IconButton color={filterParams ? 'warning' : 'default'} onClick={e => setFilterBtnEl(e.currentTarget)}>
                                        <Tooltip arrow title={getMessage('dataTable.actions.filterColumns')} placement="bottom" TransitionComponent={Zoom}>
                                            {
                                                filterOn ? <FilterListIcon /> : <FilterListOffIcon />
                                            }
                                            {/* <Badge badgeContent={filterOn ? null : <BlockIcon fontSize="small" color="disabled" className={classes.filterOff} />}>
                                                <FilterListIcon />
                                            </Badge> */}
                                        </Tooltip>
                                    </IconButton>
                                }

                                {/* 複製 */}
                                {props.onCopyRows &&
                                    <IconButton key="copy" disabled={selectedRowIndices.length === 0}
                                        onClick={() => props.onCopyRows ? props.onCopyRows(selectedRows) : null}>
                                        <Tooltip arrow title={getMessage('dataTable.actions.copyRows')} placement="bottom" TransitionComponent={Zoom}>
                                            <FileCopyIcon />
                                        </Tooltip>
                                    </IconButton>
                                }

                                {/* 刪除 */}
                                {props.onDeleteRows &&
                                    <IconButton color="warning" disabled={selectedRowIndices.length === 0}
                                        onClick={() => props.onDeleteRows ? props.onDeleteRows(selectedRows) : null}>
                                        <Tooltip arrow title={getMessage('dataTable.actions.deleteRows')} placement="bottom" TransitionComponent={Zoom}>
                                            <DeleteIcon />
                                        </Tooltip>
                                    </IconButton>
                                }

                                {/* 調整欄位 */}
                                <IconButton onClick={e => setAdjustColsBtnEl(e.currentTarget)} >
                                    <Tooltip arrow title={getMessage('dataTable.actions.adjustColumns')} placement="bottom" TransitionComponent={Zoom}>
                                        <ViewColumnIcon />
                                    </Tooltip>
                                </IconButton>

                                {/* 顯示/隱藏 detail row */}
                                {props.children &&
                                    <Tooltip arrow title={getMessage('dataTable.actions.switchDetailRow')} placement="bottom" TransitionComponent={Zoom}>
                                        <Switch checked={showDetailRow} onChange={e => setShowDetailRow(e.target.checked)} />
                                    </Tooltip>
                                }

                                {/* 匯出檔案 */}
                                {exportUrl &&
                                    <IconButton onClick={exportData} disabled={content.data.length == 0} >
                                        <Tooltip arrow title={getMessage('dataTable.actions.exportFile')} placement="bottom" TransitionComponent={Zoom}>
                                            <CloudDownloadIcon />
                                        </Tooltip>
                                    </IconButton>
                                }

                                {/* 重新載入 */}
                                <IconButton onClick={reloadData} >
                                    <Tooltip arrow title={getMessage('dataTable.actions.reload')} placement="bottom" TransitionComponent={Zoom}>
                                        <RefreshIcon />
                                    </Tooltip>
                                </IconButton>
                            </Box>
                        </Toolbar>

                        {/* 分頁資訊 */}
                        {pagination.size > 0 &&
                            <div className="pageInfoBar">
                                {/* 分頁 */}
                                <TablePagination component="div" count={content.total} labelRowsPerPage={getMessage('dataTable.pagination.rowsPerPage')} rowsPerPageOptions={sizeOptions}
                                    rowsPerPage={pagination.size} page={pagination.page} onPageChange={pageChanged} onRowsPerPageChange={rowsPerPageChanged}
                                    ActionsComponent={innerTable ? TablePaginationSelectSmall : TablePaginationSelect} labelDisplayedRows={pageInfoDisplay} color="secondary"
                                    classes={{
                                        caption: 'paginationCaption', select: 'paginationSelect', toolbar: 'paginationToolbar',
                                        selectRoot: 'paginationSelectRoot'
                                    }} />

                                {/* 已選取筆數 */}
                                <Fade in={selectedRowIndices.length > 0} timeout={500}>
                                    <Typography variant="subtitle1" className="selectInfo" color="secondary" align="right">
                                        {getMessage('dataTable.labelSelected', selectedRowIndices.length)}
                                    </Typography>
                                </Fade>
                            </div>
                        }

                        {/* <Divider /> */}

                        {/* 表格內容 */}
                        <div className={`tableContentWrapper ${roundCorner ? 'roundBottom' : ''}`} ref={tableWrapperRef}
                            onScroll={props.children && props.resizable && props.alignDetailToRight ? scrollContentHandler : undefined}>

                            <TableContent innerTable={innerTable} showCheckbox={showCheckbox} resizable={resizable}
                                expandedRowsIndices={expandedRowsIndices} toggleRowCollapse={toggleRowCollapse}
                                columns={columns} data={content.data} total={content.total}
                                sortProp={sorting.prop} sortOrder={sorting.order} sortTriggered={sortHandler}
                                onSelectRow={checkHandler} selectedRowIndices={selectedRowIndices} scrollOffset={debouncedScrollOffset}
                                onSelectAllRows={checkAllHandler} onDoubleClickRow={props.onDoubleClickRow} onClickRow={clickRowHandler}
                                onColumnResizeStart={colResizerMouseDownHandler}
                            >

                                {/* detail content */}
                                {showDetailRow && props.children}
                            </TableContent>

                            {/* 無資料時顯示 */
                                !loading && content.total == 0 &&
                                <div className="emptyContentWrapper"><EmptyContent /></div>
                            }
                        </div>
                    </div >
            }
        </>
    )
}))`
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    padding: 10px 16px 20px 12px;
    box-sizing: border-box;

    &.fetchError {
        border: 2px #f44336 dashed;
        box-sizing: border-box;
        border-radius: 4px;
    }

    .toolbar {
        margin-bottom: 14px;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'linear-gradient(30deg,rgb(131 169 249 / 70%),rgb(185 203 231 / 70%),rgb(131 169 249 / 70%))' : 'linear-gradient(30deg,rgb(5, 18, 45),rgb(43, 77, 144),rgb(5, 20, 50))'};
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19'};
        border-radius: 4px;
    }

    .roundTop {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .roundBottom {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .tableTitle {
        white-space: nowrap;
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pageInfoBar {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#a4c3dd' : '#16223b'};
        user-select: none;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19'};
        border-radius: 4px 4px 0 0;
    }

    .paginationToolbar {
        min-height: 52px;
    }

    .paginationCaption {
        color: #c3c3c3;
    }
    
    .paginationSelect {
        color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? undefined : '#c3c3c3'};
        min-height: initial;
        padding-left: 5px;
        padding-right: 20px;
    }
    
    .paginationSelectRoot {
        margin-right: 8px;
    }

    .selectInfo {
        flex-grow: 1;
        min-width: 100px;
        padding-right: 16px;
    }

    .tableContentWrapper {
        flex-grow: 1;
        height: 100%;
        width: 100%;
        overflow: auto;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f6f6f6' : 'linear-gradient(315deg, #080808, #232323,#080808)'};
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19'};
        border-radius: 0 0 4px 4px;
    }

    .emptyContentWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 8px;
    }
`);

DataTable.propTypes = {
    children: PropTypes.func // render props
}

export default DataTable;