import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import AddComponentButton from '../AddComponentButton.jsx';
import { fieldState, fieldsetState, formState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState.js';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';
import { newlyDeletedUUIDState } from "../context/BuilderStates";

const FIELDSET_GRID_SPACING = 1.5;

export default React.memo(styled(props => {
    const { formUUID, uuid: fieldsetUUID, noBorder = false, title = '無標題', formId,
        cols, className } = props;

    const { setDialog: setConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmDialog();

    const [form, updateForm] = useRecoilState(formState([formUUID]));
    const fieldset = useRecoilValue(fieldsetState([formUUID, fieldsetUUID]));
    const createField = useSetRecoilState(fieldState([formUUID, fieldsetUUID,])); // [2] 為空值代表新增 field
    const [propsHierarchy, setPropsHierarchy] = useRecoilState(propsHierarchyState('FIELDSET'));
    const setNewlyDeletedUUID = useSetRecoilState(newlyDeletedUUIDState); // 設定剛刪除的元件 UUID

    // 新增欄位
    const addField = useCallback(e => {
        e.stopPropagation();
        createField({});
    }, []);

    // 編輯屬性
    const editProperties = useCallback(() => {
        setPropsHierarchy([formUUID, fieldsetUUID]);
    }, []);

    // 刪除欄位群
    const doDeleteFieldset = useCallback(() => {
        let components = form.components.filter(({ uuid }) => uuid !== fieldsetUUID);
        updateForm({ form: { components } });
        setNewlyDeletedUUID(fieldsetUUID);
        closeConfirmDialog();
    }, [form]);

    // 確認刪除欄位群
    const confirmDeleteFieldset = useCallback(e => {
        e.stopPropagation();

        setConfirmDialog({
            title: '刪除欄位群確認', content: '刪除後無法復原，您確定要刪除欄位群？', open: true, severity: 'fatal',
            onConfirm: doDeleteFieldset,
            onCancel: () => true, // for Cancel button to show up
        });
    }, [doDeleteFieldset]);

    let gridContainer = useMemo(() => (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={FIELDSET_GRID_SPACING} className={`gridContainer`}>
            <Grid item {...cols}>
                <AddComponentButton onClick={addField} />
            </Grid>

            {
                fieldset.fields.map(field =>
                    generateField({ cols, field, formId, hierarchy: [formUUID, fieldsetUUID, field.uuid] }))
            }
        </Grid>
    ), [fieldset.fields]);

    const actions = useMemo(() => [
        { action: confirmDeleteFieldset, icon: <DeleteIcon color="error" /> },
        { action: editProperties, icon: <EditIcon color="warning" /> },
    ], [confirmDeleteFieldset]);

    return (
        <Fieldset title={title} noBorder={noBorder} actions={actions}
            className={`MT-GridFieldsetContainer ${className} ${fieldsetUUID === propsHierarchy[1] ? 'editing' : ''}`}>
            {gridContainer}
        </Fieldset>
    );
})`
    &.MT-GridFieldsetContainer {
        &.editing {
            border: 1px dashed #a4ff8e;
            border-radius: 4px;
            padding: 4px;
        }

        .gridContainer {
            padding-top: 6px;
        }
    }
`);