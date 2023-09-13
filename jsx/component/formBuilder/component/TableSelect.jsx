import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ErrorBoundary } from 'Components';
import { merge } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DATA_TABLE_SELECTS } from '../lib/formTableSelects.jsx';

const TableSelect = React.memo(styled(React.forwardRef((props, ref) => {
    const { name, label, hidden = false, disabled = false, source, configCode, row, urlParams, params, filterBy,
        onConfirm, className, onClear, onInputChange, value, ...others } = props;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const config = DATA_TABLE_SELECTS[source];

    if (!config) {
        // throw `source [${source}] 設定值不存在`;
    }

    const [IconComponent, DialogComponent, dialogProps] = config ?? [];

    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);

    const confirmDialog = useCallback(selected => {
        onConfirm(selected);
        closeDialog();
    }, [onConfirm]);

    if (filterBy) {
        if (typeof filterBy != 'string') {
            throw Error('filterBy 必須為文字型態');
        }
    }

    const filterByFunc = useMemo(() => !filterBy ? null : new Function(['row'], `return ${filterBy}`), []);
    const newParams = useMemo(() => !filterByFunc ? params : merge(params, filterByFunc(row)), [row, params]);

    const inputValueChangedHandler = useCallback(e => setInputValue(e.target.value), []);

    return (
        <>
            <DialogComponent config={dialogProps} name={name} configCode={configCode} row={row} urlParams={urlParams}
                params={newParams} filterBy={filterBy} title={`選取「${label}」`} open={dialogOpen}
                onConfirm={confirmDialog} onClose={closeDialog} />

            <TextField
                {...others}

                ref={ref}
                name={name}
                label={label}
                hidden={hidden}
                disabled={disabled}

                className={className}

                value={inputValue}
                onChange={inputValueChangedHandler}
                onBlur={!onInputChange ? undefined : e => onInputChange(inputValue)}

                InputProps={{
                    endAdornment: disabled ? null :
                        <InputAdornment position="end">
                            {!value ? null :
                                <IconButton color="warning" edge="end" size="small" className="clear-action" onClick={onClear}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            }
                            <IconButton color="primary" edge="end" size="small" className="select-action" onClick={openDialog}>
                                <IconComponent />
                            </IconButton>
                        </InputAdornment>
                }} />
        </>
    );
}))`
    :hover {
        .clear-action {
            display: inline-flex !important;
        }
    }
    
    .clear-action {
        display: none;
    }

    .select-action {
        ${({ theme: { palette: { mode } } }) => mode == 'dark' ? 'color: #c3e0ff;' : ''}
    }

    .MuiInputBase-root:not(.Mui-disabled) {
        padding-right: 6px;
    }
`);

export default React.memo(React.forwardRef((props, ref) => <ErrorBoundary><TableSelect ref={ref} {...props} /></ErrorBoundary>));