import { TextField } from '@mui/material';
import React from 'react';
import ComponentGrid from './ComponentGrid.jsx';

export default React.memo(props => {
    const { name, label, type, helper, variant, hidden = false, readOnly = false,
        multiline = false, minRows = 3, maxRows = 5, className } = props;

    return (
        <ComponentGrid {...props}>
            {
                ({ required, disabled, valueChangedHandler, defaultValue, value, error }) =>
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
                        type={type}
                        hidden={hidden}
                        disabled={disabled}
                        required={required}
                        // onChange={valueChangedHandler}
                        onBlur={valueChangedHandler}

                        inputProps={{ readOnly, hidden, required }}

                        // InputLabelProps={{ shrink: Boolean(defaultValue) || Boolean(value) || !disabled }}

                        defaultValue={defaultValue}
                        value={value}
                        error={Boolean(error)}
                        helperText={!error ? helper : error}
                        className={className}
                    />
            }
        </ComponentGrid>
    );
});