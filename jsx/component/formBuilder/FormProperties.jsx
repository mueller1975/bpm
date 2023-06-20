import RadioIcon from '@mui/icons-material/Radio';
import { Grid, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { updateFormSelector } from './context/FormStates.jsx';

export default React.memo(styled(props => {
    const { value, className } = props;
    const [form, setForm] = useState(value ?? {});
    const { id, title } = form;
    const setAllForms = useSetRecoilState(updateFormSelector);

    const resetForms = () => setAllForms({ ...form, components: [] });

    const formChangeHandler = e => {
        const { name, value: v } = e.target;
        console.log({ name, v })
        setForm({ ...form, [name]: v });
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField name="id" label="表單 ID" size="small" fullWidth value={id} onChange={formChangeHandler} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="表單名稱" size="small" fullWidth value={title} onChange={formChangeHandler} />
            </Grid>

            <Grid item xs={12}>
                <IconButton onClick={resetForms}><RadioIcon color="error" /></IconButton>
            </Grid>
        </Grid>
    );
})`

`);