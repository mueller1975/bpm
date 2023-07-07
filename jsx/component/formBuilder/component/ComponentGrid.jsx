import React, { useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Fab, } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { jiggle } from '../../styled/Animations.jsx';
import { useSetRecoilState } from 'recoil';
import { propertiesState } from '../context/PropertiesState.js';

export default React.memo(styled(props => {
    const { hierarchy, className, children, cols } = props;
    const setFieldProperties = useSetRecoilState(propertiesState('FIELD'));

    const editFieldProperties = useCallback(e => {
        e.stopPropagation();
        console.log('EDITing field:', hierarchy, '=>', props);
        setFieldProperties(hierarchy);
    }, [hierarchy]);

    return (
        <Grid item className={`MT-ComponentGrid ${className}`} {...cols}>
            <div className="fieldActions">
                <Fab size="small"><DeleteIcon color="error" /></Fab>
                <Fab size="small"><AddIcon color="success" /></Fab>
                <Fab size="small" onClick={editFieldProperties}><EditIcon color="warning" /></Fab>
            </div>

            {
                children(props)
            }
        </Grid>
    );
})`
    &.MT-ComponentGrid {
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

            button {
                :hover {
                    animation: ${jiggle} .15s 3;
                }                
            }
        }
    }
`);