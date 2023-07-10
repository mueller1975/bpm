import { TextField } from '@mui/material';
import React from 'react';
import ComponentGrid from './ComponentGrid.jsx';

export default React.memo(props => {
    const { name, label, htmlType, helper, variant, hidden = false, readOnly = false,
        disabled = false, required = false, defaultValue,
        multiline = false, minRows = 3, maxRows = 5, className } = props;

    return (
        <ComponentGrid {...props}>
            {
                ({ }) =>
                    <TextField
                        fullWidth
                        size="small"
                        variant={disabled ? 'outlined' : 'filled'}
                        multiline={multiline}
                        minRows={minRows}
                        maxRows={maxRows}
                        name={name}
                        label={label}
                        type={htmlType}
                        disabled={disabled}

                        inputProps={{ readOnly, required }}

                        defaultValue={defaultValue}
                        helperText={helper}
                        className={className}
                    />
            }
        </ComponentGrid>
    );
});