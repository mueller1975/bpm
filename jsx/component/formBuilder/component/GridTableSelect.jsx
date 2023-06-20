import React, { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { formDataState } from '../context/FormStates.jsx';
import * as U from '../lib/formJsonUtils.js';
import ComponentGrid from './ComponentGrid.jsx';
import TableSelect from './TableSelect.jsx';

export default React.memo(props => {
    const { formId, name, label, helper, hidden = false, urlParams, configCode, source, filterBy,
        isContextStateProp = false, isMappedStateProp = false, freeSolo = false, mappedStateProps,
        className } = props;
    const ctxState = useRecoilValue(formDataState);

    const formState = ctxState[formId];

    let filterByFunc, filterByParams;

    if (filterBy) {
        if (typeof filterBy != 'string') {
            throw Error(`form[${formId}].${name}: filterBy 必須為文字型態`);
        } else {
            filterByFunc = useMemo(() => new Function(['states', 'U'], `const {formState, ctxState} = states; return ${filterBy}`), []);
            filterByParams = filterByFunc({ formState, ctxState }, U);
        }
    }

    // console.log({ filterByParams })

    const params = useMemo(() => {
        if (urlParams) {
            let p = {};

            Object.entries(urlParams).forEach(([name, value]) => {
                if (typeof value == 'object') {
                    let func = new Function(['formState', 'ctxState'], `return ${value.computedBy}`);
                    value = func(formState, ctxState);
                }

                if (value != undefined && value != null) {
                    p[name] = value;
                }
            });

            return p;
        }
    }, [urlParams, ctxState]);

    // 選取後動作    
    const confirmSelectHandler = useCallback(row => {
        console.log('Selection confirmed...');
    }, []);

    // 手動輸入動作, 須清除輸入欄位以外 mapped 的欄位值
    const inputChangeHandler = useCallback(inputValue => {
        console.log('typing...');
    }, []);

    const clearHandler = useCallback(e => confirmSelectHandler({}), []);

    return (
        <ComponentGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) => {
                    // console.log({ name, defaultValue, value });

                    return <TableSelect
                        source={source}
                        configCode={configCode}
                        params={filterByParams}
                        urlParams={params}
                        defaultValue={defaultValue}
                        value={value}

                        fullWidth
                        size="small"
                        name={name}
                        variant={disabled ? 'outlined' : 'filled'}
                        label={label}
                        hidden={hidden}
                        disabled={disabled}
                        required={required}

                        // 允許手動輸入時
                        onInputChange={freeSolo ? inputChangeHandler : undefined}

                        onClear={clearHandler}

                        inputProps={{ readOnly: !freeSolo, hidden, required, }}

                        error={Boolean(error)}
                        helperText={!error ? helper : error}
                        className={className}

                        onConfirm={confirmSelectHandler} />
                }
            }
        </ComponentGrid>
    );
});