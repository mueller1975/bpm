import { Checkbox, FormControl, FormControlLabel, FilledInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import ConditionalGrid from './ConditionalGrid.jsx';
import YesNoCheckbox from './YesNoCheckbox.jsx';

export default React.memo(styled(props => {
    const { name, label, variant, hidden = false, className } = props;

    return (
        <ConditionalGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) => {

                    const content = <FormControlLabel
                        name={name}
                        label={label}
                        className="labelControl"
                        hidden={hidden}
                        disabled={disabled}
                        required={required}
                        control={<Checkbox
                            color="warning"
                            value="Y"
                            size="small"
                            defaultChecked={defaultValue === 'Y'}
                            inputProps={{ hidden, required, "data-available": available.toString() }}
                            onChange={e => valueChangedHandler && valueChangedHandler({ name, value: e.target.checked ? 'Y' : 'N' })}
                        />} />;

                    const filled = <FilledInput
                        size="small"
                        fullWidth
                        inputComponent={YesNoCheckbox}
                        inputProps={{
                            name,
                            label,
                            defaultValue,
                            color: 'warning',
                            hidden,
                            required,
                            available: available.toString(), // 在 <YesNoCheckbox /> 中轉為 data-available
                            onChange: e => valueChangedHandler && valueChangedHandler({ name, value: e.target.checked ? 'Y' : 'N' })
                        }}
                    />;

                    return (
                        <FormControl fullWidth error={error} className={`${className} ${variant ?? ''} ${disabled ? 'disabled' : ''}`}>
                            {!disabled ? filled :
                                <fieldset className={`${className} ${disabled ? 'disabled' : ''}`}>
                                    {content}
                                </fieldset>
                            }
                        </FormControl>);
                }
            }
        </ConditionalGrid>
    );
})`
    color: rgb(125 139 230);

    &.standard {
        height: 100%;
        justify-content: end;
        box-sizing: border-box;

        :before {
            border-bottom: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '1px solid rgba(0, 0, 0, 0.42)' : '1px solid rgba(255, 255, 255, 0.7)'};
            content: "\\00a0";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
        }
        
        :hover:not(.disabled):before {
            border-bottom: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '2px solid rgba(0, 0, 0, 0.87)' : '2px solid #fff'};
        }

        &.disabled:before {
            border-bottom-style: dotted;
        }
    }

    fieldset {
        border: 1px solid;
        border-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(179 179 179)' : 'rgba(255, 255, 255, 0.23)'};
        border-radius: 4px;
        padding: 1px 8px 0 0;
        margin: 0;
        

        &:hover {
            border-color: ${({ disabled, theme: { palette: { mode } } }) => disabled ? undefined : mode == 'light' ? '#1f1f1f' : 'rgba(255, 255, 255, 0.9)'};
        }
    }    

    .labelControl {
        margin: 0;
        width: 100%;
    }

    .MuiFormControlLabel-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        width: 35px;
    }

    .MuiCheckbox-root.Mui-checked.Mui-disabled {
        color: rgb(255 167 38 / 67%);
    }
`);