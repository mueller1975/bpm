/**
 * 表格 header 寬度調整
 */
import { styled } from '@mui/material/styles';
import React from 'react';

export default React.memo(styled(props => {
    const { colIndex, onColumnResizeStart, className } = props

    const mouseDownHandler = e => {
        onColumnResizeStart(e, colIndex);
    }

    return (
        <div className={className} onMouseDown={mouseDownHandler}>
            <div className="innerBar" />
        </div>
    )
})`
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    
    padding: 6px 0;
    display: flex;
    align-tems: center;
    justify-content: center;
    box-sizing: border-box;

    &:hover {
        cursor: col-resize;
    }

    &:hover .innerBar {
        border-color: #f50057;
    }

    .innerBar {
        height: 100%;
        width: 0;
        border: 2px dashed transparent;
    }
`);