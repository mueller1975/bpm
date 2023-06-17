import React, { useRef, useEffect } from 'react';
import ConditionalGrid from './ConditionalGrid.jsx';
import NumberRangeField from './NumberRangeField.jsx';

export default React.memo(props => {
    const { name, label, helper, hidden = false } = props;
    const inputRef = useRef();

    const rangeChangeHandler = range => {
        inputRef.current.value = range ? JSON.stringify(range) : range; // 實際儲存的值, 空字串或 json string
        // console.log('input value:', inputRef.current.value)
    };

    return (
        <ConditionalGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) => {

                    // value 會變動且非 undefined, 代表 isMappedStateProp or computed
                    useEffect(() => {
                        if (value != undefined) {
                            rangeChangeHandler(value);
                        }
                    }, [value]);

                    return (
                        // 須以 <div> 包住, 因 <ConditionalGrid> 以 <Tooltip> 包住此元件 (Tooltip 的 child 不可為陣列)
                        <div className="GridNumberRange">
                            <NumberRangeField fullWidth size="small" name={name} label={label} helper={helper}
                                hidden={hidden}
                                variant={disabled ? 'outlined' : 'filled'}
                                defaultValue={defaultValue}
                                value={value}
                                required={required} disabled={disabled} error={error}
                                onChange={range => {
                                    rangeChangeHandler(range);
                                    valueChangedHandler && valueChangedHandler({ name, value: range });
                                }} />

                            {/* 欄位實際儲存的值 */}
                            <input name={name} ref={inputRef}
                                defaultValue={!defaultValue ? '' : typeof defaultValue === 'string' ? defaultValue : JSON.stringify(defaultValue)}
                                hidden required={required} disabled={disabled} data-available={available.toString()} />
                        </div>
                    );
                }
            }
        </ConditionalGrid>
    );
});