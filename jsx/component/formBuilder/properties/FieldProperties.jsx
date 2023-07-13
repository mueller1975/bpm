import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import {
    Divider, Grid, MenuItem, TextField, Typography, Checkbox, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fieldState } from '../context/FormStates';
import { propertiesState } from '../context/PropertiesState';
import { isEqual } from 'underscore';
import PropertiesMappingField from '../component/propertiesMapping/PropertiesMappingField.jsx';
import MultiTypeTextField from '../component/MultiTypeTextField.jsx';

// Popover 位置
const anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' };

// 欄位型態
const FIELD_TYPES = [
    { code: "text", name: "文字" },
    { code: "number", name: "數字" },
    { code: "numberRange", name: "數字範圍" },
    { code: "yesOrNo", name: "Y/N" },
    { code: "computed", name: "動態文字" },
    { code: "dropdown", name: "下拉選單" },
    { code: "autocomplete", name: "下拉選單（可輸入）" },
    { code: "tableSelect", name: "表格選取" },
    { code: "inlineEditor", name: "子表多筆" },
    { code: "fileUploader", name: "附件" },
];

// 欄位型態 menu
const FIELD_TYPE_MENUS = FIELD_TYPES.map(({ code, name }) => <MenuItem key={code} value={code}>{name}</MenuItem>);

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const fieldProperties = useRecoilValue(propertiesState('FIELD'));
    const [field, updateFieldState] = useRecoilState(fieldState(fieldProperties));

    const [newField, setNewField] = useState(field);
    const { uuid, name, label, defaultValue, type, helper, disabled = false,
        configCode, source, isContextStateProp, isMappedStateProp, mappedStateProps,
        filterBy, computedBy,
        required, requiredWhen, disabledWhen } = newField;

    const inputRef = useRef();

    useEffect(() => {
        setNewField({ ...field }); // fieldProperties 改變時, 代表切換編輯的欄位
        onEdit(fieldProperties.length > 0);

        // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
        setTimeout(() => inputRef.current.focus());
    }, [fieldProperties]);

    // 更新 state
    const saveProperties = useCallback(() => {
        console.log('SAVING field properties.....')
        console.log({ field, newField })
        if (!isEqual(field, newField)) {
            console.log('Field Properties SAVED...')
            updateFieldState({ ...newField });
        }
    }, [field, newField]);

    // 輸入 & 下拉欄位值變動
    const valueChangeHandler = e => {
        const { name, value } = e.target;

        console.warn('Parent Value changed:', name, ':', value)

        let dependentFields = {}; // 連動欄位變動

        if (name === 'type' && value === 'tableSelect') {
            dependentFields['defaultValue'] = '';
        }

        let newFieldState = { ...newField, [name]: value, ...dependentFields };
        setNewField(newFieldState);

        return newFieldState;
    };

    // 映射欄位值變動
    const mappingChangeHandler = e => {
        let newFieldState = valueChangeHandler(e);
        updateFieldState(newFieldState); // 更新 state
    }

    // 勾選欄位值變動
    const checkboxChangeHandler = e => {
        const { name, checked } = e.target;
        console.log({ name, checked })

        let dependentFields = {}; // 連動欄位變動

        if (checked) {
            switch (name) {
                case 'disabled':
                    dependentFields['disabledWhen'] = '';
                    break;
                case 'required':
                    dependentFields['requiredWhen'] = '';
                    break;
                case 'isContextStateProp':
                    dependentFields['isMappedStateProp'] = false;
                    break;
                case 'isMappedStateProp':
                    dependentFields['isContextStateProp'] = false;
                    break;
                default:
            }
        }

        let newFieldState = { ...newField, [name]: checked, ...dependentFields };
        setNewField(newFieldState);
        updateFieldState(newFieldState); // 更新 state
    };

    return (
        <Grid container spacing={2} className={`MT-FieldProperties ${className}`}>

            {/* uuid */}
            <Grid item xs={12}>
                <TextField name="uuid" label="UUID" size="small" fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            {/* 變數名稱 */}
            <Grid item xs={12}>
                <TextField name="name" label="變數名稱" size="small" fullWidth
                    inputRef={inputRef} value={name ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 標籤 */}
            <Grid item xs={12}>
                <TextField name="label" label="標籤" size="small" fullWidth
                    value={label ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 型態 */}
            <Grid item xs={12}>
                <TextField name="type" label="型態" size="small" fullWidth select
                    value={type ?? 'text'} onChange={valueChangeHandler}
                    onBlur={saveProperties}>

                    {FIELD_TYPE_MENUS}
                </TextField>
            </Grid>

            {
                ['dropdown', 'autocomplete'].includes(type) ?
                    // 下拉選單 - 選單代碼
                    <Grid item xs={12}>
                        <TextField name="configCode" label="選單代碼" size="small" fullWidth
                            value={configCode ?? ''} onChange={valueChangeHandler}
                            onBlur={saveProperties} />
                    </Grid> :
                    type === 'tableSelect' ?
                        // 表格選取 - 來源代碼、欄位映射、條件過濾
                        <>
                            <Grid item xs={12}>
                                <TextField name="source" label="表格選取 - 來源代碼" size="small" fullWidth
                                    value={source ?? ''} onChange={valueChangeHandler}
                                    onBlur={saveProperties} />
                            </Grid>
                            <Grid item xs={12}>
                                <PropertiesMappingField name="mappedStateProps" label="表格選取 - 欄位映射" size="small" fullWidth
                                    multiline minRows={5} maxRows={8} value={mappedStateProps ?? ''}
                                    disabled={disabled} onChange={mappingChangeHandler} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="filterBy" label="表格選取 - 條件過濾" size="small" fullWidth
                                    multiline minRows={5} maxRows={8} value={filterBy ?? ''}
                                    disabled={disabled} onChange={valueChangeHandler} onBlur={saveProperties} />
                            </Grid>
                        </> : null
            }

            {/* 預設值 */}
            <Grid item xs={12}>
                {/* 藉由指定 key 值, 達到切換欄位時自動 reset 元件狀態 */}
                <MultiTypeTextField key={uuid} name="defaultValue" label="預設值" size="small" fullWidth
                    value={defaultValue ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 欄位註腳 */}
            <Grid item xs={12}>
                <TextField name="helper" label="註腳" size="small" fullWidth
                    value={helper ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 唯讀 & 必填 */}
            <Grid item xs={12}>
                <FormControlLabel name="disabled" label="唯讀" control={<Checkbox checked={disabled ?? false}
                    onChange={checkboxChangeHandler} />} />

                <FormControlLabel name="required" label="必填" control={<Checkbox checked={required ?? false}
                    onChange={checkboxChangeHandler} />} />
            </Grid>

            { /* 唯讀條件 */
                !disabled &&
                <Grid item xs={12}>
                    <TextField name="disabledWhen" label="唯讀條件" size="small" fullWidth
                        multiline minRows={5} maxRows={8} value={disabledWhen ?? ''}
                        disabled={disabled}
                        onChange={valueChangeHandler} onBlur={saveProperties} />
                </Grid>
            }

            { /* 必填條件 */
                !required &&
                <Grid item xs={12}>
                    <TextField name="requiredWhen" label="必填條件" size="small" fullWidth
                        multiline minRows={5} maxRows={8} value={requiredWhen ?? ''}
                        disabled={required}
                        onChange={valueChangeHandler} onBlur={saveProperties} />
                </Grid>
            }

            {/* 全域變數 / 映射變數 */}
            <Grid item xs={12}>
                <FormControlLabel name="isContextStateProp" label="全域變數"
                    control={<Checkbox checked={isContextStateProp ?? false}
                        onChange={checkboxChangeHandler} />} />

                <FormControlLabel name="isMappedStateProp" label="映射變數"
                    control={<Checkbox checked={isMappedStateProp ?? false}
                        onChange={checkboxChangeHandler} />} />
            </Grid>

            <Grid item xs={12}>

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