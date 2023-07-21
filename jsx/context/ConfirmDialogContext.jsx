import { ConfirmDialog } from 'Components';
import React, { createContext, useCallback, useContext, useReducer } from 'react';

export const SET_STATE = 'setState'; // 設定 state
export const RESET_STATE = 'resetState'; // 重置 state
export const SET_FORM_STATE = 'setFormState'; // 設定 form state

const initialState = {
    open: false, title: '', content: '', severity: 'info', confirmText: '', cancelText: '', onCancel: undefined, onConfirm: undefined
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
}

export const ConfirmDialogContext = createContext();

export const ConfirmDialogContextProvider = React.memo(props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { open, title, content, severity, confirmText, cancelText, onCancel, onConfirm } = state;

    const closeDialog = useCallback(() => dispatch({ type: SET_STATE, payload: { open: false } }), []);

    const cancelDialog = useCallback(() => {
        if (onCancel) {
            onCancel() && closeDialog();
        } else {
            closeDialog();
        }
    }, [onCancel]);

    const confirmDialog = useCallback(() => {
        if (onConfirm) {
            onConfirm() && closeDialog();
        } else {
            closeDialog();
        }
    });

    return (
        <ConfirmDialogContext.Provider value={{ state, dispatch }}>
            <ConfirmDialog open={open} title={title} content={content} severity={severity}
                confirmText={confirmText} cancelText={cancelText}
                onCancel={onCancel ? cancelDialog : undefined}
                onConfirm={onConfirm ? confirmDialog : closeDialog}
                onClose={closeDialog} />

            {props.children}
        </ConfirmDialogContext.Provider>
    );
});

export const useConfirmDialog = () => {
    const { state, dispatch } = useContext(ConfirmDialogContext);
    const setDialog = useCallback(dialog => dispatch({ type: SET_STATE, payload: dialog }), []);

    const openDialog = useCallback(({ title, content, severity = 'info', confirmText, cancelText }) =>
        dispatch({ type: SET_STATE, payload: { title, content, severity, open: true, confirmText, cancelText } })
        , []);

    const closeDialog = useCallback(() => dispatch({ type: RESET_STATE }), []);

    return { openDialog, closeDialog, setDialog };
};
