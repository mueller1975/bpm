import { Autocomplete, TextField } from '@mui/material';
import { ServiceContext } from 'Context/ServiceContext.jsx';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import FieldTooltip from './FieldTooltip.jsx';

/**
 * 此元件只在 EditorRow 裡使用, 非 GridAutocomplete 的子元件
 */
export default React.memo(props => {
    const { name, label, variant, hidden = false, required, row, value, tooltip,
        configCode, disabledItems, multiple = false, menuDependsOn, disabled, onChange, error,
        parentValue, menuDependsOnParent,
        freeSolo = true, disabledWhenMenuIsEmpty = false, ...others } = props;

    // const [menuDependsOnValue, setMenuDepdsOnValue] = useState();
    const [itemList, setItemList] = useState([]);
    const [uiLoaded, setUiLoaded] = useState(false);

    const inputRef = useRef();

    const { dropdowns, hierarchicalDropdowns } = useContext(ServiceContext);
    // const menuDependsOnValue = menuDependsOn ? row?.[menuDependsOn] : undefined;

    const menuDependsOnValue = menuDependsOn ? row?.[menuDependsOn] : menuDependsOnParent ? parentValue?.[menuDependsOnParent] : undefined;

    const inputRequired = required && !(disabledWhenMenuIsEmpty && itemList.length == 0);
    const disabledX = disabled || (disabledWhenMenuIsEmpty && itemList.length == 0);

    // 處理【階層式】下拉清單
    useEffect(() => {
        let list = []; // 新 menu list

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

            // 清除已選項目, 第一次不清除, 因可能有 defaultValue
            uiLoaded ? onChange(null) : setUiLoaded(true);

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

            setItemList(config?.value ?? []);
        }
    }, [dropdowns]);

    const fieldTooltip = useMemo(() => tooltip || label.length > 7 ? label : undefined, []);

    const children =
        <Autocomplete
            freeSolo={freeSolo}
            fullWidth
            size="small"
            multiple={multiple}

            disabled={disabledX}
            value={value}
            options={itemList}
            getOptionLabel={option => option?.name ?? option}
            className="RowAutocomplete"

            isOptionEqualToValue={(option, value) => option?.code === value || option?.name === value || option === value}

            autoSelect={freeSolo} // 當允許自由輸入時, 須 autoSelect=true, 可使 blur 時觸發 onChange 事件將欄位值寫入真正的 input field
            onChange={(e, newValue) => onChange(newValue)}

            ChipProps={{ color: 'primary' }}

            renderInput={params =>
                <TextField {...params}
                    // name={name} // 不可有 name
                    inputRef={inputRef}
                    label={label}
                    // variant={variant}
                    variant={disabledX ? 'outlined' : variant}
                    required={inputRequired}
                    hidden={hidden}
                    error={Boolean(error)}
                    helperText={error}
                    inputProps={{ ...params.inputProps, hidden, required: inputRequired }}
                />
            }
        />;

    return !fieldTooltip ? children :
        <FieldTooltip title={fieldTooltip}>
            {children}
        </FieldTooltip>
});