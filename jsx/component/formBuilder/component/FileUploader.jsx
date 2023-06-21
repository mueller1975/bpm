import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import { styled } from '@mui/material/styles';
import React, { useMemo, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditorRow from './EditorRow.jsx';
import Fieldset from './Fieldset.jsx';
import Hint from './Hint.jsx';

// 產生新資料
const createNewRow = columns => {
    // upload file keys (date & id)
    const _date = new Date().toISOString().substring(0, 10);
    const _id = uuidv4();

    // 新資料列固定兩個 key 欄位
    let newRow = { _date, _id };

    // 其他欄位屬性及值
    columns.forEach(({ name, defaultValue = null }) => newRow[name] = defaultValue); // 其他欄位初始值, 未設定則為 null

    return newRow;
};

export default React.memo(styled(props => {
    const { title, helper, options: { noBorder = false, columns, actions = [] }, defaultValue, onChange,
        required, error, disabled, className } = props;

    // "上傳檔案"欄位名稱必須是"attachment", 若未在 json 裡設定, 則自動產生並加到最前面
    const [uploaderColumns] = useState(() => {
        let hasFileTypeCol = columns.some(col => col.type === 'file');
        return !hasFileTypeCol ? [{ uuid: uuidv4(), name: 'attachment', label: '上傳附檔', type: 'file', width: 300 }, ...columns] : columns;
    });

    const [rows, setRows] = useState(() => !defaultValue || defaultValue.length == 0 ? [createNewRow(uploaderColumns)] : defaultValue);

    // console.log({ defaultValue, rows, noBorder })

    // 從 defaultValue 中取出已上傳檔案的 id (defaultValue 記錄的是已上傳過的檔案資訊)
    const uploadedIds = useMemo(() => defaultValue.filter(row => Boolean(row.attachment)).map(row => row._id), []);

    // 清除未輸入任何資料的列
    const trimRows = rows => {
        return rows.filter(row => uploaderColumns.some(({ name }) => Boolean(row[name])));
    };

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

    const component = (
        !(rows && Array.isArray(rows)) ? null :
            <div className="rowContainer">
                {
                    rows.map((row, rowIndex) =>
                        <EditorRow
                            key={row._id}
                            multiple
                            actions={actions}
                            columns={uploaderColumns}
                            value={row}
                            disabled={disabled}
                            index={rowIndex}
                            uploaded={uploadedIds.indexOf(row._id) > -1} // 是否已上傳過
                            onChange={rowChangeHandler}
                            onInsert={() => insertNewRow(rowIndex)}
                            onDelete={() => deleteRow(rowIndex)} />
                    )
                }
            </div>
    );

    return !title ? component :
        <Fieldset title={`${title} ${required ? ' *' : ''}`} noBorder={noBorder} icon={<AttachFileIcon />}
            helper={helper} error={error} className={className}>
            {
                disabled && (!defaultValue || defaultValue.length == 0) ?
                    <Hint icon={FileDownloadOffIcon} message="無上傳附檔..." /> :
                    component
            }
        </Fieldset>;
})`
    .rowContainer {
        display: table;
    }
`);