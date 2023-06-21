import React, { useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';


export default React.memo(styled(props => {
    const { className, children, cols } = props;

    const editFieldProperties = useCallback(() => {
        console.log(props);
    })

    return (
        <Grid item className={`MT-Component-Grid ${className}`} {...cols} onclick={editFieldProperties}>
            {
                children(props)
            }
        </Grid>
    );
})`
    &.MT-Component-Grid {

    }
`);