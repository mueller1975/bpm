import { Autocomplete, TextField, Typography } from '@mui/material';
import { CSRF_HEADER, CSRF_TOKEN } from 'Config';
import { useResponseVO } from 'Hook/useTools.jsx';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as U from '../lib/formJsonUtils.js';
import { MPBFormContext } from '../context/MPBFormContext.jsx';
import ConditionalGrid from './ConditionalGrid.jsx';

const ITEM_CODE_STYLE = { fontFamily: 'Monospace', lineHeight: 'normal', mr: 1 };
const ITEM_NAME_STYLE = { lineHeight: 'normal' };

const LOADING_TEXT = <Typography color="secondary">查詢中...</Typography>;

export default React.memo(React.forwardRef((props, ref) => {
    const { formId, name, label, variant, hidden = false,
        remoteAPI: { url: fetchUrl, params: fetchParams, method: fetchMethod = 'GET', eagerFetch = false },
        disabledItems, showItemCode, multiple = false,
        freeSolo = true, disabledWhenMenuIsEmpty = false, className, ...others } = props;

    const { state: ctxState } = useContext(MPBFormContext);
    const formState = ctxState[formId];

    const prevFetchDataRef = useRef(); // 當查詢時發生在開啟下拉選單時, 須記錄 fetchData() 以判斷是否須重新 fetch data

    const paramsFunc = useMemo(() => fetchParams?.computedBy &&
        new Function(['states', 'U'], `const {ctxState, formState} = states; return ${fetchParams.computedBy}`), []);

    const [contentType, bodyString] = useMemo(() => {
        let contentType = 'x-www-form-urlencoded';
        let bodyString = paramsFunc ? paramsFunc({ formState, ctxState }, U) : fetchParams;

        if (typeof bodyString == 'object') {
            contentType = 'application/json';
            bodyString = JSON.stringify(bodyString);
        }

        return [contentType, bodyString];
    }, [ctxState]);

    const fetchFunc = useCallback(() =>
        fetch(fetchUrl, {
            method: fetchMethod, body: bodyString, redirect: 'manual',
            headers: { 'Content-Type': contentType, [CSRF_HEADER]: CSRF_TOKEN }
        }), [bodyString]);

    const { execute: fetchData, pending: fetching, value: fetchResult, error: fetchError } = useResponseVO(fetchFunc, 1000);

    const [itemList, setItemList] = useState([]);
    const [inputValue, setInputValue] = useState(''); // 儲存真正資料的 input field

    const inputRef = useRef();

    useEffect(() => {
        if (eagerFetch && fetchData) {
            console.debug(`Fetching Autocomplete [${formId}.${name}] menu from [${fetchUrl}]...`);
            fetchData();
        }
    }, [eagerFetch, fetchData]);

    useEffect(() => {
        if (fetchResult) {
            console.log(`[${formId}.${name}] 下拉選單 [${fetchUrl}] 查詢結果:`, fetchResult);
            setItemList(fetchResult); // 更新 menu
        }

        if (fetchError) {
            console.warn(`[${formId}.${name}] 下拉選單 [${fetchUrl}]:`, fetchError.message);
            setItemList([]); // 清空 menu
        }
    }, [fetchResult, fetchError]);

    const menuOpenedHandler = e => {

        if (!eagerFetch && fetchData != prevFetchDataRef.current) {
            prevFetchDataRef.current = fetchData;
            setItemList([]);
            fetchData();
        }
    };

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

        // console.log(`INPUT value STORED: [${name}] `, '=>', value);
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
        <ConditionalGrid {...props}>
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
                        <>
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

                                noOptionsText="無符合選項"
                                loadingText={LOADING_TEXT}
                                loading={fetching}
                                onOpen={menuOpenedHandler}

                                getOptionLabel={option => {
                                    let item;

                                    if (typeof option == 'object') {
                                        item = option;
                                    } else {
                                        item = itemList.find(({ code, name }) => option == code || option == name);
                                    }

                                    let display = !item ? option : showItemCode && item?.code ? `${item.code} ${item.name}` : item?.name ?? item.toString();
                                    // console.log({ name, item, option, display })
                                    return display;
                                }}

                                renderOption={(renderOptions, option) => (
                                    <li {...renderOptions}>
                                        {showItemCode && <Typography color="textSecondary" component="span" sx={ITEM_CODE_STYLE}>{option?.code || '_'}</Typography>}
                                        <Typography component="span" sx={ITEM_NAME_STYLE} noWrap>{option?.name ?? option.toString()}</Typography>
                                    </li>
                                )}

                                isOptionEqualToValue={(option, value) => {
                                    let equal = option?.code === value || option?.name === value || option === value;
                                    // console.log(name, option, value, equal)
                                    return equal;
                                }}

                                autoSelect={freeSolo} // 當允許自由輸入時, 須 autoSelect=true, 可使 blur 時觸發 onChange 事件將欄位值寫入真正的 input field

                                onChange={(e, item, reason) => {
                                    const { code: itemCode, name: itemName } = item ?? {};
                                    let value = itemCode ?? itemName ?? item;

                                    console.log(`(${name}) CHANGED:`, { item }, reason)
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
                                        helperText={error}
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
                        </>
                    )
                }
            }
        </ConditionalGrid>
    );
}));