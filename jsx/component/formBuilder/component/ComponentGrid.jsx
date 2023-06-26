import React, { useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Fab, } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";


export default React.memo(styled(props => {
    const { className, children, cols } = props;

    const editFieldProperties = useCallback(() => {
        console.log(props);
    })

    return (
        <Grid item className={`MT-Component-Grid ${className}`} {...cols} onclick={editFieldProperties}>
            <div className="fieldActions">
                <Fab size="small"><DeleteIcon color="error" /></Fab>
                <Fab size="small"><AddIcon color="success" /></Fab>
                <Fab size="small"><EditIcon color="warning" /></Fab>
            </div>

            {
                children(props)
            }
        </Grid>
    );
})`
    &.MT-Component-Grid {
        position: relative;

        :hover {
            .fieldActions {
                opacity: 1;
                top: 6px;
            }
        }

        .fieldActions {
            position: absolute;
            top: 16px;
            right: 0;
            display: flex;
            gap: 4px;
            justify-content: flex-end;
            z-index: 2;
            opacity: 0;
            transition: all .5s;       
        }
    }
`);