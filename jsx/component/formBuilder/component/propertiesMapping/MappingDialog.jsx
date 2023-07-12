import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TextField, Fab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import MappingDialog from './MappingDialog.jsx';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SimpleDialog from 'Component/SimpleDialog.jsx';

export default React.memo(styled(props => {
    const { onConfirm, onClose, className, ...others } = props;

    const cancel = useCallback(() => {
        onClose();
    }, []);

    const confirm = useCallback(() => {
        onConfirm({ '大類': 'category', '次類': 'subcategory' });
        onClose();
    }, []);

    const actions = useMemo(() => [
        { key: 'confirm', icon: <CheckIcon />, tooltipTitle: <Typography variant='subtitle1'>確認</Typography>, onClick: confirm },
        { key: 'cancel', icon: <ClearIcon />, tooltipTitle: <Typography variant='subtitle1'>取消</Typography>, onClick: cancel },
    ], [cancel, confirm]);

    return (
        <SimpleDialog title="欄位映射設定" icon={PlaylistAddIcon} actions={actions} {...others}
            onClose={onClose} className={`MT-MappingDialog ${className}`}>

        </SimpleDialog>
    );

})`

`);