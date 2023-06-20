import React, { useEffect, useState } from 'react';
import ComponentGrid from './ComponentGrid.jsx';
import FileUploader from './FileUploader.jsx';

export default React.memo(props => {
    const { name, label, helper, hidden = false, readOnly = false, options, uploaderOptions } = props;
    const [inputValue, setInputValue] = useState(''); // 儲存真正資料的 input field

    const dataChangeHandler = value => {
        // 實際儲存的值, 如為空陣列則儲存為空字串
        setInputValue(value.length == 0 ? '' : JSON.stringify(value))
    };

    return (
        <ComponentGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) => {

                    // error && console.log({ name, error })
                    defaultValue = !Array.isArray(defaultValue) ? [] : defaultValue;

                    // 須將初始值(原來資料)寫入 input field, 儲存時才可抓到在未更動內容情況下的原來資料
                    useEffect(() => dataChangeHandler(defaultValue), []);

                    return (
                        <>
                            <FileUploader title={label} options={options || uploaderOptions} disabled={disabled}
                                required={required} helper={helper} error={error} defaultValue={defaultValue} onChange={dataChangeHandler} />

                            {/* 儲存真正資料的 input field (加入自定義屬性 uploader="true") */}
                            <input type="hidden" name={name} value={inputValue} uploader="true"
                                readOnly required={required} />
                        </>
                    );
                }
            }
        </ComponentGrid>
    );
});