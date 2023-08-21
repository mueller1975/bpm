import { TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';

export default React.memo(props => {
    const { name, helper, value, onChange, onBlur, ...others } = props;

    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState();

    const inputChangeHandler = useCallback(e => {
        // 實際儲存的值, 如為空陣列則儲存為空字串
        // setInputValue(jsonValue.length == 0 ? '' : JSON.stringify(jsonValue))
        console.log('on change =>', e.target.value)
        setInputValue(e.target.value);
    }, []);

    const valueChangeHandler = useCallback(e => {
        let v = e.target.value;

        console.log('value changed:', e.target.name, '=>', v)
        try {
            let obj = v ? JSON.parse(e.target.value) : null;
            onChange({ target: { name, value: obj } });
            onBlur && setTimeout(()=>onBlur());
            setError(); // reset error
        } catch (err) {
            setError(err.message ?? err);
        }
    }, [onChange, onBlur]);

    return (
        <TextField
            fullWidth
            size="small"

            onChange={inputChangeHandler}
            onBlur={valueChangeHandler}

            // defaultValue={defaultValue}
            value={inputValue}
            error={Boolean(error)}
            helperText={!error ? helper : error}

            {...others}
        />
    );
});