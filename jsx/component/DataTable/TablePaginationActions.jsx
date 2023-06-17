/**
 * 表格分頁動作元件
 */
import { IconButton } from '@mui/material'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import React from 'react'
import { styled } from '@mui/material/styles';

export default styled(props => {
    const handleFirstPageButtonClick = event => {
        props.onChangePage(event, 0);
    };

    const handleBackButtonClick = event => {
        props.onChangePage(event, props.page - 1);
    };

    const handleNextButtonClick = event => {
        props.onChangePage(event, props.page + 1);
    };

    const handleLastPageButtonClick = event => {
        props.onChangePage(
            event,
            Math.max(0, Math.ceil(props.count / props.rowsPerPage) - 1),
        );
    };

    const { count, page, rowsPerPage } = props;

    return (
        <div className={props.className}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <LastPageIcon />
            </IconButton>
        </div>
    )
})`
    display: flex;
    flex-shrink: 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-left: ${({ theme }) => theme.spacing(2.5)};

    &>button {
        padding: 8px;
    }
`;