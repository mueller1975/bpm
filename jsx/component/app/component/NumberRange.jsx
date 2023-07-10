import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { disableWheeling } from '../lib/formUI.jsx';

export default styled(React.forwardRef((props, ref) => {
    const { label, disabled = false, defaultValue, value, className, onValueChange, onFocus } = props;
    const [minValue, setMinValue] = useState(defaultValue?.min ?? '');
    const [maxValue, setMaxValue] = useState(defaultValue?.max ?? '');
    const [inputFocused, setInputFocused] = useState(false);

    // console.log(label, { minValue, maxValue })

    useEffect(() => {
        if (value != undefined) {
            let { min, max } = value || {};

            setMinValue(min ?? '');
            setMaxValue(max ?? '');
        }
    }, [value])

    const minValueChanged = ({ target: { value } }) => {
        setMinValue(value);
    };

    const maxValueChanged = ({ target: { value } }) => {
        setMaxValue(value);
    };

    const updateRange = () => {
        setInputFocused(false);

        if (minValue == '' && maxValue == '') { // min & max 都未輸入則回傳 null
            onValueChange(null);
        } else {
            // *** 未填入的值必須為 null, 因 undefined 在 merge 時不會蓋過舊的 value
            onValueChange({ min: minValue !== '' ? Number(minValue) : null, max: maxValue !== '' ? Number(maxValue) : null });
        }
    };

    const inputFocusedHandler = () => {
        setInputFocused(true);
        onFocus();
    };

    return (
        <div ref={ref} className={`NumberRange ${className}`}>
            <input type="number" disabled={disabled} value={minValue} onChange={minValueChanged} onBlur={updateRange}
                onFocus={inputFocusedHandler} onWheel={disableWheeling} />
            {
                (disabled || !inputFocused) && minValue == '' && maxValue == '' ? null : <span className="separator">～</span>
            }
            <input type="number" disabled={disabled} value={maxValue} onChange={maxValueChanged} onBlur={updateRange}
                onFocus={inputFocusedHandler} onWheel={disableWheeling} />
        </div>
    );
}))`
    display: flex !important;
    gap: 8px;

    input {
        width: 100%;
        font: inherit;
        color: currentColor;
        border: 0;
        background: none;
        outline: 0;
    }
`;