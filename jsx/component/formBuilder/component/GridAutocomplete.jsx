import { Autocomplete, TextField, Typography } from '@mui/material';
import { ServiceContext } from 'Context/ServiceContext.jsx';
import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import ComponentGrid from './ComponentGrid.jsx';

const ITEM_CODE_STYLE = { fontFamily: 'Monospace', lineHeight: 'normal', mr: 1 };
const ITEM_NAME_STYLE = { lineHeight: 'normal' };

export default React.memo(React.forwardRef((props, ref) => {
    const { formId, name, label, helper, variant, hidden = false, configCode, disabledItems, showItemCode, multiple = false, menuDependsOn,
        freeSolo = true, disabledWhenMenuIsEmpty = false, className, ...others } = props;

    // const [menuDependsOnValue, setMenuDepdsOnValue] = useState();
    const [itemList, setItemList] = useState([]);
    const [inputValue, setInputValue] = useState(''); // 儲存真正資料的 input field

    const inputRef = useRef();

    const { dropdowns, hierarchicalDropdowns } = useContext(ServiceContext);
    
    // 處理【階層式】下拉清單
    useEffect(() => {
        let list = []; // 新 menu list

        // if (name == '包裝碼') console.log('############', menuDependsOn, menuDependsOnValue, hierarchicalDropdowns.value)

        // 相依的值改變時, 更新本身 menu list 及清除已選項目
        if (hierarchicalDropdowns.value) {
            // 相依值有值時才更新本身下拉選單
            if (menuDependsOnValue) {
                let config = hierarchicalDropdowns.value.find(({ code }) => code == configCode);

                if (!config) {
                    console.warn(`找不到 config code [${configCode}] 的設定!`);
                } else {
                    let { code, name } = menuDependsOnValue;
                    let key = code || name || menuDependsOnValue;
                    list = config.value[key] ?? [];

                    // console.log({ key, code, name, menuDependsOnValue, list })

                    if (!list) {
                        console.warn(`找不到 config code [${configCode}/${key}] 的設定!`);
                    }
                }
            }

            // 清除已選項目
            if (inputRef.current.value) {
                // 以程式點擊"清除鈕"以清空欄位值... (因無法以 ~ 開頭, 所以由父元件開始 query 按鈕元件)
                let btn = inputRef.current.parentElement.querySelector("input ~ .MuiAutocomplete-endAdornment > .MuiAutocomplete-clearIndicator");

                if (btn) {
                    btn.click();
                    inputRef.current.blur(); // 按清除鈕後, 會 focus 在欄位
                    // console.log(`清除【${name}】下拉選單欄位值...`);
                } else {
                    console.warn(`找不到【${name}】下拉選單"清除"鈕...`)
                }
            }

            setItemList(list); // 更新 menu
        }
    }, [hierarchicalDropdowns, menuDependsOnValue]);

    // 處理【非階層式】下拉清單
    useEffect(() => {
        if (!menuDependsOn && dropdowns.value) {
            let config = dropdowns.value.find(({ code }) => code == configCode);

            if (!config) {
                console.warn(`找不到 config code [${configCode}] 的設定!`);
            }

            let list = config?.value ?? [];

            if (freeSolo) {
                if (list.some(item => item.code)) {
                    // console.warn(`${formId}【${label}】freeSolo 的下拉選單選項不可有 code 值！`)
                }
            }

            setItemList(list);
        }
    }, [dropdowns]);

    // 單選時
    const inputChanged = useCallback(item => {
        let value;

        if (item?.target) { // 有 target 屬性, 代表由 TextField onChange 事件送出, 即此欄位可自由輸入
            value = item.target.value;
        } else {
            const { code: itemCode, name: itemName } = item ?? {};

            // 選項有 code 時儲存 code, 無則儲存 name 或 item
            value = itemCode ?? itemName ?? item ?? '';
        }

        console.log(`INPUT value STORED: [${name}] `, '=>', value);
        setInputValue(value);
    }, []);

    // 多選時
    const multipleInputsChanged = (items) => {
        // 選項有 code 時儲存 code, 無則儲存 name 或 item
        let values = items.map(item => item.code ? item.code : item.name ? item.name : item.toString());
        // console.log(`多選 [${name}]:`, { values })
        setInputValue(!Array.isArray(values) ? values : JSON.stringify(values));
    };

    return (
        <ComponentGrid {...props}>
            {
                ({ required, available, disabled, valueChangedHandler, defaultValue, value, error }) => {
                    // 處理預設值與欄位型態不一致的情形
                    defaultValue = useMemo(() => {
                        let v = defaultValue;

                        if (multiple) {
                            if (!Array.isArray(v)) { // 多重值型態, 但值非陣列時
                                v = v === '' ? [] : [v];
                            }
                        } else if (Array.isArray(v)) { // 單一值型態, 但值為陣列
                            v = v[0] ?? '';
                        }

                        return v;
                    }, []);

                    useEffect(() => {
                        // 須將初始值(原來資料)寫入 input field, 儲存時才可抓到在未更動內容情況下的原來資料
                        setInputValue(!Array.isArray(defaultValue) ? defaultValue : JSON.stringify(defaultValue));
                    }, []);

                    const inputRequired = required && !(disabledWhenMenuIsEmpty && itemList.length == 0);
                    const disabledX = disabled || (disabledWhenMenuIsEmpty && itemList.length == 0);

                    return (
                        // 須以 <div> 包住, 因 <ComponentGrid> 以 <Tooltip> 包住此元件 (Tooltip 的 child 不可為陣列)
                        <div>
                            <Autocomplete
                                ref={ref}
                                className={className}
                                fullWidth
                                size="small"
                                multiple={multiple}
                                disableCloseOnSelect={multiple}

                                freeSolo={freeSolo}

                                disabled={disabledX}
                                // defaultValue={defaultValue}
                                defaultValue={defaultValue === '' && !freeSolo && !multiple ? undefined : defaultValue}
                                value={value}
                                options={itemList}

                                getOptionLabel={option => {
                                    let item;

                                    if (typeof option == 'object') {
                                        item = option;
                                    } else {
                                        item = itemList.find(({ code, name }) => option == code || option == name);
                                    }

                                    let display = !item ? option : showItemCode && item?.code ? `${item.code} ${item.name}` : item?.name ?? item.toString();
                                    // console.log({ name, item, option, display })

                                    if (name == '砂光痕等級') {
                                        // console.log('&&&', itemList, 'option:', option, 'display:', display)
                                    }
                                    return display;
                                }}

                                renderOption={(renderOptions, option) => {
                                    return (
                                        <li {...renderOptions}>
                                            {showItemCode && <Typography color="textSecondary" component="span" sx={ITEM_CODE_STYLE}>{option?.code || '_'}</Typography>}
                                            <Typography component="span" sx={ITEM_NAME_STYLE} noWrap>{option?.name ?? option.toString()}</Typography>
                                        </li>
                                    )
                                }
                                }

                                isOptionEqualToValue={(option, value) => {
                                    let equal = option?.code === value || option?.name === value || option === value;
                                    // console.log(name, option, value, equal)

                                    if (name == '砂光痕等級') {
                                        // console.log('*****', value, { option }, equal)
                                    }

                                    return equal;
                                }}

                                // autoSelect={freeSolo} // 當允許自由輸入時, 須 autoSelect=true, 可使 blur 時觸發 onChange 事件將欄位值寫入真正的 input field

                                onChange={(e, item, reason) => {
                                    const { code: itemCode, name: itemName } = item ?? {};
                                    let value = itemCode ?? itemName ?? item;

                                    // console.log(`(${name}) CHANGED:`, { item }, reason)
                                    !multiple ? inputChanged(item) : multipleInputsChanged(item);
                                    valueChangedHandler && valueChangedHandler({ name, value });
                                }}

                                ChipProps={{ color: 'primary' }}

                                renderInput={params =>
                                    <TextField {...params}
                                        // name={name}
                                        inputRef={inputRef}
                                        label={label}
                                        variant={disabledX ? 'outlined' : 'filled'}
                                        required={inputRequired}
                                        hidden={hidden}
                                        error={Boolean(error)}
                                        helperText={!error ? helper : error}
                                        inputProps={{
                                            ...params.inputProps,
                                            hidden,
                                            required: inputRequired,
                                            // available: available.toString()
                                        }}

                                        // 可自由輸入時, 須透過此 event 寫入真正儲存資料的 input field
                                        // 不可使用 onBlur, 因如是選取 item, 不會只記錄 code 值
                                        onChange={freeSolo ? inputChanged : undefined}
                                    />
                                }
                            />

                            {/* 儲存真正資料的 input field */}
                            <input type="hidden" name={name} value={inputValue}
                                readOnly required={inputRequired} data-available={available?.toString()} />
                        </div>
                    )
                }
            }
        </ComponentGrid>
    );
}));