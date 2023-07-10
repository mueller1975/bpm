import {
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TablePaginationSelectSmall } from 'Component/DataTable/TablePaginationSelect.jsx';
import { LoadableView } from 'Components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatAmount } from 'Tools';

// 分頁資訊格式
const PAGE_INFO_DISPLAY = ({ from, to, count, page }) => `第 ${formatAmount(from, 0)}-${formatAmount(to, 0)} 筆 / 共 ${formatAmount(count, 0)} 筆`;

// 每頁筆數選項
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
// const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100, { label: 'All', value: -1 }];

export default React.memo(styled(props => {
    const { data, columns, className, loading = false, message, progress, loadError, onClickRow, onDoubleClickRow } = props;
    const [pageData, setPageData] = useState([]); // 當頁資料
    const [rowsPerPage, setRowsPerPage] = useState(20); // 每頁幾筆
    const [page, setPage] = useState(0); // 目前第幾頁
    const [clickedRowIdx, setClickedRowIdx] = useState(-1); // 目前點擊的列

    useEffect(() => {
        if (rowsPerPage == -1) { // ALL
            setPageData(0, data.length);
        } else {
            let from = page * rowsPerPage;
            let to = (page + 1) * rowsPerPage;
            setPageData(data.slice(from, to));
        }
    }, [data, page, rowsPerPage]);

    // 點擊列
    const clickRowHandler = useCallback((row, index) => {
        setClickedRowIdx(index);
        onClickRow && onClickRow(row);
    }, [onClickRow]);

    // 換頁
    const pageChangeHandler = useCallback((event, page) => setPage(page), []);

    // 變更每頁筆數
    const pageRowsChangeHandler = useCallback(event => {
        let pageRows = event.target.value;
        let totalPages = Math.ceil(data.length / pageRows);

        if (totalPages > 0) {
            let p = page > totalPages - 1 ? totalPages - 1 : page;
            setPage(p);
        }

        setRowsPerPage(pageRows);
    }, [data, page]);

    // 表格標題列
    const tableColumns = useMemo(() => !columns ? undefined :
        columns.map(({ prop, title, width }) =>
            <TableCell key={prop} width={width} className="tableHeaderLabel">
                <Typography variant="subtitle1" color="textSecondary" className="tableHeaderLabel">{title}</Typography>
            </TableCell>)
        , [columns]);

    // 表格內容
    const tableBody = useMemo(() => {
        if (pageData) {
            let body = pageData.map((row, index) => {
                const rowIdx = page * rowsPerPage + index;

                return (
                    <TableRow key={index} className={rowIdx == clickedRowIdx ? 'clickedRow' : 'notClicked'}
                        onClick={() => clickRowHandler(row, rowIdx)}
                        onDoubleClick={() => onDoubleClickRow(row)}>

                        <TableCell align="center">{rowIdx + 1}.</TableCell>
                        {
                            columns.map(({ prop, align, converter }) =>
                                <TableCell key={prop} align={align || 'left'}>
                                    <Typography color="textSecondary" variant="subtitle2">{converter ? converter(row[prop]) : row[prop]}</Typography>
                                </TableCell>)
                        }
                    </TableRow>);
            });

            return body;
        }
    }, [pageData, clickedRowIdx]);

    return (
        <LoadableView loading={loading} error={loadError} message={message} progress={progress}>
            <div className={className}>
                <Toolbar disableGutters variant="dense" className="toolbar">
                    <TablePagination component="div" count={data.length} rowsPerPage={rowsPerPage} page={page}
                        labelRowsPerPage="每頁筆數" labelDisplayedRows={PAGE_INFO_DISPLAY}
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        onPageChange={pageChangeHandler} onRowsPerPageChange={pageRowsChangeHandler}
                        ActionsComponent={TablePaginationSelectSmall} />
                </Toolbar>

                <TableContainer className="tableContainer">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell width={40} align="center">#</TableCell>
                                {tableColumns}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tableBody}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </LoadableView>
    );
})`
    background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(201 201 201 / 80%)' : 'rgb(9 11 26 / 80%)'};
    height: inherit;
    border-radius: 4px;
    display: flex;
    flex-direction: column;

    .tableContainer {
        flex-grow: 1;
    }

    table {
        table-layout: fixed;
    }
    
    .toolbar {
        border-radius: 4px 4px 0 0;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#a4c3dd' : '#16223b'};
        user-select: none;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19'};
    }

    .tableHeaderLabel {
        font-weight: bold;
        color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'steelblue' : 'rgb(107 143 173)'};
    }

    thead th {
        // background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(169 182 199)' : 'rgb(89 105 124)'};
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#d0dced' : 'rgb(1 10 29 / 95%)'};
    }

    tbody tr:nth-of-type(odd) {
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(187 187 187 / 80%)' : 'rgb(43 52 67 / 80%)'};
    }

    tbody tr:nth-of-type(even) {
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(135 150 173 / 60%)' : 'rgb(24 36 54 / 60%)'};
    }

    tbody tr:hover {
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(165 178 199)' : 'rgb(79 91 110)'};
    }

    tr.clickedRow {
        background: #cc8319 !important;
    }
`);