import { Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isEqual } from 'underscore';
import { fieldsetState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState';

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const fieldsetHierarchy = useRecoilValue(propsHierarchyState('FIELDSET'));
    const [fieldset, updateFieldset] = useRecoilState(fieldsetState(fieldsetHierarchy));

    const [newFieldset, setNewFieldset] = useState(fieldset);
    const { uuid, title, availableWhen, editableWhen } = newFieldset || {};

    const inputRef = useRef();

    useEffect(() => {
        console.log('.............', { fieldsetProperties: fieldsetHierarchy }, fieldset)
        setNewFieldset({ ...fieldset });
        console.log({ fieldsetProperties: fieldsetHierarchy })

        // true/false: 可否編輯 (展開/縮合 accordion)
        let editable = fieldsetHierarchy.length > 0;
        onEdit(editable);

        if (editable) {
            // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
            setTimeout(() => inputRef.current.focus());
        }
    }, [fieldsetHierarchy]);

    const saveProperties = useCallback(() => {
        if (!isEqual(fieldset, newFieldset)) {
            updateFieldset({ fieldset: newFieldset });
        }
    }, [fieldset, newFieldset]);

    const valueChangeHandler = e => {
        const { name, value: v } = e.target;
        setNewFieldset({ ...newFieldset, [name]: v });
    };

    return (
        // 藉由指定 key 值, 達到切換欄位群時自動 reset 元件
        <Grid key={uuid} container spacing={2} className={`MT-FieldsetProperties ${className}`}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="title" label="標題" size="small" fullWidth
                    inputRef={inputRef} value={title ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="availableWhen" label="可見條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8} value={availableWhen ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="editableWhen" label="可編輯條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8} value={editableWhen ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>
        </Grid>
    );
})`

`);