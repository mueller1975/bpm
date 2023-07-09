import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import {
    Divider, Grid, MenuItem, TextField, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fieldState } from '../context/FormStates';
import { propertiesState } from '../context/PropertiesState';
import { isEqual } from 'underscore';

// Popover 位置
const anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' };

const FIELD_TYPES = [
    { code: "text", name: "文字" },
    { code: "number", name: "數字" },
    { code: "numberRange", name: "數字範圍" },
    { code: "yesOrNo", name: "Y/N" },
    { code: "dropdown", name: "下拉選單" },
    { code: "autocomplete", name: "下拉選單（可輸入）" },
    { code: "tableSelect", name: "表格選取" },
    { code: "inlineEditor", name: "子表多筆" },
    { code: "fileUploader", name: "附件" },
];

const FIELD_TYPE_MENUS = FIELD_TYPES.map(({ code, name }) => <MenuItem key={code} value={code}>{name}</MenuItem>);

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const fieldProperties = useRecoilValue(propertiesState('FIELD'));
    const [field, updateFieldState] = useRecoilState(fieldState(fieldProperties));

    const [newField, setNewField] = useState(field);
    const { uuid, name, label, type, helper } = newField;

    const inputRef = useRef();

    useEffect(() => {
        setNewField({ ...field }); // fieldProperties 改變時, 代表切換編輯的欄位
        onEdit(fieldProperties.length > 0);

        // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
        setTimeout(() => inputRef.current.focus());
    }, [fieldProperties]);

    const saveProperties = useCallback(() => {
        console.log('SAVING field properties.....')
        if (!isEqual(field, newField)) {
            // updateForm({ form: { ...newForm } });
            updateFieldState({ ...newField });
        }
    }, [field, newField]);

    const fieldChangeHandler = e => {
        const { name, value } = e.target;
        setNewField({ ...newField, [name]: value });
    };

    return (
        <Grid container spacing={2} className={`MT-FieldProperties ${className}`}>
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="name" label="變數名稱" size="small" fullWidth
                    inputRef={inputRef} value={name ?? ''} onChange={fieldChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="label" label="標籤" size="small" fullWidth
                    value={label ?? ''} onChange={fieldChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <TextField name="type" label="欄位型態" size="small" fullWidth select
                    value={type ?? 'text'} onChange={fieldChangeHandler}
                    onBlur={saveProperties}>

                    {FIELD_TYPE_MENUS}
                </TextField>
            </Grid>

            <Grid item xs={12}>
                <TextField name="helper" label="註腳" size="small" fullWidth
                    value={helper ?? ''} onChange={fieldChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            <Grid item xs={12}>
                <Divider light>
                    <div className="divider-title">
                        <FormatListNumberedIcon fontSize="small" />
                        <Typography color="textSecondary">子表多筆屬性</Typography>
                    </div>
                </Divider>
            </Grid>

            <Grid item xs={12}>
                <TextField name="name" label="欄位名稱" size="small" fullWidth />
            </Grid>
        </Grid>
    );
})`
    .divider-title {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
`);