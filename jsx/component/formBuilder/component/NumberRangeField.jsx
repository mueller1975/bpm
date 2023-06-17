import { FilledInput, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import NumberRange from './NumberRange.jsx';

export default React.memo(styled(props => {
    const { name, label, helper, fullWidth, size, variant, hidden = false, className, onChange,
        required, disabled, defaultValue, value, error
    } = props;

    const [labelShrinked, setLabelShrinked] = useState(Boolean(defaultValue) || Boolean(value));

    useEffect(() => {
        setLabelShrinked(Boolean(defaultValue) || Boolean(value));
    }, [value]);

    const rangeChangeHandler = range => {
        setLabelShrinked(Boolean(range));
        onChange && onChange(range);
    };

    const onInputFocus = () => {
        setLabelShrinked(true);
    };

    return (
        <FormControl fullWidth={fullWidth} size={size} disabled={disabled} hidden={hidden} required={required} error={Boolean(error)}
            className={`NumberRangeField ${className}`}>
            {
                variant == 'outlined' ?
                    <>
                        <InputLabel shrink={labelShrinked} error={Boolean(error)}>{label}</InputLabel>
                        <OutlinedInput label={label} notched={labelShrinked} error={Boolean(error)}
                            inputComponent={NumberRange}
                            inputProps={{
                                label,
                                disabled,
                                defaultValue,
                                value,
                                onValueChange: rangeChangeHandler, // 不可使用 onChange, 會被 InputBase 偷偷呼叫
                            }}
                        />
                    </> :
                    <>
                        <InputLabel shrink={labelShrinked} error={Boolean(error)}>{label}</InputLabel>
                        <FilledInput label={label} error={Boolean(error)}
                            inputComponent={NumberRange}
                            inputProps={{
                                label,
                                disabled,
                                defaultValue,
                                value,
                                onFocus: onInputFocus,
                                onValueChange: rangeChangeHandler, // 不可使用 onChange, 會被 InputBase 偷偷呼叫
                            }}
                        />
                    </>
            }
            <FormHelperText>{!error ? helper : error}</FormHelperText>
        </FormControl>
    );
})`
    .MuiInputLabel-root:not([data-shrink=true]) {
        transform: translate(12px, 13px) scale(1);

        &.Mui-disabled {
            transform: translate(12px, 9px) scale(1);
        }
    }

    .MuiInputLabel-root[data-shrink=true] {

        &:not(.Mui-disabled) {
            transform: translate(12px, 4px) scale(.75);
        }
    }
`);