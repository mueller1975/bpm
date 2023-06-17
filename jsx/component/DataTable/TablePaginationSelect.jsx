/**
 * 表格分頁動作元件
 */
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import React from 'react';

export const TablePaginationSelect = styled(props => {

    /* 切換頁次動作 */
    const paginationChangedHandler = (e, p) => {
        props.onPageChange(e, p - 1)
    }

    const { count, page, rowsPerPage, small = false } = props;

    const pageCount = Math.ceil(count / rowsPerPage)
    const size = small ? "small" : "medium"

    return (
        <div className={props.className}>
            {/* Pagination 的 page 是以 1 為起始 */}
            <Pagination count={pageCount} page={page + 1} variant="outlined" color="secondary"
                onChange={paginationChangedHandler} size={size} />
        </div>
    )
})`
    display: flex;
    flex-shrink: 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-left: ${({ theme }) => theme.spacing(1)};
    margin-right: ${({ theme }) => theme.spacing(1)};
`;

export const TablePaginationSelectSmall = props => {
    return <TablePaginationSelect small {...props} />
}