import FunctionsIcon from '@mui/icons-material/Functions';
import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState, } from 'react';

// 欄位值型態
const VALUE_TYPES = [
    { name: 'text', icon: <TranslateIcon />, hint: '文字' },
    { name: 'computedBy', icon: <FunctionsIcon />, hint: '計算公式' },
];

// 欄位值型態 Map
const VALUE_TYPES_MAP = VALUE_TYPES.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

export default React.memo(styled(props => {
    const { name, value, onChange, onBlur, className, ...others } = props;

    const [type, setType] = useState('text'); // 欄位值型態, 由 value 值解析出來
    const [inputValue, setInputValue] = useState(''); // 實際輸入的值, 由 value 值解析出來

    // value 變更
    useEffect(() => {
        const { computedBy } = value ?? '';

        // 由 value 解析出 type & inputValue
        const [newType, newInputValue] = computedBy == undefined ? ['text', value] : ['computedBy', computedBy];

        setType(newType);
        setInputValue(newInputValue);
        // console.log('### value changed:', { newType, value, newInputValue });
    }, [value]);

    // 輸入欄位值變更
    const inputChangeHandler = useCallback(e => {
        let newValue = e.target.value;

        let fakeE = {
            target: {
                name,
                value: type === 'computedBy' ? { computedBy: newValue } : newValue
            }
        };

        // 欄位值變更不可直接寫入 inputValue, 
        // 因 inputValue 值是由 value 值解析而來        
        onChange(fakeE); // 不可傳入 e, 因 value 如是 object 會變成 [object]...
    }, [name, type, onChange]);

    // 切換欄位值型態
    // 不可直接在此變更 type 值, type 值須由 value 值解析而來!!!
    const nextType = useCallback(e => {
        let idx = VALUE_TYPES.findIndex(({ name }) => type === name);
        let nextIdx = (idx + 1) % 2;
        let newType = VALUE_TYPES[nextIdx].name;

        let fakeE = {
            target: {
                name,
                value: newType === 'computedBy' ? { computedBy: inputValue } : inputValue
            }
        };

        onChange(fakeE); // 變更 value 值
        // console.log(`NEXT TYPE [${newType}]:`, fakeE)
    }, [name, type, inputValue, onChange]);

    return (
        <TextField
            {...others}
            name={name}
            value={inputValue}
            onChange={inputChangeHandler}
            onBlur={onBlur} // 利用 onBlur 做 state 的更新
            InputProps={
                {
                    endAdornment:
                        <InputAdornment position="end">
                            <Tooltip title={VALUE_TYPES_MAP[type].hint} arrow>
                                <IconButton
                                    onClick={nextType}
                                    onBlur={onBlur} // 利用 onBlur 做 state 的更新
                                >
                                    {VALUE_TYPES_MAP[type].icon}
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>,
                }}
        />);
})`

`);