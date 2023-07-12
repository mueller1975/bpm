import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TextField, Fab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import MappingDialog from './MappingDialog.jsx';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export default React.memo(styled(props => {
    const { name, value, className, disabled = false, onChange, ...others } = props;
    const [dlgOpen, setDlgOpen] = useState(false);
    const [valueDisplay, setValueDisplay] = useState('');

    useEffect(() => {
        setValueDisplay(value ? JSON.stringify(value) : '');
    }, [value]);

    const openDialog = useCallback(() => setDlgOpen(true), []);
    const closeDialog = useCallback(() => setDlgOpen(false), []);

    const mappingConfirmHandler = useCallback(mappings => {
        onChange({ target: { name, value: mappings } })
    }, []);

    return (
        <div className={`MT-PropertiesMappingField ${className}`}>
            {/* dialog */}
            <MappingDialog open={dlgOpen} onClose={closeDialog} maxWidth="md" fullWidth
                onConfirm={mappingConfirmHandler} />

            {/* 編輯按鈕 */}
            <Fab className="edit-btn" size="medium" color="primary" disabled={disabled}
                onClick={openDialog}>

                <EditIcon fontSize="small" />
            </Fab>

            {/* 欄位 */}
            <TextField {...others} name={name} value={valueDisplay} fullWidth disabled />
        </div>
    );
})`
    &.MT-PropertiesMappingField {
        position: relative;

        >.edit-btn {
            position: absolute;
            right: 8px;
            bottom: 8px;
            z-index: 1;
        }
    }
`);