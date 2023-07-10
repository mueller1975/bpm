import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default styled(({ icon: IconComponent, message, className }) => {

    return (
        <div className={className}>
            <IconComponent />
            <Typography align="center">{message}</Typography>
        </div>
    );
})`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(0 0 0 / 38%)' : 'rgba(255, 255, 255, 0.3)'};
`;