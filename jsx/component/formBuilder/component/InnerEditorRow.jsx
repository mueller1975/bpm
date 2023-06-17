import { useNotification, useResponseVO } from 'Hook/useTools.jsx';
import React, { useCallback, useEffect, useState } from 'react';
import EditorRow from './EditorRow.jsx';

/**
 * EditorRow as a child of another EditorRow
 */
export default props => {
    const { name, value, configCode, row, uiDependsOn, onChange, disabled, ...others } = props;
    const [ui, setUI] = useState([]);
    const [uiLoaded, setUiLoaded] = useState(false);
    const { showError } = useNotification();

    const fetchValueFunc = useCallback(() => fetch(`service/config?code=${configCode}`, { method: 'GET', redirect: 'manual' }),
        [configCode]);
    const { execute: fetchValue, pending: fetching, value: configValue, error: fetchError } = useResponseVO(fetchValueFunc);

    useEffect(() => {
        fetchValue && fetchValue({ convertDataToObject: true });
    }, [fetchValue]);

    const uiDependsOnValue = row[uiDependsOn];

    useEffect(() => {
        fetchError && showError(fetchError.message);

        if (configValue) {
            if (uiDependsOn) {
                let dependentUI = uiDependsOnValue ? configValue[uiDependsOnValue] ?? [] : [];
                setUI(dependentUI);
            } else {
                setUI(configValue);
            }
        }
    }, [configValue, fetchError, uiDependsOnValue]);

    useEffect(() => {
        // 清除 EditorRow value, 第一次不清除, 因可能有 defaultValue
        uiLoaded ? onChange(null) : setUiLoaded(true);
    }, [uiDependsOnValue]);

    const valueChangeHandler = useCallback((dummy, newValue) => {
        let rowValues = { ...value, ...newValue };
        // 如所有欄位值皆為 null, value = null
        let hasNonNullValue = Object.values(rowValues).some(propValue => propValue !== null);

        onChange(hasNonNullValue ? rowValues : null);
    }, [onChange]);

    return (
        ui.length == 0 ? null :
            <EditorRow multiple={false} index={0} columns={ui} value={value} parentValue={row} disabled={disabled} onChange={valueChangeHandler} />

        // <>
        //     {
        //         ui.map((column, idx) => (
        //             <div key={`${props.name}-${idx}`} style={{ width: column.width ?? 100 }}>
        //                 {
        //                     generateRowField({ ...others, ...column, row })
        //                 }
        //             </div>
        //         ))
        //     }
        // </>
    );
};