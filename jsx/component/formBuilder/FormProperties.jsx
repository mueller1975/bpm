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
    const [formInEdit, updateFormState] = useRecoilState(formState(formProperties?.uuid));
    const [form, setForm] = useState(formInEdit);

    const { uuid, id, title, editableWhen } = form || {};
    const updateForm = useSetRecoilState(updateFormSelector);

    useEffect(() => {
        setForm({ ...formInEdit });
    }, [formProperties]);

    const saveProperties = useCallback(() => {
        if (!isEqual(formInEdit, form)) {
            updateForm({ form: { ...form } });
        }
    }, [formInEdit, form]);

    const formChangeHandler = e => {
        const { name, value: v } = e.target;
        console.log({ name, v })
        setForm({ ...form, [name]: v });
    }

    return (
        <Grid container spacing={2} className={`MT-Form-Properties ${className}`}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled value={uuid ?? ''} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="id" label="表單 ID" size="small" fullWidth value={id ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="表單名稱" size="small" fullWidth value={title ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="editableWhen" label="可編輯條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8} value={editableWhen ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <IconButton onClick={saveProperties}><SaveIcon color="warning" /></IconButton>
            </Grid>
        </Grid>
    );
})`

`);