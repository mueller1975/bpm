import { Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isEqual } from 'underscore';
import { fieldsetState } from '../context/FormStates.jsx';
import { propertiesState } from '../context/PropertiesState';

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const fieldsetProperties = useRecoilValue(propertiesState('FIELDSET'));
    const [fieldset, updateFieldsetState] = useRecoilState(fieldsetState(fieldsetProperties));
    const inputRef = useRef();

    const [newFieldset, setNewFieldset] = useState(fieldset);
    const { uuid, title, availableWhen, editableWhen } = newFieldset || {};

    useEffect(() => {
        console.log('.............', {fieldsetProperties}, fieldset)
        setNewFieldset({ ...fieldset });
        console.log({ fieldsetProperties })
        onEdit(fieldsetProperties.length > 0);

        // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
        setTimeout(() => inputRef.current.focus());
    }, [fieldsetProperties]);

    const saveProperties = useCallback(() => {
        if (!isEqual(fieldset, newFieldset)) {
            updateFieldsetState({ ...newFieldset });
        }
    }, [fieldset, newFieldset]);

    const formChangeHandler = e => {
        const { name, value: v } = e.target;
        setNewFieldset({ ...newFieldset, [name]: v });
    }

    return (
        <Grid container spacing={2} className={`MT-FieldsetProperties ${className}`}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="標題" size="small" fullWidth
                    inputRef={inputRef} disabled={!uuid} value={title ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="availableWhen" label="可見條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8}
                    disabled={!uuid} value={availableWhen ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="editableWhen" label="可編輯條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8}
                    disabled={!uuid} value={editableWhen ?? ''}
                    onChange={formChangeHandler} onBlur={saveProperties} />
            </Grid>
        </Grid>
    );
})`

`);