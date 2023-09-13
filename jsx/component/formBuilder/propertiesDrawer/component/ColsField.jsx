import { TextField, Fab } from '@mui/material';
import React, { useCallback, useState, useEffect } from 'react';
import GridColsEditor from './GridColsEditor.jsx';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

export default React.memo(styled(props => {
    const { name, value, onChange, onBlur, disabled = false, className, ...others } = props;

    const [dlgOpen, setDlgOpen] = useState(false);
    const [valueDisplay, setValueDisplay] = useState('');

    const openDialog = useCallback(() => setDlgOpen(true), []);
    const closeDialog = useCallback(() => setDlgOpen(false), []);

    const valueChangeHandler = useCallback(newValue => {
        setValueDisplay(JSON.stringify(newValue))
        onChange({ target: { name, value: newValue } }, true);
    }, []);

    useEffect(() => {
        setValueDisplay(value ? JSON.stringify(value) : '');
    }, [value]);

    return (
        <div className={`MT-ColsField ${className}`}>
            {/* dialog */}
            <GridColsEditor open={dlgOpen} onClose={closeDialog} maxWidth="sm" fullWidth
                value={value} onConfirm={valueChangeHandler} />

            {/* 編輯按鈕 */}
            <Fab className="edit-btn" size="medium" color="primary" disabled={disabled}
                onClick={openDialog}>

                <EditIcon fontSize="small" />
            </Fab>

            <TextField disabled value={valueDisplay} {...others} />
        </div>
    );
})`
    &.MT-ColsField {
        position: relative;

        >.edit-btn {
            position: absolute;
            right: 8px;
            bottom: 8px;
            z-index: 1;
        }
    }
`);