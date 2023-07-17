import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo, useEffect, useContext, useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import AddComponentButton from '../AddComponentButton.jsx';
import { fieldState, fieldsetState, formState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState.js';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';

export default React.memo(styled(props => {
    const { formUUID, uuid: fieldsetUUID, noBorder = false, title = '無標題', formId,
        cols, available: parentAvailable = true, className } = props;

    const { setDialog: setConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmDialog();

    const [form, updateForm] = useRecoilState(formState([formUUID]));
    const [fieldset, updateFieldset] = useRecoilState(fieldsetState([formUUID, fieldsetUUID]));
    const createField = useSetRecoilState(fieldState([formUUID, fieldsetUUID,])); // [2] 為空值代表新增 field
    const setFieldsetHierarchy = useSetRecoilState(propsHierarchyState('FIELDSET'));

    const { fields } = fieldset;
    const gridSpacing = 1.5;

    useEffect(() => {
        if (formUUID && fieldsetUUID) {
            editProperties();
        }
    }, []);

    // 新增欄位
    const addField = e => {
        e.stopPropagation();
        createField({});
    }

    // 編輯屬性
    const editProperties = useCallback(() => {
        setFieldsetHierarchy([formUUID, fieldsetUUID]);
    }, []);

    // 刪除欄位群
    const doDeleteFieldset = useCallback(() => {
        let components = form.components.filter(({ uuid }) => uuid !== fieldsetUUID);
        updateForm({ form: { components } });
        closeConfirmDialog();
    }, [form]);

    // 確認刪除欄位群
    const confirmDeleteFieldset = useCallback(e => {
        e.stopPropagation();

        setConfirmDialog({
            title: '刪除欄位群確認', content: '刪除後無法復原，您確定要刪除欄位群？', open: true, severity: 'fatal',
            onConfirm: doDeleteFieldset,
            onCancel: () => true
        });
    }, [doDeleteFieldset]);

    let gridContainer = useMemo(() => (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer`}>
            <Grid item {...cols}>
                <AddComponentButton onClick={addField} />
            </Grid>

            {
                fields.map((field, idx) => {
                    let { uuid, name } = field;
                    return generateField({ cols, field, formId, hierarchy: [formUUID, fieldsetUUID, uuid] });
                })
            }
        </Grid>
    ), [fields]);

    const actions = [
        { action: confirmDeleteFieldset, icon: <DeleteIcon color="error" /> },
        { action: editProperties, icon: <EditIcon color="warning" /> },
    ];

    // return !title ? gridContainer :
    return (
        <Fieldset title={title} noBorder={noBorder} className={`MT-GridFieldsetContainer ${className}`} actions={actions}>
            {gridContainer}
        </Fieldset>
    );
})`
    &.MT-GridFieldsetContainer {
        .gridContainer {
            padding-top: 6px;
        }
    }
`);