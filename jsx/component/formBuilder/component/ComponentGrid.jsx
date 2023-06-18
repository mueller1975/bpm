import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';


export default React.memo(styled(props => {
    const { className, children, cols } = props;

    return (
        <Grid item className={`MT-Component-Grid ${className}`} {...cols}>
            {children}
        </Grid>
    );
})`
    &.MT-Component-Grid {

    }
`);