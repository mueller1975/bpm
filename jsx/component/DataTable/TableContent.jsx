import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useMessages } from 'Hook/contextHooks.jsx'
import React from 'react'
import CollapsibleRowData from './CollapsibleRowData.jsx'
import ColumnResizer from './ColumnResizer.jsx'

// default table column width
const DEFAULT_COLUMN_WIDTH = 100

export default React.memo(styled(props => {
    const { innerTable, columns, total, data, selectedRowIndices, sortProp, sortOrder, showCheckbox, resizable, scrollOffset,
        expandedRowsIndices, toggleRowCollapse, onChangeColumnWidth, onColumnResizeStart, className } = props

    const getMessage = useMessages()

    /* 欄位排序 */
    const onSort = property => event => {
        props.sortTriggered(event, property)
    }

    /* 點擊列動作 */
    const clickRowHandler = row => {
        props.onClickRow && props.onClickRow(row)
    }

    return (
        <Table className={className}>
            {/* 欄位標題 */}
            <TableHead>
                <TableRow>
                    {/* 展開/縮合 */}
                    {props.children &&
                        <TableCell padding="none" className="tableRowFixedHeader tableRowCollapse tableHeader" />
                    }

                    {/* row index */}
                    <TableCell padding="none" align="right"
                        className={`${props.children ? 'shiftedRowIndex' : ''} tableRowFixedHeader tableRowIndex tableHeader`}>
                        <Typography variant="subtitle1" color="textSecondary">{getMessage('dataTable.rowIndex')}</Typography>
                    </TableCell>

                    {/* checkbox */}
                    {showCheckbox === true &&
                        <TableCell padding="none" align="center"
                            className={`${props.children ? 'shiftedRowCheckbox' : ''} tableRowFixedHeader tableRowCheckbox tableHeader tableRowCheckboxHeader`}>
                            <Checkbox color="warning" className="checkbox" checked={data.length > 0 && selectedRowIndices.length === data.length}
                                onChange={(e) => props.onSelectAllRows(e.target.checked)}
                                indeterminate={selectedRowIndices.length > 0 && data.length !== selectedRowIndices.length} />
                        </TableCell>
                    }

                    {/* column headers */}
                    {columns.map((header, index) => !header.hidden && (
                        <TableCell key={index} className="tableHeader" sortDirection={header.prop === sortProp ? sortOrder : false}
                            style={{ width: header.width || DEFAULT_COLUMN_WIDTH }}>
                            {
                                header.sortable === false ?
                                    <Typography variant="subtitle1" color="textSecondary" className="tableHeaderLabel">{header.name}</Typography> :
                                    <TableSortLabel active={header.prop === sortProp}
                                        direction={sortOrder === '' ? 'desc' : sortOrder} onClick={onSort(header.prop)}>
                                        <Typography variant="subtitle1" color="textSecondary" className="tableHeaderLabel">{header.name}</Typography>
                                    </TableSortLabel>
                            }

                            {/* 調整欄寬 */
                                resizable && <ColumnResizer colIndex={index} onChangeColumnWidth={onChangeColumnWidth}
                                    onColumnResizeStart={onColumnResizeStart} />
                            }
                        </TableCell>
                    ))}

                    { /* empty column for responsive layout */
                        resizable && <TableCell className="tableHeader" />
                    }
                </TableRow>
            </TableHead>

            {/* 欄位內容 */}
            <TableBody>
                <CollapsibleRowData innerTable={innerTable} columns={columns} total={total} data={data} expanded
                    selectedRowIndices={selectedRowIndices} expandedRowsIndices={expandedRowsIndices} toggleRowCollapse={toggleRowCollapse}
                    detailRow={props.children} onClickRow={clickRowHandler} onDoubleClickRow={props.onDoubleClickRow} onSelectRow={props.onSelectRow}
                    scrollOffset={scrollOffset} showCheckbox={showCheckbox} resizable={resizable} />
            </TableBody>
        </Table >
    )
})`

    table-layout: ${({ resizable }) => resizable ? 'fixed' : undefined};

    .tableRowFixedHeader {        
        z-index: 6 !important;
    }

    .tableRowCollapse {
        width: 28px;
        min-width: 28px;
        max-width: 28px;
        position: sticky;
        left: 0;
        z-index: 4;
    }

    .tableHeader {
        user-select: none;
        position: sticky;
        top: 0;
        z-index: 5;
        padding: 4px 8px;
        white-space: nowrap;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(228 236 242)' : 'rgb(1 10 29 / 80%)'};
        border: 0 !important;
        // backdrop-filter: blur(2px);
    }

    .shiftedRowIndex {
        left: 44px !important;
    }

    .shiftedRowCheckbox {
        left: 100px !important;
    }

    .tableRowIndex {
        width: 56px;
        min-width: 56px;
        max-width: 56px;
        box-sizing: border-box;
        white-space: nowrap;
        z-index: 4;
        position: sticky;
        left: 0;
        border: 0;
        padding-right: 8px;
        // backdrop-filter: blur(2px);
    }

    .tableRowCheckbox {
        position: sticky;
        left: 56px;
        width: 50px;
        min-width: 50px;
        z-index: 4;
        padding: 0 !important;
        border: 0;
        // backdrop-filter: blur(2px);
    }

    .tableRowCheckboxHeader {
        z-index: 4;
    }

    .checkbox, .expandButton {
        padding: 6px;
    }

    .tableHeaderLabel {
        font-weight: bold;
        color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'steelblue' : 'rgb(107 143 173)'};
    }

    .oddFixedColumnCell {        
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(243 243 243 / 80%)' : 'rgb(28 42 58 / 80%)'};
    }

    .evenFixedColumnCell {        
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(229 229 229 / 80%)' : 'rgb(22 31 41 / 80%)'};
    }

    .tableRow {
        :nth-of-type(odd) {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f3f3f3' : 'rgb(28 42 58)'};
        }
        :nth-of-type(even) {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(223 223 223 / 62%)' : 'rgb(22 31 41)'};
        }
        :hover {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 227 163 / 55%) !important' : 'rgb(56 73 95) !important'};
        }
        :active {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(255, 196, 0, 0.2) !important'};
        }
    }

    .collapsibleRow {
        :nth-of-type(4n+1) {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(28 42 58)'};
        }
        :nth-of-type(4n+3) {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(22 31 41)'};
        }
        :hover {
            background: rgb(56 73 95) !important;
        }
        :active {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(255, 196, 0, 0.2) !important'};
        }
    }

    .tableRowSelected {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f3e8b9 !important' : 'rgba(105, 82, 5, 0.23) !important'};

        &:nth-of-type(even) {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#efe2a9 !important' : 'rgb(78 66 22 / 64%) !important'};
        }
    }

    .tableCell {
        overflow: hidden;
        text-overflow: ellipsis;
        border: 0 !important;
        user-select: none;
    }

    .collapsible {
        transform: rotate(0deg);
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }

    .expanded {
        transform: rotate(180deg);
    }

    .noWrapCell {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .detailTableCell {
        background: black;
        border: 0;
    }

    .collapsedCell {
        padding-top: 0;
        padding-bottom: 0;
    }
    
`);