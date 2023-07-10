import { merge } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formContextState, formState } from '../context/FormContextStates';
import * as U from '../lib/formJsonUtils.js';
import ConditionalGrid from './ConditionalGrid.jsx';
import TableSelect from './TableSelect.jsx';

export default React.memo(props => {
    const { formId, name, label, helper, hidden = false, urlParams, configCode, source, filterBy,
        isContextStateProp = false, isMappedStateProp = false, freeSolo = false, mappedStateProps,
        className } = props;

    const [formContext, setFormContext] = useRecoilState(formContextState);
    const form = useRecoilValue(formState(formId));

    let filterByFunc, filterByParams;

    if (filterBy) {
        if (typeof filterBy != 'string') {
            throw Error(`form[${formId}].${name}: filterBy 必須為文字型態`);
        } else {
            filterByFunc = useMemo(() => new Function(['states', 'U'], `const {formState, ctxState} = states; return ${filterBy}`), []);
            filterByParams = filterByFunc({ formState: form, ctxState: formContext }, U);
        }
    }

    // console.log({ filterByParams })

    const params = useMemo(() => {
        if (urlParams) {
            let p = {};

            Object.entries(urlParams).forEach(([name, value]) => {
                if (typeof value == 'object') {
                    let func = new Function(['formState', 'ctxState'], `return ${value.computedBy}`);
                    value = func(form, formContext);
                }

                if (value != undefined && value != null) {
                    p[name] = value;
                }
            });

            return p;
        }
    }, [urlParams, formContext]);

    // 選取後動作    
    const confirmSelectHandler = useCallback(row => {
        let formData = {};

        Object.entries(mappedStateProps).forEach(([stateProp, tableRowProp]) => {
            let propValue;

            if (typeof tableRowProp == 'object') {
                let func = new Function(['row'], `return ${tableRowProp.computedBy}`);
                propValue = func(row) ?? '';
            } else {
                propValue = row[tableRowProp] ?? '';
            }

            let pos = stateProp.indexOf('.');

            if (pos > 0) { // 指定的欄位在其它 form 裡
                let otherFormId = stateProp.substring(0, pos);
                let prop = stateProp.substring(pos + 1);
                merge(formData, { [otherFormId]: { [prop]: propValue } });
            } else {
                merge(formData, { [formId]: { [stateProp]: propValue } });
            }
        });

        setFormContext({ ...formContext, ...formData });
        // dispatch({ type: SET_FORM_STATE, payload: formData });
    }, []);

    // 手動輸入動作, 須清除輸入欄位以外 mapped 的欄位值
    const inputChangeHandler = useCallback(inputValue => {
        let formData = {};

        // 當 freeSolo=true (允許自由輸入), 值改變時, 須清空其它 mapped state props
        Object.keys(mappedStateProps).forEach(stateProp => {
            let propValue = stateProp == name ? inputValue : null; // 其它 mapped 的欄位值清除為 null

            let pos = stateProp.indexOf('.');

            if (pos > 0) { // 指定的欄位在其它 form 裡
                let otherFormId = stateProp.substring(0, pos);
                let prop = stateProp.substring(pos + 1);
                merge(formData, { [otherFormId]: { [prop]: propValue } });
            } else {
                merge(formData, { [formId]: { [stateProp]: propValue } });
            }
        });

        console.log('@TableSelect:', formData)
        setFormContext({ ...formContext, ...formData });
        // dispatch({ type: SET_FORM_STATE, payload: formData });
    }, []);

    const clearHandler = useCallback(e => confirmSelectHandler({}), []);

    return (
        <ConditionalGrid {...props}>
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

                        inputProps={{ readOnly: !freeSolo, hidden, required, "data-available": available.toString() }}

                        error={Boolean(error)}
                        helperText={!error ? helper : error}
                        className={className}

                        onConfirm={confirmSelectHandler} />
                }
            }
        </ConditionalGrid>
    );
});