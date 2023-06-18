import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useMemo } from 'react';
import { MPBFormContext, SET_FORM_STATE } from '../context/MPBFormContext.jsx';
import Conditional from './Conditional.jsx';
import FieldTooltip from './FieldTooltip.jsx';

/**
 * 此 Grid 元件處理以下:
 * 
 * 1. 欄位狀態條件 (Conditional 元件)
 * 2. 欄位初始值
 * 3. 具 isContextStateProp, isMappedStateProp 屬性的欄位
 */
export default React.memo(styled(props => {
    const { formId, cols, name, label, hidden = false, type, computedBy, computedWhen,
        isContextStateProp = false, isMappedStateProp = false, freeSolo = false, tooltip, className } = props;

    const { state: ctxState, dispatch } = useContext(MPBFormContext);
    const formState = ctxState[formId];

    const computedWhenFunc = useMemo(() => computedWhen && new Function(['states'], `const {ctxState, formState} = states; return ${computedWhen}`), []);
    const computedByFunc = useMemo(() => computedBy && new Function(['states'], `const {ctxState, formState} = states; return ${computedBy}`), []);
    // const defaultValueFunc = useMemo(() => typeof props.defaultValue == 'object' ? new Function(props.defaultValue.args, props.defaultValue.body) : undefined, []);

    let defaultValue, value; // *** Important! 計算後指定給 component 的值, 必須是一個為 undefined, 另一個不為 undefined

    if (isMappedStateProp) {
        value = formState?.[name] ?? ''; // 欄位值取決於 MPBFormContext state prop (component is controlled)
    } else if (computedByFunc) {
        if (computedWhenFunc) {

        }
        value = computedByFunc({ formState, ctxState }) ?? ''; // 不可為 undefined or null
    } else {
        defaultValue = props.defaultValue ?? ''; // 欄位值自由輸入 (component is uncontrolled)
    }

    // const prevValue = usePrevious(value);

    // if (prevValue == undefined && value != undefined) {
    //     console.warn(`UNCONTROLLED to CONTROLLED: [${formId}.${name}] value:`, prevValue, '=>', value, ', defaultValue:', defaultValue);
    // } else if (prevValue != undefined && value == undefined) {
    //     console.warn(`CONTROLLED to UNCONTROLLED: [${formId}.${name}] value:`, prevValue, '=>', value, ', defaultValue:', defaultValue);
    // }

    // 如該欄位是 MPBFormContext state prop, 則將值寫入 state
    const valueChangedHandler = !(isContextStateProp || (isMappedStateProp && freeSolo)) ? undefined :
        e => {
            let { name, value } = e?.target ?? e;
            value = value === '' ? null : value; // value 為空字串時, 轉為 null
            // console.log('valueChanged:', { name, value, isMappedStateProp, freeSolo })
            dispatch({ type: SET_FORM_STATE, payload: { [formId]: { [name]: value } } });
        };

    useEffect(() => {
        if (computedByFunc && valueChangedHandler) {
            // console.log('寫回 form context:', name, value);
            valueChangedHandler({ name, value });
        }
    }, [value]);

    // 該欄位是否檢核錯誤
    const error = ctxState?.formErrors?.forms[formId]?.fields?.[name];

    return (
        <Conditional {...props}>
            {
                ({ parentAvailable, available, required, disabled }) => {

                    const renderProps = useMemo(() => ({ defaultValue, value, available, required, disabled, valueChangedHandler, error }), [
                        defaultValue, value, available, required, disabled, valueChangedHandler, error]);

                    const children = typeof props.children == 'function' ? props.children(renderProps) : props.children;
                    const fieldTooltip = useMemo(() => tooltip ?? (label.length > 7 ? label : undefined), []);

                    return (
                        <Grid item
                            {...cols}
                            className={`ConditionalGrid ${className} ${hidden || !available ? 'hidden' : ''}`}
                        >
                            {
                                !fieldTooltip ? children :
                                    <FieldTooltip title={fieldTooltip}>
                                        {children}
                                    </FieldTooltip>
                            }
                        </Grid>
                    );
                }
            }
        </Conditional>
    );
})`

    &.hidden {
        // content-visibility: hidden;
        // flex-basis: 0;
        // padding: 0;
        display: none;
    }

    .MuiInputBase-input.Mui-disabled {
        -webkit-text-fill-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)'};
    }

    .MuiOutlinedInput-input.Mui-disabled {
        padding: 10px 14px 7px;
    }

    .MuiAutocomplete-inputRoot {
        display: flex;
        align-items: baseline;
    }

    .MuiFilledInput-root {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '' : 'rgb(255 255 255 / 6%)'};

        &:hover {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '' : 'rgb(255 255 255 / 9%)'};
        }
    }
`);