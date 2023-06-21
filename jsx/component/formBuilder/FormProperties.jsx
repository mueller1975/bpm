import SaveIcon from '@mui/icons-material/Save';
import { Grid, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { updateFormSelector } from './context/FormStates.jsx';
import { formPropertiesState } from './context/PropertiesState';

export default React.memo(styled(props => {
    const { className } = props;
    const formProperties = useRecoilValue(formPropertiesState);
    const [form, setForm] = useState(formProperties);

    const { uuid, id, title } = form;
    const updateForm = useSetRecoilState(updateFormSelector);

    useEffect(() => {
        setForm({ ...formProperties })
    }, [formProperties])

    const saveProperties = () => updateForm({ ...form });

    const formChangeHandler = e => {
        const { name, value: v } = e.target;
        console.log({ name, v })
        setForm({ ...form, [name]: v });
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled value={uuid} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="id" label="表單 ID" size="small" fullWidth value={id} onChange={formChangeHandler} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="表單名稱" size="small" fullWidth value={title} onChange={formChangeHandler} />
            </Grid>

            <Grid item xs={12}>
                <IconButton onClick={saveProperties}><SaveIcon color="warning" /></IconButton>
            </Grid>
        </Grid>
    );
})`

`);