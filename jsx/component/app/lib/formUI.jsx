import { Divider, Grid, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import RowAutocomplete from '../component/RowAutocomplete.jsx';
import Dropdown from '../component/Dropdown.jsx';
import InnerEditorRow from '../component/InnerEditorRow.jsx';
import FileSelector from '../component/FileSelector.jsx';
import {
    GridAutocomplete, GridCheckbox, GridDropdown, GridFileUploader,
    GridInlineEditor, GridNumberRange, GridRemoteAutocomplete, GridTableSelect, GridTextField
} from './formComponents.jsx';
import NumberRangeField from '../component/NumberRangeField.jsx';
import TableSelect from '../component/TableSelect.jsx';
import { ErrorBoundary } from 'Components';
import * as FormIcons from './formIcons';

/**
 * icon 名稱轉換為 Icon 元件
 * @param {*} iconName 
 * @returns 
 */
export const getIconComponent = iconName => {
    return FormIcons[iconName] ?? FormIcons['HelpOutlineIcon'];
};

/**
 * 建立欄位 form component
 * @param {*} param0 
 * @returns 
 */
export const generateField = ({ cols, formId, field, defaultValue, disabled, available }) => {
    const props = { cols, formId, type: 'text', ...field, defaultValue, disabled, available};

    // const type = props.type ?? 'text';
    const key = props.uuid;

    let FieldComponent;

    switch (props.type) {
        case 'divider':
            return (
                <Grid key={key} item {...cols}>
                    <Divider />
                </Grid>
            );
        case 'autocomplete':
            FieldComponent = props.remoteAPI ? GridRemoteAutocomplete : GridAutocomplete;
            break;
        case 'checkbox':
            FieldComponent = GridCheckbox;
            break;
        case 'dropdown':
            FieldComponent = GridDropdown;
            break;
        case 'employeeSelect':
            props.source = 'employee'; // 查詢對象為 '員工資料'
            FieldComponent = GridTableSelect;
            break;
        case 'tableSelect':
            FieldComponent = GridTableSelect;
            break;
        case 'numberRange':
            FieldComponent = GridNumberRange;
            break;
        case 'inlineEditor':
            FieldComponent = GridInlineEditor;
            break;
        case 'fileUploader':
            FieldComponent = GridFileUploader;
            break;
        case 'number':
            FieldComponent = GridTextField;
            props.htmlType = 'number';
            break;
        case 'computed':
            FieldComponent = GridTextField;
            props.htmlType = 'computed';
            break;
        case 'textField':
        case 'text':
            FieldComponent = GridTextField;
            break;
        case 'textarea':
            FieldComponent = GridTextField;
            props.multiline = true;
            break;
        default:
            console.warn(`generateField(): 不支援的元件型態 ${type}`);
            return <div style={{ color: 'red' }}>不支援的元件 type [{type}]</div>
    }

    return <ErrorBoundary key={key}><FieldComponent key={key} {...props} /></ErrorBoundary>;
};

/**
 * 建立子表多筆列 field component
 * @param {*} param0 
 * @returns 
 */
export const generateRowField = ({ name, label, type, configCode, source, filterBy, uiDependsOn,
    disabled, disabledWhenMenuIsEmpty = false, variant, menuDependsOn, mappedRowProps = [], row,
    parentValue, menuDependsOnParent, uploaded, freeSolo = false,
    eventHandlers }) => {

    const { valueChangeHandler, optionChangeHandler, fileSelectHandler } = eventHandlers;

    let fieldValue = row?.[name] ?? ''; // row 裡的空欄位值為 null, 但 bind 到欄位 UI 的值必須轉為空字串

    // *** 注意: 欄位元件不可含有 name 屬性, 因儲存時是根據 input 欄位的 name 組 mpbData json
    switch (type) {
        case 'file':
            return <FileSelector fullWidth size="small" variant={variant} label={label}
                date={row._date}
                id={row._id}
                value={row.attachment ?? ''}
                disabled={disabled || uploaded} // 已上傳過即不可再附新檔
                uploaded={uploaded}
                onSelect={fileSelectHandler} />;
        case 'dropdown':
            return <Dropdown fullWidth size="small" label={label} variant={variant} disabled={disabled} configCode={configCode}
                value={fieldValue} onChange={e => valueChangeHandler({ [name]: e.target.value || null })} />;
        case 'autocomplete':
            return <RowAutocomplete fullWidth size="small" label={label} variant={variant} disabled={disabled}
                value={fieldValue} row={row} configCode={configCode} menuDependsOn={menuDependsOn}
                parentValue={parentValue} menuDependsOnParent={menuDependsOnParent}
                onChange={newValue => optionChangeHandler(name, newValue)}
                disabledWhenMenuIsEmpty={disabledWhenMenuIsEmpty} />;
        case 'numberRange':
            return <NumberRangeField fullWidth size="small" label={label} variant={variant} disabled={disabled}
                value={fieldValue} onChange={newValue => valueChangeHandler({ [name]: newValue })} />;
        case 'tableSelect':
            const inputChangeHandler = useCallback(newValue => {
                let rowValues = {};
                Object.keys(mappedRowProps).forEach(rowProp => rowValues[rowProp] = rowProp == name ? newValue : null);
                valueChangeHandler(rowValues);
            }, [valueChangeHandler]);

            const clearHandler = useCallback(e => valueChangeHandler(Object.keys(mappedRowProps).reduce((values, prop) => {
                values[prop] = null;
                return values;
            }, {})), [valueChangeHandler]);

            const confirmHandler = useCallback(tableRow => {
                let rowValues = {};
                Object.entries(mappedRowProps).forEach(([rowProp, tableCol]) => rowValues[rowProp] = tableRow[tableCol] ?? null);
                valueChangeHandler(rowValues);
            }, [valueChangeHandler]);

            return <TableSelect source={source} configCode={configCode} fullWidth size="small" label={label} variant={variant}
                disabled={disabled} value={fieldValue} row={row} filterBy={filterBy}
                inputProps={{ readOnly: !freeSolo }}
                onInputChange={inputChangeHandler}
                onConfirm={confirmHandler}
                onClear={clearHandler} />;
        case 'static':
            // 此 type 純為註記或固定欄位值, 不需 render UI
            return;
        case 'ui':
            return <InnerEditorRow name={name} source={source} configCode={configCode} uiDependsOn={uiDependsOn}
                row={row} value={fieldValue} variant={variant} disabled={disabled}
                onChange={newValue => valueChangeHandler({ [name]: newValue })}
            // eventHandlers={eventHandlers} 
            />;
        default:
            type = type == 'number' ? type : undefined; // 移除非 number 的 type
            return <TextField fullWidth size="small" label={label} type={type} variant={variant} disabled={disabled}
                value={fieldValue} onChange={e => valueChangeHandler({ [name]: e.target.value })} />;
    }
};