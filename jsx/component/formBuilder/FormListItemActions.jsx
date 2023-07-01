import { css } from "@emotion/react";
import { useIntersection } from '@mantine/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, Box, Fab, Popper, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import { useSlideSpring } from 'Hook/useAnimations.jsx';
import React, { useCallback, useEffect } from 'react';
import { blink } from '../styled/Animations.jsx';
import Form from './Form.jsx';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { formPropertiesState } from "./context/PropertiesState.js";
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { updateFormSelector } from './context/FormStates.jsx';

export default React.memo(styled(props => {
    const { form, open, anchorEl, className } = props;

    const updateForm = useSetRecoilState(updateFormSelector);
    const setFormProperties = useSetRecoilState(formPropertiesState);

    // 新增表單
    const addForm = useCallback(e => {
        e.stopPropagation();
        updateForm({ afterFormUUID: form.uuid, form: {} });
    });

    // 編輯表單屬性
    const editForm = useCallback(e => {
        e.stopPropagation();
        console.log({ form })
        setFormProperties({ ...form });
    }, [form]);

    // 刪除表單
    const deleteForm = useCallback(e => {
        e.stopPropagation();
    });

    return (
        <Popper open={open} anchorEl={anchorEl} placement="right"
            className={`MT-FormListItemActions ${className}`}>
            <Paper className={toolbar}>
                <Fab size="small" color="error" onClick={deleteForm}><DeleteIcon /></Fab>
                <Fab size="small" color="success" onClick={addForm}><AddIcon /></Fab>
                <Fab size="small" color="warning" onClick={editForm}><EditIcon /></Fab>
            </Paper>
        </Popper>
    );
})`
    &.MT-FormListItemActions {
        z-index: 1;

        >.toolbar {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 4px;

            >button {
                transition: all .8s;
                color: darkgray;

                &.MuiFab-warning {
                    background-color: rgb(255 167 38 / 50%);

                    :hover {
                        background-color: rgb(255 167 38 / 100%);
                    }
                }

                &.Mui-error {
                    background-color: rgb(244 67 54 / 50%);

                    :hover {
                        background-color: rgb(244 67 54 / 100%);
                    }
                }

                &.MuiFab-success {
                    background-color: rgb(102 187 106 / 50%);

                    :hover {
                        background-color: rgb(102 187 106 / 100%);
                    }
                }

                :hover {
                    color: lightgray;
                }
            }
        }
    }
`);