import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Checkbox, Collapse, IconButton, TableCell, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import React, { useMemo } from 'react'

// default table column width
const DEFAULT_COLUMN_WIDTH = 100

export default React.memo(props => {
    const { innerTable, columns, total, data, expandedRowsIndices, toggleRowCollapse, selectedRowIndices, onDoubleClickRow, onSelectRow,
        showCheckbox, resizable } = props

    const theme = useTheme()
    const { padding: cellPadding } = theme.components.MuiTableCell.styleOverrides.root // 取得 table cell padding

    const detailRowColspan = useMemo(
        () => columns.filter(col => !col.hidden).length + 1 + (showCheckbox ? 1 : 0) + (resizable ? 1 : 0) + (props.detailRow ? 1 : 0)
        , [columns, showCheckbox, resizable, props.detaliRow])

    const clickRowHandler = (e, row) => {
        e.stopPropagation();
        props.onClickRow && props.onClickRow(row)
    }

    const dblClickRowHandler = (e, row) => {
        e.stopPropagation();
        onDoubleClickRow && onDoubleClickRow(row);
    }

    return (
        <>
            {
                total > 0 &&
                data.map((row, index) => {
                    const fixedColCellClass = index % 2 == 0 ? "oddFixedColumnCell" : "evenFixedColumnCell"
                    const rowExpanded = expandedRowsIndices.indexOf(index) > -1

                    return (
                        <React.Fragment key={row.id || index}>
                            <TableRow className={props.detailRow ? 'collapsibleRow' : 'tableRow'}
                                onClick={e => clickRowHandler(e, row)} onDoubleClick={e => dblClickRowHandler(e, row)}
                                hover selected={selectedRowIndices.indexOf(row.row_index) > -1} classes={{ selected: 'tableRowSelected' }}>

                                {/* 展開/縮合鈕 */
                                    props.detailRow &&
                                    <TableCell padding="none" align="right" className={`tableRowCollapse ${fixedColCellClass}`}>
                                        <IconButton onClick={() => toggleRowCollapse(index)} className="expandButton">
                                            <ExpandMoreIcon className={`collapsible ${rowExpanded ? 'expanded' : ''}`} />
                                        </IconButton>
                                    </TableCell>
                                }

                                {/* Row Index */}
                                <TableCell padding="none" align="right" className={`${props.detailRow ? 'shiftedRowIndex' : ''} tableRowIndex ${fixedColCellClass}`}>
                                    <Typography variant="subtitle2" color="textSecondary">{row.row_index + 1}.</Typography>
                                </TableCell>

                                {/* Row Checkbox */}
                                {showCheckbox === true &&
                                    <TableCell padding="none" align="center" className={`${props.detailRow ? 'shiftedRowCheckbox' : ''} tableRowCheckbox ${fixedColCellClass}`}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            <Checkbox color="warning" checked={selectedRowIndices.indexOf(row.row_index) > -1} className="checkbox"
                                                onChange={(e, checked) => { onSelectRow(row.row_index, checked) }} />
                                        </Typography>
                                    </TableCell>
                                }

                                {/* 欄位內容 */}
                                {columns.map((header, index) => {
                                    let v = row[header.prop];
                                    let contentStyle = typeof header.contentStyle == 'function' ? header.contentStyle(v) : header.contentStyle;

                                    v = typeof header.value == 'function' ? header.value(header.prop, row) :
                                        (Array.isArray(v) ? v.join(', ') : (typeof v == 'boolean' ? v.toString() : v));
                                    v = typeof header.converter == 'function' ? header.converter(v) : v;

                                    return header.hidden ? undefined :
                                        <TableCell key={index} className="tableCell" align={header.align || 'left'}>
                                            <Typography variant="subtitle2" color="textSecondary" className={`${header.noWrap ? 'noWrapCell' : ''}`}
                                                sx={contentStyle}>
                                                {v}
                                            </Typography>
                                        </TableCell>
                                })}

                                {/* empty column for responsive layout */
                                    resizable && <TableCell className="tableCell" />
                                }
                            </TableRow>

                            {/* detail row content */
                                props.detailRow &&
                                <TableRow>
                                    <TableCell colSpan={detailRowColspan} className={`detailTableCell ${!rowExpanded ? 'collapsedCell' : ''}`}
                                        style={{ paddingRight: !innerTable ? (props.scrollOffset + cellPadding) : cellPadding }}>

                                        <Collapse in={rowExpanded} timeout="auto" unmountOnExit>
                                            {props.detailRow(row)}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            }
                        </React.Fragment>
                    )
                })
            }
        </>
    )
});