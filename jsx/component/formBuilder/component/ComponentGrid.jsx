import React, { useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Fab, } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { jiggle } from '../../styled/Animations.jsx';
import { useSetRecoilState } from 'recoil';
import { propsHierarchyState } from '../context/PropsHierarchyState.js';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import { fieldsetState, fieldState } from '../context/FormStates';
import { useRecoilState } from 'recoil';

export default React.memo(styled(props => {
    const { hierarchy, className, children, cols } = props;
    const setFieldHierarchy = useSetRecoilState(propsHierarchyState('FIELD'));

    const [fieldset, updateFieldset] = useRecoilState(fieldsetState(hierarchy));
    const createField = useSetRecoilState(fieldState([hierarchy[0], hierarchy[1],])); // [2] 為空值代表新增欄位
    const { setDialog: setConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmDialog();

    // 編輯欄位屬性
    const editProperties = useCallback(e => {
        e.stopPropagation();
        console.log('EDITing field:', hierarchy, '=>', props);
        setFieldHierarchy(hierarchy);
    }, [hierarchy]);

    const addField = useCallback(e => {
        e.stopPropagation();
        createField({ afterUUID: hierarchy[2] });
    }, []);

    // 刪除欄位
    const doDeleteField = useCallback(() => {
        const [, , fieldUUID] = hierarchy;
        let fields = fieldset.fields.filter(({ uuid }) => uuid !== fieldUUID);
        updateFieldset({ fieldset: { fields } });
        closeConfirmDialog();
    }, [fieldset]);

    // 確認刪除欄位
    const confirmDeleteField = useCallback(e => {
        e.stopPropagation();

        setConfirmDialog({
            title: '刪除欄位確認', content: '刪除後無法復原，您確定要刪除欄位？', open: true, severity: 'fatal',
            onConfirm: doDeleteField,
            onCancel: () => true
        });
    }, [doDeleteField]);

    return (
        <Grid item className={`MT-ComponentGrid ${className}`} {...cols}>
            <div className="fieldActions">
                <Fab size="small" onClick={confirmDeleteField}><DeleteIcon color="error" /></Fab>
                <Fab size="small" onClick={addField}><AddIcon color="success" /></Fab>
                <Fab size="small" onClick={editProperties}><EditIcon color="warning" /></Fab>
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