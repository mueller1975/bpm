import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { ConfirmDialog, LocalDataTable, RemoteDataTable } from 'Components';
import { useAutoFullScreen, useNotification, useResponseVO } from 'Hook/useTools.jsx';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { formatMessage } from 'Tools';
import { useConirmDialog } from 'Context/ConfirmDialogContext.jsx';

// form dialog 預設狀態
const DEFAULT_FORM_OPTIONS = {
    maxWidth: "sm",
    fullWidth: true,
    fullScreen: false
};


const CrudView = React.memo(React.forwardRef((props, ref) => {
    const { tableKey, tableOptions, onAdd, onEdit } = props;

    const rowClickHandler = row => {
        console.log('(CrudView) rowClickHandler:', row);
    };

    const rowDblClickHandler = row => {
        console.log('(CrudView) rowDblClickHandler:', row);
        onEdit(row);
    };


    return <RemoteDataTable
        ref={ref}
        resizable
        storageKey={tableKey}
        options={tableOptions}
        // onSelectRow={rowClickHandler} 
        onClickRow={rowClickHandler}
        onDoubleClickRow={rowDblClickHandler}
    />;
}));

CrudView.propTypes = {
    tableKey: PropTypes.string.isRequired, // view 在 browser local storage 的 key 值
    // formKey: PropTypes.string.isRequired, // 表單在 Table 中的 primary key 屬性
};

export default CrudView;