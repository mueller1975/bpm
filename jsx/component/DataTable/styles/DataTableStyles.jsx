import React from 'react'
import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
    columnResizable: {
        tableLayout: 'fixed',
    },
    tableTitle: {
        whiteSpace: 'nowrap',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    paginationCaption: {
        color: '#c3c3c3',
    },
    paginationSelect: {
        color: theme.palette.mode == 'light' ? undefined : '#c3c3c3',
        minHeight: 'initial',
        paddingLeft: 5,
        paddingRight: 20
    },
    paginationSelectRoot: {
        marginRight: 8,
    },
    tableSearch: {
        flexWrap: 'nowrap',
        flex: 1
    },
    tableContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        padding: '10px 16px 16px 12px',
        // padding: '0 16px 16px 0',
        boxSizing: 'border-box',
        // backgroundColor: theme.palette.mode == 'light' ? '#eeeeee' : '#3b3b3b'
    },
    tableContentWrapper: {
        flex: 1,
        height: '100%',
        width: '100%',
        overflow: 'auto',
        background: theme.palette.mode == 'light' ? '#f6f6f6' : 'linear-gradient(315deg, #080808, #232323,#080808)',
        boxShadow: theme.palette.mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19',
        borderRadius: '0 0 4px 4px'
    },
    tableRow: {
        // '&:last-child': {
        //     borderBottom: theme.palette.mode == 'light' ? '1px solid #e5e5e5' : undefined
        // },
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.mode == 'light' ? '#f3f3f3' : 'rgb(28 42 58)',
        },
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode == 'light' ? '#e5e5e5' : 'rgb(22 31 41)',
        },
        '&:hover': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(255 227 163 / 55%) !important' : 'rgb(56 73 95) !important',
        },
        '&:active': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(255, 196, 0, 0.2) !important',
        }
    },
    collapsibleRow: {
        // border: '0 !important',
        '&:nth-of-type(4n+1)': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(28 42 58)',
        },
        '&:nth-of-type(4n+3)': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(22 31 41)',
        },
        '&:hover': {
            background: 'rgb(56 73 95) !important',
        },
        '&:active': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(255, 196, 0, 0.2) !important',
        }
    },
    tableRowSelected: {
        // backgroundColor: theme.palette.mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(105, 82, 5, 0.23) !important',
        backgroundColor: theme.palette.mode == 'light' ? '#f3e8b9 !important' : 'rgba(105, 82, 5, 0.23) !important',

        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode == 'light' ? '#efe2a9 !important' : 'rgb(78 66 22 / 64%) !important',
        },
    },
    oddTableRowCell: {
        backgroundColor: theme.palette.mode == 'light' ? 'rgb(243 243 243 / 80%)' : 'rgb(28 42 58 / 80%)',
    },
    evenTableRowCell: {
        backgroundColor: theme.palette.mode == 'light' ? 'rgb(229 229 229 / 80%)' : 'rgb(22 31 41 / 80%)',
    },
    tableRowCollapse: {
        width: 28,
        minWidth: 28,
        maxWidth: 28,
        position: 'sticky',
        left: 0,
        // border: 0,
        zIndex: 4,
    },
    tableRowIndex: {
        width: 56,
        minWidth: 56,
        maxWidth: 56,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        zIndex: 4,
        position: 'sticky',
        left: 0,
        border: 0,
        paddingRight: 8,
    },
    shiftedRowIndex: {
        left: '44px !important'
    },
    shiftedRowCheckbox: {
        left: '100px !important'
    },
    tableRowFixedHeader: {
        zIndex: '6 !important',
    },
    tableRowCheckbox: {
        position: 'sticky',
        left: 56,
        width: 50,
        minWidth: 50,
        zIndex: 4,
        padding: '0 !important',
        border: 0,
    },
    tableHeader: {
        userSelect: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 5,
        padding: "4px 8px",
        whiteSpace: 'nowrap',
        background: theme.palette.mode == 'light' ? '#d0dced' : 'rgb(1 10 29 / 80%)',
        border: '0 !important',
    },
    collapsedCell: {
        paddingTop: 0,
        paddingBottom: 0
    },
    detailTableCell: {
        background: 'black',
        border: 0,
    },
    tableRowCheckboxHeader: {
        zIndex: 4,
    },
    tableHeaderLabel: {
        fontWeight: 'bold',
        color: theme.palette.mode == 'light' ? 'steelblue' : 'rgb(107 143 173)'
    },
    tableCell: {
        // padding: "4px 8px",
        // padding: 8,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        border: 0,
        userSelect: 'none',
        borderWidth: theme.palette.mode == 'light' ? 0 : undefined
    },
    toolbar: {
        // minHeight: 'auto !important',
        // borderTopLeftRadius: theme.shape.borderRadius,
        // borderTopRightRadius: theme.shape.borderRadius,
        marginBottom: 12,
        background: theme.palette.mode == 'light' ? 'linear-gradient(30deg,rgb(131 169 249 / 70%),rgb(185 203 231 / 70%),rgb(131 169 249 / 70%))' : 'linear-gradient(30deg,rgb(5, 18, 45),rgb(43, 77, 144),rgb(5, 20, 50))',
        boxShadow: theme.palette.mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19',
        borderRadius: 4
    },
    selectInfo: {
        flex: 1,
        minWidth: 100,
        paddingRight: 16,
    },
    pageInfoBar: {
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        overflowY: 'hidden',
        // borderBottomLeftRadius: 4,
        // borderBottomRightRadius: 4,
        background: theme.palette.mode == 'light' ? '#a4c3dd' : '#16223b',
        userSelect: 'none',
        boxShadow: theme.palette.mode == 'light' ? '8px 8px 8px 0px #72777f' : '8px 8px 8px 0px #020b19',
        borderRadius: '4px 4px 0 0'
    },
    noWrapCell: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    collapsible: {
        transform: 'rotate(0deg)',
        transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
    },
    expanded: {
        transform: 'rotate(180deg)'
    },
    fetchError: {
        border: '2px #f44336 dashed',
        boxSizing: 'border-box',
        borderRadius: 4,
    },
    checkbox: {
        padding: 6,
    },
    expandButton: {
        padding: 6,
    },
    toolbarActionButton: {
        // padding: 8,
    },
    paginationToolbar: {
        minHeight: 52
    },
    emptyContentWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 8,
    },
    roundTop: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    roundBottom: {
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
}))