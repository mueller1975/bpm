import FunctionsIcon from '@mui/icons-material/Functions';
import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState, } from 'react';

const VALUE_TYPES = [
    { name: 'text', icon: <TranslateIcon />, hint: '文字' },
    { name: 'computedBy', icon: <FunctionsIcon />, hint: '計算公式' },
];

const VALUE_TYPES_MAP = VALUE_TYPES.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

export default React.memo(styled(props => {
    const { type: defaultType, name, value, onChange, onBlur, className, ...others } = props;

    const [type, setType] = useState(() => {
        let { computedBy } = value;
        return computedBy ? 'computedBy' : defaultType ?? 'text';
    });

    const [inputValue, setInputValue] = useState(
        type === 'computedBy' ? value.computedBy : value
    );

    useEffect(() => {
        let newValue = type === 'computedBy' ? { computedBy: inputValue } : inputValue;

        console.warn(`Type changed to [${type}]:`, newValue)
        onChange({ target: { name, value: newValue } });
    }, [type]);

    // 值變更
    useEffect(() => {
        let newInputValue = type === 'computedBy' ? value.computedBy : value;
        setInputValue(newInputValue);
        // console.log({ type, value, newInputValue })
    }, [value]);

    // 輸入欄位值變更
    const inputChangeHandler = useCallback(e => {
        let newValue = e.target.value;

        let newE = {
            target: {
                name,
                value: type === 'computedBy' ? { computedBy: newValue } : newValue
            }
        }

        // 欄位值變更不可直接寫入 inputValue, 
        // 因 inputValue 值是由 value 值解析而來        
        onChange(newE); // 不可傳入 e, 因 value 如是 object 會變成 [object]...
    }, [type, onChange]);

    // 切換欄位值型態
    const nextType = e => {
        let idx = VALUE_TYPES.findIndex(({ name }) => type === name);
        let nextIdx = (idx + 1) % 2;
        let newType = VALUE_TYPES[nextIdx].name;

        setType(newType);
    };

    return (
        // 利用 onBlur 做 state 的更新
        <TextField
            {...others}
            name={name}
            value={inputValue}
            onChange={inputChangeHandler}
            // onBlur={onBlur}
            InputProps={{
                startAdornment:
                    <InputAdornment position="start">{type}</InputAdornment>,
                endAdornment:
                    <InputAdornment position="end">
                        <Tooltip title={VALUE_TYPES_MAP[type].hint} arrow>
                            <IconButton onClick={nextType}
                            // onBlur={onBlur}
                            >
                                {VALUE_TYPES_MAP[type].icon}
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>,
            }}
        />);
})`

`);