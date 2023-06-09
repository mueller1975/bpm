import { TextField } from '@mui/material';
import React from 'react';
import ConditionalGrid from './ConditionalGrid.jsx';

export default React.memo(props => {
    const { name, label, type, htmlType, helper, variant, hidden = false, readOnly = false,
        multiline = false, minRows = 3, maxRows = 5, className, onWheel } = props;

    return (
        <ConditionalGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) =>
                    // uncontrolled component 一定要有 defaultValue 屬性
                    <TextField
                        fullWidth
                        size="small"
                        // size={disabled ? 'medium' : 'small'}
                        variant={disabled ? 'outlined' : 'filled'}
                        multiline={multiline}
                        minRows={minRows}
                        maxRows={maxRows}
                        name={name}
                        label={label}
                        type={htmlType}
                        hidden={hidden}
                        disabled={disabled}
                        required={required}
                        // onChange={valueChangedHandler}
                        onBlur={valueChangedHandler}

                        // type 為 number 時, disable wheeling
                        onWheel={onWheel}

                        // 在 input field 註記 data-available 屬性值, 作為保存時是否寫入 json 的依據
                        inputProps={{ readOnly, hidden, required, "data-available": available.toString() }}

                        // InputLabelProps={{ shrink: Boolean(defaultValue) || Boolean(value) || !disabled }}

                        defaultValue={defaultValue}
                        value={value}
                        error={Boolean(error)}
                        helperText={!error ? helper : error}
                        className={className}
                    />
            }
        </ConditionalGrid>
    );
});