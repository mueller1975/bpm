import { styled } from '@mui/material/styles';
import { SpringTransition2 } from 'Animations';
import React from 'react';

export default styled(({ buttons, className }) => {

    return (
        <div className={`MT-Floating-Actions ${className}`}>
            <SpringTransition2 effect="slideDown" items={buttons} keys={({ key }) => key} bounce={2}>
                {button => button}
            </SpringTransition2>
        </div>
    )
})`
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 4;
    transition: all 1s;
    right: 24px;
    bottom: 8px;
    opacity: ${({ hidden }) => hidden ? 0 : 1};

    .MuiFab-root {
        color: #fff;
    }
`;