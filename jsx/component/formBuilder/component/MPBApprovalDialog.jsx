import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SlideUpTransition } from 'Animations';
import HisTextField from 'Component/HisTextField.jsx';
import { ConfirmDialog, DraggableDialog, IconnedDialogTitle } from 'Components';
import React, { useState, useCallback, useMemo } from 'react';
import { addHistory } from 'Tools';
import { DISAGREED, AGREED } from '../lib/formConsts';

const AUDIT_RESULT = {
    [AGREED]: { text: '同意', color: 'success', icon: <ThumbUpAltIcon /> },
    [DISAGREED]: { text: '不同意', color: 'error', icon: <ThumbDownIcon /> },
};

const AUDIT_COMMENTS_KEY = "auditComments";

/**
 * 審批 Dialog
 */
export default React.memo(styled(props => {
    const { result, onAgree, onDisagree, onCancel, pending = false, ...others } = props;
    const [comments, setComments] = useState();
    const [confirmDlgOpen, setConfirmDlgOpen] = useState(false);

    const openConfirmDialog = useCallback(() => setConfirmDlgOpen(true), []);
    const closeConfirmDialog = useCallback(() => setConfirmDlgOpen(false), []);
    const commentsChangeHandler = useCallback(e => setComments(e.target.value), []);

    const transitionProps = useMemo(() => ({ onExit: () => setComments('') }), []);
    const auditResult = AUDIT_RESULT[result];

    const confirmResult = useCallback(() => {
        switch (result) {
            case DISAGREED:
                onDisagree(comments);
                break;
            case AGREED:
                onAgree(comments);
                break;
            default:
                throw new Error(`不支援的審批動作: ${result}`);
        }

        if (comments) {
            addHistory(AUDIT_COMMENTS_KEY, comments);
        }

        closeConfirmDialog();
    }, [result, comments, onAgree, onDisagree]);

    return (
        <>
            <ConfirmDialog title="審批確認" open={confirmDlgOpen} onCancel={closeConfirmDialog} onConfirm={confirmResult} severity="warn"
                content={[`您審批的結果為「${auditResult?.text}」！`, `確定要完成審批？`]} />

            <DraggableDialog TransitionComponent={SlideUpTransition} {...others} TransitionProps={transitionProps}>
                <IconnedDialogTitle icon={PersonSearchIcon} title="MPB 訂單澄清審批" />

                <DialogContent>
                    <HisTextField autoFocus storageKey={AUDIT_COMMENTS_KEY} multiline fullWidth label="審批通過/不通過意見"
                        required={result == DISAGREED} disabled={pending}
                        minRows={5} maxRows={10} value={comments} onChange={commentsChangeHandler} />
                </DialogContent>

                {/* 動作列按鈕 */}
                <DialogActions>
                    {/* 取消鈕 */}
                    <Button onClick={onCancel} fullWidth variant="contained" startIcon={<CancelOutlinedIcon />}
                        disabled={pending}>取消</Button>

                    {/* 通過/不通過鈕 */}
                    <Button onClick={openConfirmDialog} fullWidth variant="contained" color={auditResult?.color} startIcon={auditResult?.icon}
                        disabled={pending || (result == DISAGREED && !Boolean(comments))}>{auditResult?.text}</Button>
                </DialogActions>
            </DraggableDialog>
        </>
    );
})`
    .MuiDialogContent-root {
        padding: 8px 24px;        
    }

    .MuiDialogActions-root {
        padding: 4px 24px 20px;
        justify-content: center;
    }    
`);