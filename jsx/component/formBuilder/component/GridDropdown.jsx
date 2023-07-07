import React from 'react';
import ComponentGrid from './ComponentGrid.jsx';
import Dropdown from './Dropdown.jsx';

export default React.memo(React.forwardRef((props, ref) => {
    const { name, label, helper, hidden = false, configCode, menuDependsOn, disabledItems, showItemCode = false, className } = props;

    return (
        <ComponentGrid {...props}>
            {
                ({ required, disabled, valueChangedHandler, defaultValue, value, error }) => {
                    // console.log({ name, defaultValue, value });

                    return <Dropdown
                        ref={ref}
                        fullWidth
                        size="small"
                        name={name}
                        label={label}
                        variant={disabled ? 'outlined' : 'filled'}

                        configCode={configCode}
                        showItemCode={showItemCode}
                        disabledItems={disabledItems}

                        hidden={hidden}
                        disabled={disabled}
                        required={required}
                        onChange={valueChangedHandler}
                        inputProps={{ hidden, required, }}
                        defaultValue={defaultValue ?? ''}
                        value={value}
                        error={Boolean(error)}
                        helperText={!error ? helper : error}

                        className={className}
                    />
                }
            }
        </ComponentGrid>
    );
}));