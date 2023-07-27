import BlockIcon from '@mui/icons-material/Block';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { styled } from '@mui/material/styles';
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditorRow from './EditorRow.jsx';
import Fieldset from './Fieldset.jsx';
import Hint from './Hint.jsx';
import EditorRowDisplay from './EditorRowDisplay.jsx';

// 產生新資料
const createNewRow = columns => {
    // 新資料列固定 key 欄位
    let newRow = { _id: uuidv4() };

    // 其他欄位屬性及值
    columns.forEach(({ name, defaultValue = null }) => newRow[name] = defaultValue); // 其他欄位初始值, 未設定則為 null

    return newRow;
}

export default React.memo(styled(props => {
    const { title, helper, options: { noBorder = false, columns, display },
        defaultValue, onChange, disabled, required, error, className } = props;

    const { title: displayTitle, columns: displayColumns } = display ?? {};

    const [rows, setRows] = useState(!defaultValue || defaultValue.length == 0 ? [createNewRow(columns)] : defaultValue);

    // 清除未輸入任何資料的列
    const trimRows = useCallback(rows => {
        return rows.filter(row => columns.some(({ name }) => Boolean(row[name])));
    }, [columns]);

    // 列資料有更動時
    const rowChangeHandler = useCallback((rowId, rowValues) => {
        let idx = rows.findIndex(({ _id }) => _id == rowId);
        let row = { ...rows[idx], ...rowValues }; // row partially updated

        rows.splice(idx, 1, row);
        setRows([...rows]);

        // 清除未輸入任何資料的列, 並 update 回去
        let trimmedRows = trimRows(rows);
        onChange(trimmedRows);
    }, [rows, onChange]);

    // 新增一列
    const insertNewRow = useCallback(rowIndex => {
        let newRow = createNewRow(columns);
        rows.splice(rowIndex + 1, 0, newRow);

        setRows([...rows]);
    }, [rows, columns]);

    // 刪除一列
    const deleteRow = useCallback(rowIndex => {
        rows.splice(rowIndex, 1);

        // 刪光後, 自動新增一列
        let newRows = rows.length == 0 ? [createNewRow(columns)] : [...rows];
        setRows(newRows);

        // 清除未輸入任何資料的列, 並 update 回去
        let trimmedRows = trimRows(newRows);
        onChange(trimmedRows);
    }, [rows, columns, onChange]);

    return (
        <Fieldset className={`MT-InlineEditor ${className}`} title={`${title} ${required ? ' *' : ''}`}
            noBorder={noBorder} helper={helper} error={error} icon={!disabled ? <LibraryAddIcon /> : undefined}>
            {
                disabled && (!defaultValue || defaultValue.length == 0) ?
                    <Hint icon={BlockIcon} message="無資料..." /> :
                    !(rows && Array.isArray(rows)) ? null :
                        // <Scrollable className="rowWrapper">
                        <>
                            {/* 子表多筆資料編輯 */}
                            <div className="editorContainer">
                                <div className="table">
                                    {
                                        rows.map((row, rowIndex) =>
                                            <EditorRow
                                                key={row._id}
                                                multiple
                                                columns={columns}
                                                value={row}
                                                disabled={disabled}
                                                index={rowIndex}
                                                onChange={rowChangeHandler}
                                                onInsert={() => insertNewRow(rowIndex)}
                                                onDelete={() => deleteRow(rowIndex)}
                                            />
                                        )
                                    }
                                </div>
                            </div>

                            { /* 子表多筆資料顯示 */
                                displayColumns &&
                                <Fieldset title={displayTitle}>
                                    <div className="displayContainer">
                                        {
                                            rows.map((row, rowIndex) =>
                                                <EditorRowDisplay
                                                    key={row._id}
                                                    columns={displayColumns}
                                                    value={row}
                                                />
                                            )
                                        }
                                    </div>
                                </Fieldset>
                            }
                        </>
                // </Scrollable>
            }
        </Fieldset >
    );
})`
    &.MT-InlineEditor {

        .editorContainer {
            overflow: auto hidden;

            >.table {
                display: table;
                width: 100%;
            }
        }

        .displayContainer {
            width: 100%;
            margin-top: 4px;
            display: inline-flex;
            gap: 16px;
            flex-wrap: wrap;
            align-items: baseline;

            .MT-EditorRowDisplayColumn {
            }
        }
    }
`);