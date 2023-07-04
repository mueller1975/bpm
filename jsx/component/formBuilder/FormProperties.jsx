import SaveIcon from '@mui/icons-material/Save';
import { Grid, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { formState, updateFormSelector } from './context/FormStates.jsx';
import { formPropertiesState } from './context/PropertiesState';
import { isEqual } from 'underscore';
import { useCallback } from 'react';

export default React.memo(styled(props => {
    const { className } = props;
    const formProperties = useRecoilValue(formPropertiesState);
    const [form, updateFormState] = useRecoilState(formState(formProperties?.uuid));
    const updateForm = useSetRecoilState(updateFormSelector);

    const [newForm, setNewForm] = useState(form);
    const { uuid, id, title, editableWhen } = newForm || {};


    useEffect(() => {
        setNewForm({ ...form });
    }, [formProperties]);

    const saveProperties = useCallback(() => {
        if (!isEqual(form, newForm)) {
            updateForm({ form: { ...newForm } });
        }
    }, [form, newForm]);

    const formChangeHandler = e => {
        const { name, value: v } = e.target;
        console.log({ name, v })
        setNewForm({ ...newForm, [name]: v });
    }

    return (
        <Grid container spacing={2} className={`MT-Form-Properties ${className}`}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="id" label="表單 ID" size="small" fullWidth
                    disabled={!uuid} value={id ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="表單名稱" size="small" fullWidth
                    disabled={!uuid} value={title ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="editableWhen" label="可編輯條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8}
                    disabled={!uuid} value={editableWhen ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <IconButton onClick={saveProperties}><SaveIcon color="warning" /></IconButton>
            </Grid>
        </Grid>
    );
})`

`);