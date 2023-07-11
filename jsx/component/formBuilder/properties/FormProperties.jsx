import { Grid, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isEqual } from 'underscore';
import { formState } from '../context/FormStates';
import { propertiesState } from '../context/PropertiesState';
import { ICON_MENU } from '../lib/formUI.jsx';

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    // const formProperties = useRecoilValue(formPropertiesState);
    const formProperties = useRecoilValue(propertiesState('FORM'));
    const [form, updateFormState] = useRecoilState(formState(formProperties?.uuid));

    const [newForm, setNewForm] = useState(form);
    const { uuid, id, title, icon, editableWhen } = newForm || {};

    const inputRef = useRef();

    useEffect(() => {
        setNewForm({ ...form });
        console.log({ formProperties })
        onEdit(Boolean(formProperties?.uuid));

        if (formProperties?.inputFocused) {
            // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
            setTimeout(() => inputRef.current.focus());
        }
    }, [formProperties]);

    const saveProperties = useCallback(() => {
        if (!isEqual(form, newForm)) {
            updateFormState({ form: { ...newForm } });
        }
    }, [form, newForm]);

    const valueChangeHandler = e => {
        const { name, value: v } = e.target;
        setNewForm({ ...newForm, [name]: v });
    };

    return (
        <Grid container spacing={2} className={`MT-FormProperties ${className}`}>
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
                    onChange={valueChangeHandler} onBlur={saveProperties}>

                    {ICON_MENU}
                </TextField>
            </Grid>

            <Grid item xs={12}>
                <TextField name="editableWhen" label="可編輯條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8}
                    value={editableWhen ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>
        </Grid>
    );
})`

`);