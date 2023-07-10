import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SendIcon from '@mui/icons-material/Send';
import { Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SlideUpTransition } from 'Animations';
import EmployeeSelect from 'Component/EmployeeSelect.jsx';
import HisTextField from 'Component/HisTextField.jsx';
import { ConfirmDialog, DraggableDialog, IconnedDialogTitle } from 'Components';
import { UserContext } from 'Context/UserContext.jsx';
import React, { useCallback, useContext, useState } from 'react';
import { addHistory } from 'Tools';

const NOTICE_HISTORY_KEY = "reviewersNotice";
const DEFAULT_NOTICE = "特邀您撥冗協助會審本 MPB 澄清單。";

/**
 * 發起會簽 Dialog
 */
export default React.memo(styled(props => {
    const { onCancel, onSend, ...others } = props;
    const [notice, setNotice] = useState(DEFAULT_NOTICE); // 會簽邀請通知訊息
    const [reviewers, setReviewers] = useState([]); // 會簽邀請人員
    const [confirmDlgProps, setConfirmDlgProps] = useState({ open: false });
    const [addable, setAddable] = useState(true); // 允許會簽人員加會簽

    const { state: userState } = useContext(UserContext);

    const { title: confirmDlgTitle, titleIcon: confirmDlgIcon, open: confirmDlgOpen, onCancel: cancelHandler, onConfirm: confirmHandler,
        severity: confirmSeverity, content: confirmContent } = confirmDlgProps;

    const closeConfirmDialog = useCallback(() => setConfirmDlgProps({ open: false }), []);
    const noticeChangeHandler = useCallback(e => setNotice(e.target.value), []);

    const addableChangeHandler = e => {
        setAddable(e.target.checked)
    };

    // 發出邀請
    const send = () => {
        // 會簽人員如包含自己則無法送出
        if (reviewers.some(({ empId }) => empId == userState.empId)) {
            setConfirmDlgProps({
                title: "發起失敗", titleIcon: ErrorOutlineIcon, open: true, onConfirm: closeConfirmDialog, severity: "fatal",
                content: "對著鏡子說話會比發邀請給自己更有效率！"
            });
        } else {
            setConfirmDlgProps({
                title: "發起確認", open: true, onCancel: closeConfirmDialog, onConfirm: confirmSend, severity: "warn",
                content: ['本單進入會簽流程後，您必須等待所有會簽人員完成會審後才可繼續審批。', '您確定要發出會簽邀請？']
            });
        }
    };

    // 確認發出邀請
    const confirmSend = () => {
        onSend({ notice, reviewers });
        addHistory(NOTICE_HISTORY_KEY, notice); // 將訊息加入 history
        closeConfirmDialog();
    };

    // 關閉 dialog 後動作
    const exitHandler = () => {
        setNotice(DEFAULT_NOTICE);
        setReviewers([]);
    };

    return (
        <>
            {/* 確認 Dialog */}
            <ConfirmDialog title={confirmDlgTitle} titleIcon={confirmDlgIcon} open={confirmDlgOpen} onCancel={cancelHandler} onConfirm={confirmHandler}
                severity={confirmSeverity} content={confirmContent} />

            <DraggableDialog TransitionComponent={SlideUpTransition} {...others} TransitionProps={{ onExit: exitHandler }}>
                <IconnedDialogTitle icon={GroupAddIcon} title="會簽邀請單" />

                <DialogContent>
                    <Grid container spacing={2}>
                        {/* 通知訊息 */}
                        <Grid item xs={12}>
                            <HisTextField autoFocus storageKey={NOTICE_HISTORY_KEY} multiline fullWidth label="通知訊息"
                                minRows={5} maxRows={7} value={notice} onChange={noticeChangeHandler} />
                        </Grid>

                        {/* 會簽人員 */}
                        <Grid item xs={12}>
                            <EmployeeSelect label="會簽人員" fullWidth value={reviewers} onChange={setReviewers} />
                        </Grid>

                        {/* 允許加會簽, pending... */}
                        {/* <Grid item xs={12}>
                            <FormControlLabel label="允許所有會簽人員可再邀請其他人加入會簽" sx={{ color: 'secondary.light' }}
                                control={<Checkbox color="secondary" checked={addable} onChange={addableChangeHandler} />} />
                        </Grid> */}
                    </Grid>
                </DialogContent>

                <DialogActions>
                    {/* 取消 */}
                    <Button onClick={onCancel} fullWidth variant="contained" startIcon={<CancelOutlinedIcon />}>取消</Button>

                    {/* 發出邀請 */}
                    <Button onClick={send} fullWidth variant="contained" color="secondary" startIcon={<SendIcon />}
                        disabled={notice == '' || reviewers.length == 0}>發出邀請{reviewers.length > 0 ? `（${reviewers.length}人）` : ''}</Button>
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
    
    .EmployeeSelect-input { // 使用在 EmploySelect 元件裡的 input component
        min-height: 100px;
        max-height: calc(100vh - 475px);
    }
`);