import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { generateRowField } from '../lib/formUI.jsx';
import PreviewButton from './PreviewButton.jsx';
import * as U from '../lib/formJsonUtils.js';

export default React.memo(styled(props => {
    // parentValue 有值時, 此 EditorRow 是 InnerEditorRow
    const { columns, actions = [], value, parentValue, index, uploaded, onChange, onInsert, onDelete, className,
        disabled, multiple } = props;

    // 欄位資料更動時
    const valueChangeHandler = useCallback(rowValues => {
        onChange(value?._id, rowValues); // value._id 為列 _id, 但如是 InnerEditorRow 則無此屬性
    }, [value, onChange]);

    // Autocomplete 欄位選項變動時
    const optionChangeHandler = useCallback((name, option) => {
        const { code, name: itemName } = option || {};

        let newValue = code ? code : itemName ? itemName : option ? option.toString() : null;
        valueChangeHandler({ [name]: newValue });
    }, [valueChangeHandler]);

    /* 選取附檔後動作 */
    const fileSelectHandler = useCallback(files => {
        // 檔名寫入 row 欄位中
        if (files.length > 0) {
            let filename = files[0].name
            valueChangeHandler({ attachment: filename });
        } else {
            valueChangeHandler({ attachment: null }); // 清空欄位
        }
    }, [valueChangeHandler]);

    // 額外的的列動作鈕
    const actionButtons = useMemo(() => {
        return actions.map((action, idx) => {
            switch (action) {
                case 'preview':
                    return <PreviewButton key={idx} row={value} />
                default:
                    <div>未支援的 action: ${action}</div>
            }
        });
    }, [value]);

    return (
        <div className={className}>
            {
                !multiple ? null :
                    <div className="sticky">
                        {/* 序號欄 */}
                        <div className="index">
                            <Typography align="center">{index + 1}.</Typography>
                        </div>

                        {/* 列動作欄 */}
                        {!disabled &&
                            <div className="actions">
                                {/* 刪除鈕 */}
                                <IconButton onClick={onDelete} color="secondary">
                                    <Tooltip arrow title={<Typography>刪除此列</Typography>}>
                                        <DeleteIcon />
                                    </Tooltip>
                                </IconButton>

                                {/* 新增鈕 */}
                                <IconButton onClick={onInsert} color="success">
                                    <Tooltip arrow title={<Typography>插入一新列於此列正下方</Typography>}>
                                        <AddIcon />
                                    </Tooltip>
                                </IconButton>

                                {/* 設定的其他動作鈕 */}
                                {[...actionButtons]}
                            </div>
                        }
                    </div>
            }

            {/* 設定的欄位 */
                !columns ? null :
                    columns.map(({ name, label, type, configCode, source, filterBy, uiDependsOn, width, hidden = false,
                        disabled: colDisabled = false, disabledWhen, disabledWhenMenuIsEmpty = false, freeSolo = true,
                        menuDependsOn, menuDependsOnParent, mappedRowProps = [], availableWhen }) => {

                        // const availableWhenFunc = useMemo(() => availableWhen && new Function(['row', 'U'], `return ${availableWhen}`), []);
                        // const available = useMemo(() => (!availableWhenFunc || availableWhenFunc(value, U)), [value]);

                        const availableWhenFunc =  availableWhen && new Function(['row', 'U'], `return ${availableWhen}`);
                        const available = !availableWhenFunc || availableWhenFunc(value, U);

                        // not availabe 則不顯示
                        if (!available) {
                            return null;
                        }

                        const disabledWhenFunc = !disabledWhen ? undefined : new Function(["row"], `return ${disabledWhen}`);
                        const disabledX = disabled || colDisabled || (disabledWhenFunc && disabledWhenFunc({ ...value, uploaded }));

                        const variant = disabledX ? 'outlined' : 'filled';
                        // console.log(name, { disabled, disabledX })


                        let fieldComponent = generateRowField({
                            name, label, type, configCode, source, filterBy, uiDependsOn, hidden, disabled: disabledX, disabledWhenMenuIsEmpty,
                            menuDependsOn, mappedRowProps, variant, row: value, uploaded, menuDependsOnParent, parentValue, freeSolo,
                            eventHandlers: { valueChangeHandler, optionChangeHandler, fileSelectHandler }
                        });

                        // console.log('&&& rebuild row component...')
                        return !fieldComponent ? null :
                            type == 'ui' ?
                                <React.Fragment key={name}>
                                    {fieldComponent}
                                </React.Fragment> :
                                <div key={name} style={{ width }} className={hidden ? 'hidden' : undefined}>
                                    {fieldComponent}
                                </div>;
                    })
            }

            {/* 空, 用來補齊每列長度 */}
            {/* <div className="blank"></div> */}
            {!multiple ? null : <Blank className="blank" />}
        </div>
    );
})`
    display: flex;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid transparent;

    &:last-of-type {
        margin-bottom: 4px;
    }

    ${({ multiple, disabled, theme: { palette: { mode } } }) => !multiple ? '' :
        `
        padding: ${disabled ? '6px' : '4px'};

        &:hover {
            border: 1px dashed #d4ab39;
            // background: ${mode == 'light' ? '#e9f4da' : undefined};
        }
        `
    }
    
    &>div {
        display: flex;
        align-items: flex-end;

        &:nth-of-type(n+2) {
            margin-left: 10px;
        }
    }

    .sticky {
        align-items: center;
        position: sticky;
        left: 7px;
        z-index: 2;
        border-radius: 4px 4px 0 0;
        padding: 0 4px;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(216 222 239 / 85%)' : 'rgb(51 65 89 / 90%)'};
    }

    .actions {
        display: flex;
    }

    .index {
        width: 30px;
        justify-content: center;
    }

    .blank {
         flex: 1;
         border-radius: 4px 4px 0 0;
         background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#ebebeb' : '#282e37'};
    }
`);

const Blank = React.memo(styled(({ className }) => {
    const [ref, setRef] = useState();
    const width = ref?.clientWidth ?? 0;

    useEffect(() => {
        if (width) {
            console.log('width:', width)
        }
    }, [width]);

    return <div ref={e => { setRef(e) }} className={className} />;
})`
    flex: 1;
    border-radius: 4px 4px 0 0;
    background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '' : '#282e37'};
`);