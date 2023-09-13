import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default React.memo(props => {
    const { name, label, helper, type, hidden = false, disabled = false, required = false,
        multiline = false, minRows = 3, maxRows = 5, value, onChange } = props;

    const [stringValue, setStringValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setStringValue(JSON.stringify(value));
    }, [value]);

    const valueChangedHandler = e => {
        setStringValue(e.target.value);
    };

    const confirmValue = e => {
        try {
            let obj = JSON.parse(stringValue);
            onChange({ target: { name, value: obj } }, true);
            setError();
        } catch (err) {
            console.error('解析 JSON 失敗', err);
            setError(err.message);
        }
    };

    return (
        <>
            {/* uncontrolled component 一定要有 defaultValue 屬性 */}
            <TextField
                fullWidth
                size="small"
                variant={disabled ? 'outlined' : 'filled'}
                multiline={multiline}
                minRows={minRows}
                maxRows={maxRows}

                value={stringValue}

                label={label}
                hidden={hidden}
                disabled={disabled}
                required={required}

                error={Boolean(error)}
                helperText={error || helper}

                onChange={valueChangedHandler}
                onBlur={confirmValue}
            />
        </>
    );
});