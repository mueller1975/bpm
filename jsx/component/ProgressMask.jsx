/**
 * 進度條及遮罩
 */
import { LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default styled(props => {
    const { hidden = true, className } = props

    return (
        <>
            {hidden ? null : <LinearProgress className={`${className} linear`} classes={{ barColorPrimary: 'barColorPrimary' }} />}
            {hidden ? null : <div className={`${className} mask`} />}
        </>
    )
})`
    &.mask {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 35%);
    }

    &.linear {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 11;
        width: 100%;
        background-color: #ffc107;
    }

    .barColorPrimary {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgba(249, 64, 64, 0.6)' : 'rgba(105, 226, 43, 0.6)'};
    }
`;