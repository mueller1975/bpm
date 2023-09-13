import { Grid, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { isEqual } from 'underscore';
import { formState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState';
import { ICON_MENU } from '../lib/formUI.jsx';
import { newlyDeletedUUIDState } from '../context/BuilderStates';

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const formHierarchy = useRecoilValue(propsHierarchyState('FORM'));
    const resetFormHierarchy = useResetRecoilState(propsHierarchyState('FORM'));
    const [form, updateForm] = useRecoilState(formState(formHierarchy));
    const newlyDeletedUUID = useRecoilValue(newlyDeletedUUIDState);

    const [newForm, setNewForm] = useState(form ?? {});
    const { uuid, id, title, icon, editableWhen, collapsedWhenNotEditable } = newForm;

    const inputRef = useRef();

    useEffect(() => {
        setNewForm({ ...form });
        console.log({ formHierarchy })

        // true/false: 可否編輯 (展開/縮合 accordion)
        let editable = Boolean(formHierarchy.length > 0);
        onEdit(editable);

        // if (formHierarchy?.inputFocused) {
        if (editable) {
            console.log({ editable })
            // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
            setTimeout(() => inputRef.current.focus(), 500);
        }
    }, [formHierarchy]);

    useEffect(() => {
        // 如正編輯屬性的 form 被刪除, 則 reset
        if (newlyDeletedUUID && formHierarchy[0] === newlyDeletedUUID) {
            resetFormHierarchy();
        }
    }, [newlyDeletedUUID, formHierarchy]);

    const saveProperties = useCallback(() => {
        console.log("Saving form properties...")

        if (!isEqual(form, newForm)) {
            // updateFormState({ form: { ...newForm } });
            updateForm({ form: newForm });
        }
    }, [form, newForm]);

    const valueChangeHandler = e => {
        const { name, value: v } = e.target;
        setNewForm({ ...newForm, [name]: v });
    };

    const selectChangeHandler = e => {
        const { name, value: v } = e.target;
        let newFormState = { ...newForm, [name]: v };

        setNewForm(newFormState);
        updateForm({ form: newFormState }); // 立即更新 state
    };

    // 勾選欄位值變動
    const checkboxChangeHandler = e => {
        const { name, checked } = e.target;
        console.log({ name, checked });

        let newFormState = { ...newForm, [name]: checked };
        setNewForm(newFormState);
        updateForm({ form: newFormState }); // 立即更新 state
    };

    return (
        // 藉由指定 key 值, 達到切換表單時自動 reset 元件
        <Grid key={uuid} container spacing={2} className={`MT-FormProperties ${className}`}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="id" label="ID" size="small" fullWidth
                    inputRef={inputRef} value={id ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="名稱" size="small" fullWidth
                    value={title ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="icon" label="圖示" size="small" fullWidth
                    value={icon ?? ''} select
                    onChange={selectChangeHandler} onBlur={saveProperties}>

                    {ICON_MENU}
                </TextField>
            </Grid>

            <Grid item xs={12}>
                <TextField name="editableWhen" label="符合以下條件時可編輯" size="small" fullWidth
                    multiline minRows={5} maxRows={8}
                    value={editableWhen ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <FormControlLabel name='collapsedWhenNotEditable' label='不可編輯時強制縮合'
                    control={<Checkbox size='small' checked={collapsedWhenNotEditable ?? false}
                        onChange={checkboxChangeHandler} />} />
            </Grid>
        </Grid>
    );
})`

`);