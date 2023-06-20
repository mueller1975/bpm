import { Autocomplete, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import ComponentGrid from './ComponentGrid.jsx';

const ITEM_CODE_STYLE = { fontFamily: 'Monospace', lineHeight: 'normal', mr: 1 };
const ITEM_NAME_STYLE = { lineHeight: 'normal' };

const LOADING_TEXT = <Typography color="secondary">查詢中...</Typography>;

export default React.memo(React.forwardRef((props, ref) => {
    const { formId, name, label, variant, hidden = false,
        remoteAPI: { url: fetchUrl, params: fetchParams, method: fetchMethod = 'GET', eagerFetch = false },
        disabledItems, showItemCode, multiple = false,
        freeSolo = true, disabledWhenMenuIsEmpty = false, className, ...others } = props;


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
                                readOnly required={inputRequired} />
                        </>
                    )
                }
            }
        </ComponentGrid>
    );
}));