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
        color: '#c3c3c3',
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
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        border: '1px outset rgb(133 61 162 / 75%)',
        borderRadius: 4,
    },
    tableContentWrapper: {
        flex: 1,
        height: '100%',
        width: '100%',
        overflow: 'auto',
        background: 'linear-gradient(315deg, #080808, #232323,#080808)',
        // display: 'flex',
        // flexDirection: 'column',
        paddingBottom: 1,
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(62 21 74)',
        },
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(62 21 74 / 80%)',
        },
        '&:hover': {
            background: 'rgb(83 43 121) !important',
        },
        '&:active': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(255, 196, 0, 0.2) !important',
        },
    },
    collapsibleRow: {
        '&:nth-of-type(4n+1)': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(62 21 74)',
        },
        '&:nth-of-type(4n+3)': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(62 21 74 / 80%)',
        },
        '&:hover': {
            background: 'rgb(83 43 121) !important',
        },
        '&:active': {
            backgroundColor: theme.palette.mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgba(255, 196, 0, 0.2) !important',
        }
    },
    tableRowSelected: {
        backgroundColor: theme.palette.mode == 'light' ? 'rgba(115, 202, 0, 0.18) !important' : 'rgb(78 38 63) !important',
    },
    oddTableRowCell: {
        backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(62 21 74 / 80%)',
    },
    evenTableRowCell: {
        backgroundColor: theme.palette.mode == 'light' ? 'rgb(192 211 232 / 67%)' : 'rgb(50 17 59 / 80%)',
    },
    tableRowCollapse: {
        width: 28,
        minWidth: 28,
        maxWidth: 28,
        position: 'sticky',
        left: 0,
        // border: 0,
        zIndex: 1,
    },
    tableRowIndex: {
        width: 56,
        minWidth: 56,
        maxWidth: 56,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        zIndex: 1,
        position: 'sticky',
        left: 0,
        borderColor: '#5a365a',
        // border: 0,
        paddingRight: 8,
    },
    shiftedRowIndex: {
        left: '44px !important'
    },
    shiftedRowCheckbox: {
        left: '100px !important'
    },
    tableRowFixedHeader: {
        zIndex: '3 !important',
    },
    tableRowCheckbox: {
        position: 'sticky',
        left: 56,
        width: 50,
        minWidth: 50,
        zIndex: 1,
        padding: '0 !important',
        // border: 0,
    },
    tableHeader: {
        userSelect: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        padding: "4px 8px",
        whiteSpace: 'nowrap',
        background: theme.palette.mode == 'light' ? 'rgb(208 212 218 / 93%)' : 'rgb(32 4 41 / 80%)',
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
        zIndex: 1,
    },
    tableHeaderLabel: {
        fontWeight: 'bold',
    },
    tableCell: {
        // padding: "4px 8px",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        borderColor: '#5a365a',
        // border: '0 !important',
        userSelect: 'none',
    },
    toolbar: {
        minHeight: '0 !important',
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        background: theme.palette.mode == 'light' ? 'linear-gradient(30deg,rgb(131 169 249 / 71%),rgb(145 170 220 / 66%),rgb(139 172 236 / 84%))' : 'linear-gradient(30deg,rgb(32 0 56),rgb(78 32 136),rgb(32 0 56))'
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
        background: 'rgb(32 4 41)',
        userSelect: 'none',
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
    collapsedCell: {
        paddingTop: 0,
        paddingBottom: 0
    },
    detailTableCell: {
        background: 'black',
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
        padding: 8,
    },
    paginationToolbar: {
        minHeight: 'auto'
    },
    emptyContentWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 8,
    },
    filterPaper: {
        overflow: 'hidden',
        padding: '8px 16px 12px',
        background: theme.palette.mode == 'dark' ? 'rgb(5 26 58 / 90%)' : 'rgba(43, 82, 73, 0.9)',
    },
}))