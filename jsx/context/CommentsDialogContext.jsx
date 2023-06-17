import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { SlideUpTransition } from 'Animations';
import HisTextField from 'Component/HisTextField.jsx';
import { DraggableDialog, IconnedDialogTitle } from 'Components';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import React, { createContext, useCallback, useContext, useReducer, useState } from 'react';
import { addHistory } from 'Tools';
import { styled } from '@mui/material/styles';

const COMMENTS_VARIANTS = {
    // 會簽
    review: {
        key: "reviewerComments",
        title: "會簽意見",
        comments: "贊成。",
        confirmText: "我要送出",
        cancelText: "取消",
        confirmTitle: '會簽確認',
        confirmContent: [`確定要送出會簽意見？`],
    },

    // 重審
    reaudit: {
        key: "reauditComments",
        title: "重審原因",
        comments: "重審。",
        confirmText: "我要重審",
        cancelText: "取消",
        confirmTitle: '重審確認',
        confirmContent: ['確認後系統將啟動重審流程！', '您確認要重審本澄清單？'],
    },

    common: {
        key: "commonComments",
    }
};

export const SET_STATE = 'setState'; // 設定 state
export const RESET_STATE = 'resetState'; // 重置 state
export const SET_FORM_STATE = 'setFormState'; // 設定 form state

const initialState = {
    open: false, title: '', content: '', severity: 'info', confirmTitle: '', maxWidth: 'sm', fullWidth: true,
    confirmText: '', cancelText: '', onCancel: undefined, onConfirm: undefined
};

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case SET_STATE: // 設定 state
            return { ...state, ...payload };
        case RESET_STATE: // 清空 state;
            return { ...initialState };
        default:
            throw new Error(`未支援的 MPBFormContext action type: ${type}`)
    }
};

export const CommentsDialogContext = createContext();

export const CommentsDialogContextProvider = React.memo(styled(props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { variant = 'common', open, title, maxWidth, fullWidth, severity, confirmTitle, confirmText, cancelText, onConfirm } = state;

    const { key: commentsKey, title: defaultTitle, confirmText: defaultConfirmText, cancelText: defaultCancelText,
        comments: defaultComments, confirmTitle: defaultConfirmTitle, confirmContent: defaultConfirmContent,
    } = COMMENTS_VARIANTS[variant];

    const [comments, setComments] = useState(defaultComments);

    const { setDialog: setConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmDialog();

    const commentsChangeHandler = useCallback(e => setComments(e.target.value), []);

    // 關閉 dialog 後動作
    const exitHandler = useCallback(() => {
        setComments(defaultComments);
    }, [defaultComments]);

    // 確認發出邀請
    const doConfirm = useCallback(() => {
        onConfirm(comments);
        console.log({ commentsKey, comments })
        addHistory(commentsKey, comments); // 將訊息加入 history
        closeConfirmDialog();
    }, [onConfirm, comments]);

    // 確認 handler
    const confirm = () => {
        setConfirmDialog({
            title: confirmTitle || defaultConfirmTitle, open: true, onCancel: closeConfirmDialog, onConfirm: doConfirm, severity,
            content: defaultConfirmContent
        });
    };

    // 取消 handler
    const cancel = () => dispatch({ type: RESET_STATE });

    return (
        <CommentsDialogContext.Provider value={{ state, dispatch }}>
            <DraggableDialog open={open} maxWidth={maxWidth} fullWidth={fullWidth} className={props.className}
                TransitionComponent={SlideUpTransition} TransitionProps={{ onExit: exitHandler }}>

                <IconnedDialogTitle icon={CommentIcon} title={title || defaultTitle} />

                <DialogContent>
                    <HisTextField autoFocus storageKey={commentsKey} multiline fullWidth
                        minRows={5} maxRows={10} value={comments} onChange={commentsChangeHandler} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={cancel} fullWidth variant="contained" startIcon={<CancelOutlinedIcon />}>{cancelText || defaultCancelText}</Button>
                    <Button onClick={confirm} fullWidth variant="contained" color="secondary" startIcon={<SendIcon />}>{confirmText || defaultConfirmText}</Button>
                </DialogActions>
            </DraggableDialog>

            {props.children}
        </CommentsDialogContext.Provider>
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

export const useCommentsDialog = () => {
    const { state, dispatch } = useContext(CommentsDialogContext);
    const setDialog = useCallback(dialog => dispatch({ type: SET_STATE, payload: dialog }), []);

    const openDialog = useCallback(({ title, content, severity = 'info' }) =>
        dispatch({ type: SET_STATE, payload: { title, content, severity, open: true } })
        , []);

    const closeDialog = useCallback(() => dispatch({ type: RESET_STATE }), []);

    return { openDialog, closeDialog, setDialog };
};