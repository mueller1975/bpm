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
    const { name, value, onChange, onBlur, className, ...others } = props;

    const [type, setType] = useState('text');
    const [inputValue, setInputValue] = useState('');

    // 值變更
    useEffect(() => {
        const { computedBy } = value;
        const [newType, newInputValue] = computedBy ? ['computedBy', computedBy] : ['text', value];

        setType(newType);
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
    // 不可直接在此變更 type 值, type 值須由 value 值解析而來!!!
    const nextType = e => {
        let idx = VALUE_TYPES.findIndex(({ name }) => type === name);
        let nextIdx = (idx + 1) % 2;
        let newType = VALUE_TYPES[nextIdx].name;

        let newE = {
            target: {
                name,
                value: newType === 'computedBy' ? { computedBy: inputValue } : inputValue
            }
        }

        onChange(newE); // 變更 value 值
    };

    return (
        // 利用 onBlur 做 state 的更新
        <TextField
            {...others}
            name={name}
            value={inputValue}
            onChange={inputChangeHandler}
            onBlur={onBlur}
            InputProps={{
                startAdornment:
                    <InputAdornment position="start">{type}</InputAdornment>,
                endAdornment:
                    <InputAdornment position="end">
                        <Tooltip title={VALUE_TYPES_MAP[type].hint} arrow>
                            <IconButton onClick={nextType} onBlur={onBlur}>
                                {VALUE_TYPES_MAP[type].icon}
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>,
            }}
        />);
})`

`);