import React, { useCallback, useState } from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export default React.memo(styled(props => {
    const { type: defaultType, value, onChange, className, ...others } = props;

    const [type, setType] = useState(() => {
        let { computedBy } = value;
        return computedBy ? 'computed' : defaultType ?? 'text';
    });

    const [inputValue, setInputValue] = useState(
        type === 'computedBy' ? value.computedBy : value
    );

    const inputChangeHandler = useCallback(e => {
        setInputValue(e.target.value);

        if (type === 'computedBy') {
            e.target.value = { computedBy: e.target.value };
        }

        console.log({ target: e.target });
        onChange(e);
    }, [type]);

    return <TextField value={inputValue} onChange={inputChangeHandler}
        {...others} />;
})`

`);