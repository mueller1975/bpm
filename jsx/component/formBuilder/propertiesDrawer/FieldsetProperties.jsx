import { Grid, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { isEqual } from 'underscore';
import { fieldsetState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState';
import { newlyDeletedUUIDState } from '../context/BuilderStates';

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const fieldsetHierarchy = useRecoilValue(propsHierarchyState('FIELDSET'));
    const resetFieldsetHierarchy = useResetRecoilState(propsHierarchyState('FIELDSET'));
    const [fieldset, updateFieldset] = useRecoilState(fieldsetState(fieldsetHierarchy));
    const newlyDeletedUUID = useRecoilValue(newlyDeletedUUIDState);

    const [newFieldset, setNewFieldset] = useState(fieldset ?? {});
    const { uuid, title, availableWhen, readOnly, disabledWhen, } = newFieldset;

    const inputRef = useRef();

    useEffect(() => {
        setNewFieldset({ ...fieldset });

        // true/false: 可否編輯 (展開/縮合 accordion)
        let editable = fieldsetHierarchy.length > 0;
        onEdit(editable);

        if (editable) {
            // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
            setTimeout(() => inputRef.current.focus());
        }
    }, [fieldsetHierarchy]);

    useEffect(() => {
        // 如正編輯屬性的 fieldset 被刪除, 則 reset
        if (newlyDeletedUUID && fieldsetHierarchy[1] === newlyDeletedUUID) {
            resetFieldsetHierarchy();
        }
    }, [newlyDeletedUUID, fieldsetHierarchy]);

    const saveProperties = useCallback(() => {
        if (!isEqual(fieldset, newFieldset)) {
            updateFieldset({ fieldset: newFieldset });
        }
    }, [fieldset, newFieldset]);

    const valueChangeHandler = e => {
        const { name, value: v } = e.target;
        setNewFieldset({ ...newFieldset, [name]: v });
    };

    // 勾選欄位值變動
    const checkboxChangeHandler = e => {
        const { name, checked } = e.target;
        console.log({ name, checked });

        let newFieldsetState = { ...newFieldset, [name]: checked };
        setNewFieldset(newFieldsetState);
        updateFieldset({ fieldset: newFieldsetState });
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
                <TextField name="disabledWhen" label="符合以下條件時不可編輯" size="small" fullWidth
                    disabled={readOnly}
                    multiline minRows={5} maxRows={8} value={disabledWhen ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="availableWhen" label="可見條件" size="small" fullWidth
                    multiline minRows={5} maxRows={8} value={availableWhen ?? ''}
                    onChange={valueChangeHandler} onBlur={saveProperties} />
            </Grid>

        </Grid>
    );
})`

`);