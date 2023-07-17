import {
    Checkbox,
    Divider,
    FormControlLabel,
    Grid, MenuItem, TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isEqual } from 'underscore';
import Fieldset from '../component/Fieldset.jsx';
import MultiTypeTextField from '../component/MultiTypeTextField.jsx';
import PropertiesMappingField from '../component/propertiesMapping/PropertiesMappingField.jsx';
import { fieldState } from '../context/FormStates';
import { propsHierarchyState } from '../context/PropsHierarchyState.js';

// Popover 位置
const anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' };

const COMMON_FIELD_PROPERTIES = [
    'uuid', 'name', 'label', 'defaultValue', 'disabled', 'required', 'hidden', 'disabledWhen', 'requiredWhen'
];

// 欄位型態
const FIELD_TYPES = [
    { code: 'text', name: '文字', properties: [...COMMON_FIELD_PROPERTIES] },
    { code: 'number', name: '數字', properties: [...COMMON_FIELD_PROPERTIES] },
    { code: 'numberRange', name: '數字範圍', properties: [...COMMON_FIELD_PROPERTIES] },
    { code: 'yesOrNo', name: 'Y/N', properties: [...COMMON_FIELD_PROPERTIES] },
    { code: 'computed', name: '動態文字', properties: [...COMMON_FIELD_PROPERTIES] },
    { code: 'dropdown', name: '下拉選單', properties: [...COMMON_FIELD_PROPERTIES, 'configCode', 'menuDependsOn', 'disabledWhenMenuIsEmpty'] },
    // { code: 'autocomplete', name: '下拉選單（可輸入）' },
    { code: 'tableSelect', name: '表格選取', properties: [...COMMON_FIELD_PROPERTIES, 'source', 'filterBy'] },
    { code: 'inlineEditor', name: '子表多筆', properties: [...COMMON_FIELD_PROPERTIES] },
    { code: 'fileUploader', name: '附件', properties: [...COMMON_FIELD_PROPERTIES] },
];

// 欄位型態 menu
const FIELD_TYPE_MENUS = FIELD_TYPES.map(({ code, name }) => <MenuItem key={code} value={code}>{name}</MenuItem>);

export default React.memo(styled(props => {
    const { onEdit, className } = props;
    const fieldHierarchy = useRecoilValue(propsHierarchyState('FIELD'));
    const [field, updateField] = useRecoilState(fieldState(fieldHierarchy));

    const [newField, setNewField] = useState(field);
    const { uuid, name, label, defaultValue, type, helper, disabled = false,
        configCode, source, isContextStateProp, isMappedStateProp, mappedStateProps,
        filterBy, computedBy, menuDependsOn, freeSolo = false, disabledWhenMenuIsEmpty = false,
        required, requiredWhen, disabledWhen } = newField;

    const inputRef = useRef();

    useEffect(() => {
        setNewField({ ...field }); // fieldHierarchy 改變時, 代表切換編輯的欄位

        // true/false: 可否編輯 (展開/縮合 accordion)
        let editable = fieldHierarchy.length > 0;
        onEdit(editable);

        if (editable) {
            // 須在下一 render 才 focus, 否則可能會被其他 UI 搶走 focus
            setTimeout(() => inputRef.current.focus());
        }
    }, [fieldHierarchy]);

    // 更新 state
    const saveProperties = useCallback(() => {
        console.log('SAVING field properties.....')
        console.log({ field, newField })
        if (!isEqual(field, newField)) {
            console.log(`Field Properties SAVED [${name}]:`, JSON.stringify(newField));
            updateField({ field: newField });
        }
    }, [field, newField]);

    // 輸入 & 下拉欄位值變動
    const valueChangeHandler = e => {
        const { name, value } = e.target;

        // console.warn('Parent Value changed:', name, ':', value)

        let dependentFields = {}; // 連動欄位變動

        if (name === 'type') {
            switch (type) {
                case 'tableSelect':
                    dependentFields['defaultValue'] = '';
                    break;
                case 'dropdown':
                    // dependentFields = { ...dependentFields, freeSolo: false, menuDependsOn }
                    break;
                default:
            }
        }

        let newFieldState = { ...newField, [name]: value, ...dependentFields };
        setNewField(newFieldState);

        return newFieldState;
    };

    // 映射欄位值變動
    const mappingChangeHandler = e => {
        let newFieldState = valueChangeHandler(e);
        updateField(newFieldState); // 更新 state
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
        updateField(newFieldState); // 更新 state
    };

    return (
        // 藉由指定 key 值, 達到切換欄位時自動 reset 元件
        <Grid key={uuid} container spacing={2} className={`MT-FieldProperties ${className}`}>

            {/* uuid */}
            <Grid item xs={12}>
                <TextField name='uuid' label='UUID' size='small' fullWidth disabled
                    value={uuid ?? ''} />
            </Grid>

            {/* 變數名稱 */}
            <Grid item xs={12}>
                <TextField name='name' label='變數名稱' size='small' fullWidth
                    inputRef={inputRef} value={name ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 標籤 */}
            <Grid item xs={12}>
                <TextField name='label' label='標籤' size='small' fullWidth
                    value={label ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 型態 */}
            <Grid item xs={12}>
                <TextField name='type' label='型態' size='small' fullWidth select
                    value={type ?? 'text'} onChange={valueChangeHandler}
                    onBlur={saveProperties}>

                    {FIELD_TYPE_MENUS}
                </TextField>
            </Grid>

            {
                ['dropdown', 'autocomplete'].includes(type) ?
                    // 下拉選單設定
                    <Grid item xs={12}>
                        <Fieldset title='下拉選單設定'>
                            <Grid container spacing={2}>
                                {/* 選單代碼 */}
                                <Grid item xs={12}>
                                    <TextField name='configCode' label='選單代碼' size='small' fullWidth
                                        value={configCode ?? ''} onChange={valueChangeHandler}
                                        onBlur={saveProperties} />
                                </Grid>

                                {/* 允許手動輸入非選單項目 */}
                                <Grid item xs={12}>
                                    <FormControlLabel name='freeSolo' label='允許手動輸入非選單項目'
                                        control={<Checkbox size='small' checked={freeSolo ?? false}
                                            onChange={checkboxChangeHandler} />} />
                                </Grid>


                                {/* 允許手動輸入非選單項目 */}
                                <Grid item xs={12}>
                                    <FormControlLabel name='disabledWhenMenuIsEmpty' label='沒有選項時不允許選取'
                                        control={<Checkbox size='small' checked={disabledWhenMenuIsEmpty ?? false}
                                            onChange={checkboxChangeHandler} />} />
                                </Grid>

                                {/* 選單相依於欄位變數名稱 */}
                                <Grid item xs={12}>
                                    <MultiTypeTextField name='menuDependsOn' label='選單相依於欄位變數名稱'
                                        size='small' fullWidth
                                        onChange={valueChangeHandler} onBlur={saveProperties} />
                                </Grid>
                            </Grid>
                        </Fieldset>
                    </Grid> :
                    type === 'tableSelect' ?
                        // 表格選取設定
                        <Grid item xs={12}>
                            <Fieldset title='表格選取設定'>
                                <Grid container spacing={2}>
                                    {/* 來源代碼 */}
                                    <Grid item xs={12}>
                                        <TextField name='source' label='來源代碼' size='small' fullWidth
                                            value={source ?? ''} onChange={valueChangeHandler}
                                            onBlur={saveProperties} />
                                    </Grid>

                                    {/* 欄位映射 */}
                                    <Grid item xs={12}>
                                        <PropertiesMappingField name='mappedStateProps' label='欄位映射' size='small' fullWidth
                                            multiline minRows={5} maxRows={8} value={mappedStateProps ?? ''}
                                            disabled={disabled} onChange={mappingChangeHandler} />
                                    </Grid>

                                    {/* 過濾條件 */}
                                    <Grid item xs={12}>
                                        <TextField name='filterBy' label='過濾條件' size='small' fullWidth
                                            multiline minRows={5} maxRows={8} value={filterBy ?? ''}
                                            disabled={disabled} onChange={valueChangeHandler} onBlur={saveProperties} />
                                    </Grid>
                                </Grid>
                            </Fieldset>
                        </Grid> : null
            }

            {/* 預設值 */}
            <Grid item xs={12}>
                <MultiTypeTextField name='defaultValue' label='預設值' size='small' fullWidth
                    value={defaultValue ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 欄位註腳 */}
            <Grid item xs={12}>
                <TextField name='helper' label='註腳' size='small' fullWidth
                    value={helper ?? ''} onChange={valueChangeHandler}
                    onBlur={saveProperties} />
            </Grid>

            {/* 唯讀 & 必填 */}
            <Grid item xs={12}>
                <FormControlLabel name='disabled' label='唯讀'
                    control={<Checkbox size='small' checked={disabled ?? false}
                        onChange={checkboxChangeHandler} />} />

                <FormControlLabel name='required' label='必填'
                    control={<Checkbox size='small' checked={required ?? false}
                        onChange={checkboxChangeHandler} />} />
            </Grid>

            { /* 唯讀條件 */
                !disabled &&
                <Grid item xs={12}>
                    <TextField name='disabledWhen' label='唯讀條件' size='small' fullWidth
                        multiline minRows={5} maxRows={8} value={disabledWhen ?? ''}
                        disabled={disabled}
                        onChange={valueChangeHandler} onBlur={saveProperties} />
                </Grid>
            }

            { /* 必填條件 */
                !required &&
                <Grid item xs={12}>
                    <TextField name='requiredWhen' label='必填條件' size='small' fullWidth
                        multiline minRows={5} maxRows={8} value={requiredWhen ?? ''}
                        disabled={required}
                        onChange={valueChangeHandler} onBlur={saveProperties} />
                </Grid>
            }

            {/* 全域變數 / 映射變數 */}
            <Grid item xs={12}>
                <FormControlLabel name='isContextStateProp' label='全域變數'
                    control={<Checkbox size='small' checked={isContextStateProp ?? false}
                        onChange={checkboxChangeHandler} />} />

                <FormControlLabel name='isMappedStateProp' label='映射變數'
                    control={<Checkbox size='small' checked={isMappedStateProp ?? false}
                        onChange={checkboxChangeHandler} />} />
            </Grid>

            <Grid item xs={12}>

            </Grid>
        </Grid>
    );
})`
    
`);