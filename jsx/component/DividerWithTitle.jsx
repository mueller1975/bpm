import React from 'react';
import { Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export default React.memo(styled(props => {
    const { title, icon: TitleIcon, className, ...others } = props;

    return (
        <Divider className={`MT-DividerWithTitle ${className}`} {...others}>
            <div className="title">
                {
                    TitleIcon && <TitleIcon fontSize="small" />
                }
                <Typography color="textSecondary">{title}</Typography>
            </div>
        </Divider>
    );
})`
    .title {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
`);