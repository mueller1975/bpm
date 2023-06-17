/**
 * DataTable Component
 */
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Box, Fade, IconButton, Switch, TablePagination, Toolbar, Tooltip, Typography, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated, config, useChain, useSpringRef } from '@react-spring/web';
import { SpringTransition2 } from 'Animations';
import { ProgressMask } from 'Components';
import { useMessages } from 'Hook/contextHooks.jsx';
import { useFadeSpring, useSlideSpring } from 'Hook/useAnimations.jsx';
import { useDebounce, useWindowSize } from 'Hook/useTools.jsx';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { formatAmount, insertHistory, removeFromHistory } from 'Tools';
import { getTableConfig } from './api/tools.js';
import ColumnAdjuster from './ColumnAdjuster.jsx';
import ColumnFilter from './ColumnFilter.jsx';
import SearchBar from './SearchBar.jsx';
import TableContent from './TableContent.jsx';
import { TablePaginationSelect, TablePaginationSelectSmall } from './TablePaginationSelect.jsx';

/* 表格內容為空時顯示 component */
const EmptyContent = props => {
    const getMessage = useMessages()
    return <Typography color="secondary" align="center">{getMessage('dataTable.emptyContent')}</Typography>
}

const DEFAULT_PAGE_SIZE = 25;
const POPOVER_TRANSFORM_ORIGIN = { vertical: 'top', horizontal: 'center' }
const POPOVER_ANCHOR_ORIGIN = { vertical: 'bottom', horizontal: 'center' }

/* DataTable component */
const DataTable = React.memo(styled(React.forwardRef((props, ref) => {

    /* Component props */
    const {
        title, // 表格標題
        columns: defaultColumns, // 表格行設定: 預設欄位        
        data, dataError, // 表格資料, 資料取得失敗 error
        sortProp, sortOrder, pageSize = DEFAULT_PAGE_SIZE, // 排序欄位, 順序, 分頁大小
        sizeOptions = [10, 25, 50], // 分頁大小選項

        filter, // 查詢過濾 UI
        filterParams, // 查詢過濾條件

        actionButtons, // 表格動作
        processing = false, // 處理中?

        storageKey, // 儲存表格設定的 key
        enableKeywordSearch, showCheckbox, // 啟用關鍵字搜尋?, 顯示列 checkbox?
        resizable, alignDetailToRight, // 欄位可調整大小?, 子表格對齊表格?
        innerTable, roundCorner, // 子表格?, 表格圓滑角?

        onClickRow, // 點擊列動作
        onDoubleClickRow, // 雙擊列動作
        onSelectRow, // 選取列動作
        onQuery, // 觸發查詢動作
        onExport, // 匯出資料
    } = props;

    /* Component states */
    const [firstFetchData, setFirstFetchData] = useState(true) // 第一次執行 fetchData()
    const [firstFetchedDataEmpty, setFirstFetchedDataEmpty] = useState(false) // 第一次執行 fetchData() 結果為空 (for inner table to display <EmptyContent />)

    const [keywordSearchOn, setKeywordSearchOn] = useState(false) // 切換查詢關鍵字搜尋
    const [content, setContent] = useState({ total: 0, data: [] }) // 表格內容
    const [keyword, setKeyword] = useState(null) // 查詢關鍵字

    const [selectedRows, setSelectedRows] = useState([]) // 已選取列
    const [selectedRowIndices, setSelectedRowIndices] = useState([]) // 已選取列 indices
    const [scrollOffset, setScrollOffset] = useState(0) // table wrapper scrollbar 目前位置至右邊界距離 (為動態調整 detail row 的 right padding)
    const [expandedRowsIndices, setExpandedRowsIndices] = useState([]) // 列展開/縮合狀態
    const [showDetailRow, setShowDetailRow] = useState(true) // 顯示/隱藏 detail row
    const [filterBtnEl, setFilterBtnEl] = useState(null) // 過濾條件 button element
    const [filterOn, setFilterOn] = useState(true) // 啟用過濾條件
    const [adjustColsBtnEl, setAdjustColsBtnEl] = useState(null) // 調整欄位 button element

    const STORAGE_KEY = storageKey ? `${storageKey}-DataTable` : null // 儲存表格設定 key
    const [tableConfig] = useState(() => getTableConfig(STORAGE_KEY, defaultColumns, pageSize, { prop: sortProp, order: sortOrder }));

    const [queryOptions, setQueryOptions] = useState({ pagination: tableConfig.pagination, sorting: tableConfig.sorting });
    const [keywordHistory, setKeywordHistory] = useState(tableConfig.keywords ?? []); // 關鍵字查詢記錄
    const [columns, setColumns] = useState(tableConfig.columns ?? []) // 表格欄位設定

    const { pagination, sorting } = queryOptions;

    const tableWrapperRef = useRef(null) // ref of table wrapper
    const colResizerRef = useRef(); // 目前點擊的欄位 resizer ref
    const keywordInputRef = useRef(); // 查詢關鍵字輸入欄位 ref
    const windowSize = useWindowSize() // hook current window size
    const getMessage = useMessages() // 多語系轉換 function

    const debouncedKeyword = useDebounce(keyword?.trim(), 500) // keyword 延遲
    const debouncedScrollOffset = useDebounce(scrollOffset, 300) // scroll 延遲
    const debouncedWindowSize = useDebounce(windowSize, 300) // window size 延遲

    /* expose functions to parent component */
    useImperativeHandle(ref, () => ({
        reloadData, // 重新載入表格資料
        getSelectedRows, // 取得選取的資料列
        getSelectedRowIndices: () => selectedRowIndices, // 取得選取資料列的 index
    }));

    /* keyword 更動時, 變更 pagination */
    useEffect(() => {
        if (debouncedKeyword != null) {
            const p = { ...pagination, page: 0 } // 跳到第一頁
            setQueryOptions({ ...queryOptions, pagination: p });

            // 將查詢關鍵字新增至歷程中
            if (debouncedKeyword) {
                let newHistory = insertHistory(keywordHistory, debouncedKeyword);
                setKeywordHistory(newHistory);
            }
        }
    }, [debouncedKeyword]);

    /* 過濾條件/開關變動時 */
    useEffect(() => {
        if (data) {
            const p = { ...pagination, page: 0 } // 跳到第一頁
            setQueryOptions({ ...queryOptions, pagination: p });
        }
    }, [filterParams, filterOn]);

    // 分頁/排序/啟用過濾條件 變動時, 執行 props.onQuery()
    useEffect(() => {
        if (queryOptions) {
            onQuery({ ...queryOptions, searchKeyword: debouncedKeyword, filterOn, columns });
        }
    }, [queryOptions]);

    // 查詢條件改變時, 呼叫 props.onFilterChange
    useEffect(() => {
        props.onFilterChange && props.onFilterChange(debouncedKeyword, filterOn ? filterParams : null)
    }, [debouncedKeyword, filterParams, filterOn])

    /* window size 或 columns 改變時, 調整 detail row 的 right padding */
    useEffect(() => {
        resizable && alignDetailToRight && tableWrapperRef.current && scrollContentHandler({ currentTarget: tableWrapperRef.current })
    }, [debouncedWindowSize, columns])

    /* data 變動時  */
    useEffect(() => {
        if (pagination && data) {
            const { total, rows } = data
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
            onSelectRow && onSelectRow([])
            tableWrapperRef.current.scrollTop = 0
        }
    }, [data]);

    /* 分頁資訊格式 */
    const pageInfoDisplay = useCallback(({ from, to, count, page }) =>
        getMessage('dataTable.pagination.display', page + 1, from, to, formatAmount(count, 0))
        , [getMessage]);

    /* 重新載入資料 */
    const reloadData = useCallback(() => setQueryOptions({ ...queryOptions }), [queryOptions]);

    /* 取得選取的列資料 */
    const getSelectedRows = useCallback(() => selectedRows, [selectedRows]);

    /* 列展開/縮合切換 */
    const toggleRowCollapse = useCallback(index => {
        let expanded = expandedRowsIndices.indexOf(index) > -1

        if (expanded) {
            setExpandedRowsIndices(expandedRowsIndices.filter(i => i != index))
        } else {
            setExpandedRowsIndices(expandedRowsIndices.concat(index))
        }
    }, [expandedRowsIndices]);

    /* 關鍵字查詢 on/off */
    const toggleKeywordSearch = useCallback(() => {
        setKeywordSearchOn(!keywordSearchOn); // turn on/off 關鍵字查詢
        keywordSearchOn && keyword && setKeyword(''); // 若為 off, 清空關鍵字
        // !keywordSearchOn && keywordInputRef.current.focus(); // 若為 on, 主動 focus 在查詢關鍵字欄位
    }, [keywordSearchOn, keyword]);

    /* 輸入關鍵字 */
    const keywordChangedHandler = useCallback(word => setKeyword(word), []);

    /* 欄位排序 */
    const sortHandler = useCallback((e, headerProp) => {
        const { prop, order } = sorting
        let sortOrder = (prop === headerProp && order === "asc") ? "desc" : "asc"

        let newSorting = { prop: headerProp, order: sortOrder }
        setQueryOptions({ ...queryOptions, sorting: newSorting });
        saveSorting(newSorting) // 儲存排序設定
    }, [sorting, queryOptions]);

    /* checkbox 勾選動作 */
    const checkHandler = useCallback((rowIndex, checked) => {
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

        onSelectRow && onSelectRow(rows)
    }, [selectedRowIndices, content]);

    /* checkbox 全勾選動作 */
    const checkAllHandler = useCallback(checked => {
        let rowIndices = []
        let rows = []

        if (checked) {
            rowIndices = content.data.map(row => row.row_index)
            rows = [...content.data]
        }

        setSelectedRowIndices(rowIndices)
        setSelectedRows(rows)

        onSelectRow && onSelectRow(rows)
    }, [content]);

    /* 單擊列動作 */
    const clickRowHandler = useCallback(row => {
        !showCheckbox && setSelectedRowIndices([row.row_index])
        onClickRow && onClickRow(row)
    }, []);

    /* 換頁 */
    const pageChanged = useCallback((event, page) => {
        const p = { ...pagination, page }
        // setPagination(p)
        setQueryOptions({ ...queryOptions, pagination: p });
    }, [queryOptions]);

    /* 切換每頁筆數 */
    const rowsPerPageChanged = useCallback(event => {
        let newSize = event.target.value // 筆數
        let newPageCount = Math.ceil(content.total / newSize) // 頁數
        let page = pagination.page > newPageCount - 1 ? newPageCount - 1 : pagination.page // 原頁次如大於切換後的所有頁數, 則頁次指定至最後一頁

        // setPagination({ ...pagination, size: newSize, page });
        setQueryOptions({ ...queryOptions, pagination: { size: newSize, page } })

        savePageSize(newSize); // 儲存設定
    }, [content, queryOptions]);

    /* 截取 scroll event, 調整 detail row 的 right padding */
    const scrollContentHandler = useCallback(e => {
        const wrapper = e.currentTarget // 不可使用 e.target <= 可能會是內含元件的 scroll element        
        const offset = wrapper.scrollWidth - wrapper.clientWidth - wrapper.scrollLeft
        setScrollOffset(offset)
        // console.log('currentTarget:', wrapper, 'target:', e.target)
        // console.log('clientWidth:', wrapper.clientWidth)
        // console.log('scrollWidth:', wrapper.scrollWidth)
        // console.log('scrollLeft:', wrapper.scrollLeft)
        // console.log('scrollOffset:', offset)
    }, []);

    /* 變更欄位設定 */
    const changeColumnsHandler = useCallback(newColumns => setColumns(newColumns), []);

    /* 回復為預設欄位設定 */
    const restoreDefaultColumnsHandler = useCallback(() => {
        //let cols = JSON.parse(JSON.stringify(defaultColumns)) // 複製預設欄位
        let cols = cloneDeep(defaultColumns) // 複製預設欄位 (使 cloneDeep, 因 object property 內容可能有 function)
        setColumns(cols)
    }, [defaultColumns]);

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

    /* 刪除一筆查詢關鍵字歷程 */
    const removeKeywordFromHistory = useCallback(word => {
        let newHistory = removeFromHistory(keywordHistory, word);
        setKeywordHistory(newHistory);
    }, [keywordHistory]);

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

    const toolbarButtons = useMemo(() => [
        // Keyword Search Button
        !enableKeywordSearch ? null :
            <IconButton key="search" color={debouncedKeyword ? 'warning' : 'default'} onClick={toggleKeywordSearch}>
                <Tooltip arrow title={getMessage('dataTable.actions.searchKeyword')} placement="bottom" TransitionComponent={Zoom}>
                    <SearchIcon />
                </Tooltip>
            </IconButton>,

        // 表格動作列按鈕
        ...(!actionButtons ? [] : actionButtons.map((button, btnIdx) => {
            const IconComponent = button.icon ?? QuestionMarkIcon;

            return button.hidden ? null :
                // injectSelectedRows=true 時, action 傳入參數 selectedRows
                <IconButton key={button.id} disabled={button.disabled} color={button.color ?? "default"}
                    onClick={() => button.injectSelectedRows ? button.action(selectedRows) : button.action()}>
                    <Tooltip arrow title={button.tooltip} placement="bottom" TransitionComponent={Zoom}>
                        <IconComponent />
                    </Tooltip>
                </IconButton>
        })),

        // 欄位過濾
        !filter ? null :
            <IconButton key="filter" color={filterParams ? 'warning' : 'default'} onClick={e => setFilterBtnEl(e.currentTarget)}>
                <Tooltip arrow title={getMessage('dataTable.actions.filterColumns')} placement="bottom" TransitionComponent={Zoom}>
                    {
                        filterOn ? <FilterListIcon /> : <FilterListOffIcon />
                    }
                    {/* <Badge badgeContent={filterOn ? null : <BlockIcon fontSize="small" color="disabled" className={classes.filterOff} />}>
                        <FilterListIcon />
                    </Badge> */}
                </Tooltip>
            </IconButton>,

        // 複製
        !props.onCopyRows ? null :
            <IconButton key="copy" disabled={selectedRowIndices.length === 0}
                onClick={() => props.onCopyRows ? props.onCopyRows(selectedRows) : null}>
                <Tooltip arrow title={getMessage('dataTable.actions.copyRows')} placement="bottom" TransitionComponent={Zoom}>
                    <FileCopyIcon />
                </Tooltip>
            </IconButton>,

        // 刪除
        !props.onDeleteRows ? null :
            <IconButton key="delete" color="warning" disabled={selectedRowIndices.length === 0}
                onClick={() => props.onDeleteRows ? props.onDeleteRows(selectedRows) : null}>
                <Tooltip arrow title={getMessage('dataTable.actions.deleteRows')} placement="bottom" TransitionComponent={Zoom}>
                    <DeleteIcon />
                </Tooltip>
            </IconButton>,

        // 調整欄位
        <IconButton key="adjustColumns" onClick={e => setAdjustColsBtnEl(e.currentTarget)} >
            <Tooltip arrow title={getMessage('dataTable.actions.adjustColumns')} placement="bottom" TransitionComponent={Zoom}>
                <ViewColumnIcon />
            </Tooltip>
        </IconButton>,

        // 顯示/隱藏 detail row
        !props.children ? null :
            <Tooltip key="detailRow" arrow title={getMessage('dataTable.actions.switchDetailRow')} placement="bottom" TransitionComponent={Zoom}>
                <Switch checked={showDetailRow} onChange={e => setShowDetailRow(e.target.checked)} />
            </Tooltip>,

        // 匯出檔案
        !onExport ? null :
            <IconButton key="export" onClick={onExport} disabled={content.data.length == 0} >
                <Tooltip arrow title={getMessage('dataTable.actions.exportFile')} placement="bottom" TransitionComponent={Zoom}>
                    <CloudDownloadIcon />
                </Tooltip>
            </IconButton>,

        // 重新載入
        <IconButton key="reload" onClick={reloadData} >
            <Tooltip arrow title={getMessage('dataTable.actions.reload')} placement="bottom" TransitionComponent={Zoom}>
                <RefreshIcon />
            </Tooltip>
        </IconButton>,
    ].filter(action => Boolean(action))
        , [actionButtons, selectedRows, content, toggleKeywordSearch, debouncedKeyword]);

    // 表格標題微動畫 style props
    const titleRef = useSpringRef();
    const titleStyleProps = useSlideSpring({
        ref: titleRef,
        config: { friction: 10, tension: 180 },
        reverse: keywordSearchOn,
    });

    // 查詢關鍵字微動畫 style props
    const searchRef = useSpringRef();
    const searchStyleProps = useFadeSpring({
        ref: searchRef,
        config: config.stiff,
        reverse: !keywordSearchOn,
        onRest: () => keywordSearchOn && keywordInputRef.current.focus() // 若開啟關鍵字查詢, 主動 focus 在查詢關鍵字欄位
    });

    useChain(keywordSearchOn ? [titleRef, searchRef] : [searchRef, titleRef], [0, .5]);

    return (
        <>
            {/* 等待中遮罩 */}
            {/* <MaskModal open={waiting || exporting} /> */}

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
                {filter}
            </ColumnFilter>

            {/* Table Container */
                // inner table 第一次查詢結果為空時, 顯示 <EmptyContent />
                innerTable && firstFetchedDataEmpty ? <EmptyContent /> :
                    <div className={`${props.className} ${dataError ? 'dataError' : ''}`}
                        onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler} onMouseLeave={mouseUpHandler}
                        onTouchMove={mouseMoveHandler} onTouchEnd={mouseUpHandler}
                    >
                        {/* 進度條及遮罩 */}
                        <ProgressMask hidden={!processing} />

                        {/* TOOL BAR */}
                        <Toolbar variant="dense" className={`toolbar ${props.toolbarClassName} ${roundCorner ? 'roundTop' : ''}`}>

                            {/* TITLE / Search Bar */}
                            <div className="tableTitle">
                                {/* 表格標題 */}
                                <animated.div style={titleStyleProps}>
                                    {
                                        typeof title === 'string' ?
                                            <Typography variant={innerTable ? "subtitle1" : "h6"}>{title}</Typography> : title
                                    }
                                </animated.div>

                                {/* 查詢關鍵字 */}
                                <animated.div style={searchStyleProps}>
                                    <SearchBar keyword={keyword} keywordOptions={keywordHistory} onKeywordChange={keywordChangedHandler}
                                        onRemoveKeyword={removeKeywordFromHistory} onExit={saveKeywords} inputRef={keywordInputRef}
                                        disabled={!keywordSearchOn} />
                                </animated.div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <Box textAlign="right" whiteSpace="nowrap" marginRight={-1.5} display="flex" position="relative">
                                <SpringTransition2 effect="slideDown" items={toolbarButtons} keys={({ key }) => key} trail={100} delay={500}>
                                    {
                                        action => action
                                    }
                                </SpringTransition2>
                            </Box>
                        </Toolbar>

                        {/* 分頁資訊 */}
                        {pagination?.size > 0 &&
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
                            onScroll={props.children && resizable && alignDetailToRight ? scrollContentHandler : undefined}>

                            <TableContent innerTable={innerTable} showCheckbox={showCheckbox} resizable={resizable}
                                expandedRowsIndices={expandedRowsIndices} toggleRowCollapse={toggleRowCollapse}
                                columns={columns} data={content.data} total={content.total}
                                sortProp={sorting.prop} sortOrder={sorting.order} sortTriggered={sortHandler}
                                onSelectRow={checkHandler} selectedRowIndices={selectedRowIndices} scrollOffset={debouncedScrollOffset}
                                onSelectAllRows={checkAllHandler} onDoubleClickRow={onDoubleClickRow} onClickRow={clickRowHandler}
                                onColumnResizeStart={colResizerMouseDownHandler}
                            >

                                {/* detail content */}
                                {showDetailRow && props.children}
                            </TableContent>

                            {/* 無資料時顯示 */
                                !processing && content.total == 0 &&
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
    // padding: 10px 16px 20px 12px;
    padding: 12px 20px 20px 16px;
    box-sizing: border-box;

    &.dataError {
        border: 2px #f44336 dashed;
        box-sizing: border-box;
        border-radius: 4px;
    }

    .toolbar {
        margin-bottom: 14px;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'linear-gradient(30deg, rgb(167 202 234 / 51%),rgb(182 201 220 / 51%), rgb(167 202 234 / 51%))' : 'linear-gradient(30deg,rgb(5, 18, 45),rgb(43, 77, 144),rgb(5, 20, 50))'};
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#01030a 8px 8px 8px 0px'};
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
        position: relative;
        height: 100%;
        white-space: nowrap;
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        
        >div {
            position: absolute;
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
        }
    }

    .pageInfoBar {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(167 202 234 / 51%)' : '#16223b'};
        user-select: none;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#01030a 8px 8px 8px 0px'};
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
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#01030a 8px 8px 8px 0px'};
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