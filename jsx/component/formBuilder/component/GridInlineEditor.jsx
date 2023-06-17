import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ConditionalGrid from './ConditionalGrid.jsx';
import InlineEditor from './InlineEditor.jsx';

export default React.memo(props => {
    const { name, label, helper, noBorder, type, hidden = false, readOnly = false, options, editorOptions } = props;
    const [inputValue, setInputValue] = useState(''); // 儲存真正資料的 input field

    const dataChangeHandler = useCallback(value => {
        // 實際儲存的值, 如為空陣列則儲存為空字串
        setInputValue(value.length == 0 ? '' : JSON.stringify(value))
    }, []);

    return (
        <ConditionalGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) => {

                    // error && console.log({ name, error })
                    defaultValue = useMemo(() => !Array.isArray(defaultValue) ? [] : defaultValue, []);

                    // 須將初始值(原來資料)寫入 input field, 儲存時才可抓到在未更動內容情況下的原來資料
                    useEffect(() => dataChangeHandler(defaultValue), []);

                    return (
                        <>
                            <InlineEditor title={label} noBorder={noBorder} options={options || editorOptions} disabled={disabled}
                                required={required} helper={helper} error={error} defaultValue={defaultValue} onChange={dataChangeHandler} />

                            {/* 儲存真正資料的 input field */}
                            <input hidden readOnly name={name} value={inputValue}
                                required={required} data-available={available.toString()} />
                        </>
                    );
                }
            }
        </ConditionalGrid>
    );
});