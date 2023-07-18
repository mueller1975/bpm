import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Fab, Grid, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import React, { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { jiggle } from '../../styled/Animations.jsx';
import { fieldState, fieldsetState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState.js';

export default React.memo(styled(props => {
    const { hierarchy, className, children, cols } = props;
    const [formUUID, fieldsetUUID, fieldUUID] = hierarchy;

    const setFieldHierarchy = useSetRecoilState(propsHierarchyState('FIELD'));
    const [fieldset, updateFieldset] = useRecoilState(fieldsetState(hierarchy));
    const createField = useSetRecoilState(fieldState([formUUID, fieldsetUUID,])); // [2] 為空值代表新增欄位
    const { setDialog: setConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmDialog();

    // 編輯欄位屬性
    const editProperties = useCallback(e => {
        e && e.stopPropagation();
        setFieldHierarchy(hierarchy);
    }, []);

    // 新增欄位
    const addField = useCallback(e => {
        e && e.stopPropagation();
        createField({ afterUUID: fieldUUID });
    }, []);

    // 刪除欄位
    const doDeleteField = useCallback(() => {
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