import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Button, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DraggableDialog, IconnedDialogTitle } from 'Components';
import React, { useCallback, useState, useMemo } from 'react';

export default React.memo(styled(props => {
    const { open, onClose, onConfirm, icon, title, disableTitle = false, ...others } = props;
    const [selectedRow, setSelectedRows] = useState();

    const rowClickHandler = useCallback(row => setSelectedRows(row), []);

    const rowDblClickHandler = useCallback(row => {
        onConfirm(row);
        onClose();
    }, [onConfirm, onClose]);

    const confirmSelection = useCallback(() => {
        onConfirm(selectedRow);
        onClose();
    }, [selectedRow, onConfirm, onClose]);

    const dialogTitle = useMemo(() => disableTitle ? null :
        <IconnedDialogTitle icon={icon} title={title}>
            <Button variant="contained" startIcon={<ClearIcon />} onClick={onClose}>取消</Button>
            <Button variant="contained" color="secondary" startIcon={<CheckIcon />} onClick={confirmSelection} disabled={!Boolean(selectedRow)}>確認</Button>
        </IconnedDialogTitle>
        , [icon, title, onClose, confirmSelection, selectedRow]);

    return (
        <DraggableDialog open={open} onClose={onClose} {...others}>
            {dialogTitle}

            <DialogContent>
                <div className="tableWrapper">
                    {
                        props.children(rowClickHandler, rowDblClickHandler)
                    }
                </div>
            </DialogContent>
        </DraggableDialog>
    );
})`
    .MuiDialogTitle-root {
        padding-bottom: 2px;
    }

    .MuiDialogContent-root {
        display: flex;
        padding: 0 4px 4px 8px;
        overflow: hidden;
        justify-content: center;
    }

    .tableWrapper {
        display: flex;
        min-height: calc(100vh - 192px);
        overflow: hidden;
        justify-content: center;
    }
`);