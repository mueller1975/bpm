import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default React.memo(styled(props => {
    const { iconComponent: IconComponent, title, className } = props;

    return (
        <div className={className}>
            <IconComponent color="primary" />
            <Typography variant="h6">{title}</Typography>
        </div>
    );
})`
    display: flex;
    align-items: center;

    >:first-of-type {
        margin-right: 8px;
    }
`);